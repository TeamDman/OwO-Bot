import jsdom from "jsdom";
import fetch from "node-fetch"
import setCookieParser from "set-cookie-parser";
import { User, UserCookie, TimeSlot, UserCredential, UserTimeSlotInfo } from "./workout.d"
import { users } from "./users";
import { broadcast } from "./discord";
function encodeFormData(data: string): string {
    return encodeURIComponent(data).replace(/%20/g, "+");
}

function parseTimeSlot(elem: Element): TimeSlot {
    return {
        id: elem.id.substr("book_".length),
        club: elem.getAttribute("data-slotclub"),
        date: elem.getAttribute("data-slotdate"),
        time: elem.getAttribute("data-slottime")
    }
}

function encodeCookies(cookies: UserCookie): string {
    return cookies.map(e => e.name + "=" + e.value).join("; ")
}

export function toISOString(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
}

export function getTimeSlotDate(slot: TimeSlot): Date {
    return new Date(Date.parse(slot.date));
}


async function getLoginCookies(user: User) {
    let resp = await fetch("https://myfit4less.gymmanager.com/portal/login.asp", {
        "method": "GET",
    });
    user.latestCookie = setCookieParser.parse(resp.headers.raw()["set-cookie"]);
}

async function loginUser(user: User) {
    await getLoginCookies(user);
    const body = "emailaddress="
        + encodeFormData(user.creds.emailaddress)
        + "&password="
        + encodeFormData(user.creds.password);

    const resp = await fetch(
        "https://myfit4less.gymmanager.com/portal/login_done.asp",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                cookie: encodeCookies(user.latestCookie),
            },
            body,
        }
    );
    user.latestCookie = setCookieParser.parse(resp.headers.raw()["set-cookie"]);
}

async function getTimeSlots(user: User, responseText?: string): Promise<UserTimeSlotInfo> {
    let text = responseText;
    if (!text) {
        const resp = await fetch("https://myfit4less.gymmanager.com/portal/booking/index.asp", {
            headers: {
                cookie: encodeCookies(user.latestCookie),
            }
        });
        text = await resp.text();
    }
    // console.log(`Getting slots for ${user.name}`);
    // console.log(text);
    const dom = new jsdom.JSDOM(text);
    const reservations = Array.from(dom.window.document.querySelectorAll(".reserved-slots > .time-slot")).map(x => parseTimeSlot(x));
    const availabilities = Array.from(dom.window.document.querySelectorAll(".available-slots > .time-slot")).map(x => parseTimeSlot(x));
    return {
        reservations,
        availabilities,
    };
}

async function reserveTimeSlot(user: User, slot: TimeSlot) {
    const body = "action=booking"
        + "&block_id=" + slot.id
        + "&block_name="
        + encodeFormData(slot.club) + ", "
        + encodeFormData(slot.date) + ", "
        + encodeFormData(slot.time);
    const resp = await fetch(
        "https://myfit4less.gymmanager.com/portal/booking/submit.asp",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                cookie: encodeCookies(user.latestCookie),
            },
            body,
        }
    );
    const text = await resp.text();
    console.log(`Slot booked.`);
    // console.log(text);
    broadcast(`Reserving time slot ${slot.date} ${slot.time} (${dayNames[getTimeSlotDate(slot).getDay()]}) for <@${user.discordId}>.`);
    return await getTimeSlots(user, text);
}

async function reserveBestTimeSlot(user: User, date: Date): Promise<void> {
    if (user.latestSlots.reservations.some(slot => isSameDay(date, getTimeSlotDate(slot)))) {
        console.log(`[${user.name}] Already booked this day, skipping...`);
        return;
    }
    if (user.latestSlots.reservations.length >= 2) {
        console.log(`[${user.name}] All reservations booked, skipping...`);
        return;
    }
    if (user.latestSlots.availabilities.length === 0) {
        console.log(`[${user.name}] No slots available, skipping...`);
        return;
    }
    if (user.restDays?.find(rest => isSameDay(date, rest))) {
        console.log(`[${user.name}] Rest day, skipping...`);
        return;
    }
    const isWeekend = date.getDay() == 0 || date.getDay() == 6;
    const weekendPreferences = ["at 3:30 PM", "at 2:00 PM"];
    const weekdayPreferences = ["at 7:00 PM", "at 8:30 PM"];
    const targetTimes = isWeekend ? weekendPreferences : weekdayPreferences;
    const bestSlot: TimeSlot | undefined = targetTimes
        .map(time => user.latestSlots.availabilities
            .find(slot => slot.time === time))
        .find(slot => slot !== undefined);
    if (bestSlot !== undefined) {
        console.log(`Found preferred slot ${bestSlot.club} ${bestSlot.date} ${bestSlot.time}, booking...`);
        user.latestSlots = await reserveTimeSlot(user, bestSlot);
        return;
    }
    console.log("No preferred slots found.");
}

function setCookieDate(user: User, date: string): UserCookie {
    const rtn = user.latestCookie.filter(x => x.name !== "dp%5Fdate");
    rtn.push({
        name: "dp%5Fdate",
        value: date,
    });
    user.latestCookie = rtn;
    return rtn;
}

export function isSameDay(first: Date, second: Date) {
    return first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
}

export const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
async function ensureWorkoutsBooked(user: User) {
    let targetDate = new Date(Date.now());
    let cookie: UserCookie;
    let slots: UserTimeSlotInfo;
    await loginUser(user);
    for (let i = 0; i < 3; i++) {
        setCookieDate(user, toISOString(targetDate));
        user.latestSlots = await getTimeSlots(user);
        console.log(`[${user.name}] Reserving on date ${toISOString(targetDate)} (${dayNames[targetDate.getDay()]}). ${user.latestSlots.reservations.length} reservations and ${user.latestSlots.availabilities.length} availabilities.`);
        await reserveBestTimeSlot(user, targetDate);
        targetDate.setDate(targetDate.getDate() + 1);
    }
    return slots;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatHours(date: Date) {
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}

export function toggleRestDay(user: User, date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    user.restDays = user.restDays?.filter(d => d > yesterday) ?? []
    if (user.restDays.find(rest => isSameDay(rest, date))) {
        user.restDays = user.restDays.filter(rest => !isSameDay(rest, date));
        return false;
    } else {
        user.restDays.push(date);
        return true;
    }
}

export const nextCheck = new Date();
export async function sync() {
    console.log(`Syncing ${users.length} users...`);
    for (const user of users) {
        await ensureWorkoutsBooked(user);
        for (const slot of user.latestSlots.reservations) {
            const endDate = new Date(Date.parse(slot.date + " " + slot.time.substr(3)));
            endDate.setTime(endDate.getTime() + 1000 * 60 * 60); // ensure date is at end of workout
            if (nextCheck > endDate) {
                nextCheck.setTime(endDate.getTime());
            }
        }
    }
}

export async function main() {
    while (true) {
        if (Date.now() < nextCheck.getTime()) {
            await sleep(1000);
            continue;
        }
        nextCheck.setTime(Date.now() + 1000 * 60 * 30); // check again in half an hour
        try {
            await sync();
        } catch (e) {
            console.log("Error encountered performing sync");
            console.error(e);
        }
        console.log(`Checking again at ${toISOString(nextCheck)} (${dayNames[nextCheck.getDay()]}) ${formatHours(nextCheck)}`)
    }
}
