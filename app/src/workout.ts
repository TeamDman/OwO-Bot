import jsdom from "jsdom";
import fetch from "node-fetch"
import setCookieParser from "set-cookie-parser";
import { User, UserCookie, TimeSlot, UserCredential, UserTimeSlotInfo } from "./workout.d"
import { users } from "./users";
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


async function getLoginCookies(): Promise<UserCookie> {
    let resp = await fetch("https://myfit4less.gymmanager.com/portal/login.asp", {
        "method": "GET",
    });
    return setCookieParser.parse(resp.headers.raw()["set-cookie"]);
}

async function loginUser(creds: UserCredential): Promise<UserCookie> {
    const cookie = encodeCookies(await getLoginCookies());
    const body = "emailaddress="
        + encodeFormData(creds.emailaddress)
        + "&password="
        + encodeFormData(creds.password);

    const resp = await fetch(
        "https://myfit4less.gymmanager.com/portal/login_done.asp",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                cookie,
            },
            body,
        }
    );
    return setCookieParser.parse(resp.headers.raw()["set-cookie"]);
}

async function getTimeSlots(userCookie: UserCookie, responseText?: string): Promise<UserTimeSlotInfo> {
    let text = responseText;
    if (!text) {
        const resp = await fetch("https://myfit4less.gymmanager.com/portal/booking/index.asp", {
            headers: {
                cookie: encodeCookies(userCookie),
            }
        });
        text = await resp.text();
    }
    const dom = new jsdom.JSDOM(text);
    const reservations = Array.from(dom.window.document.querySelectorAll(".reserved-slots > .time-slot")).map(x => parseTimeSlot(x));
    const availabilities = Array.from(dom.window.document.querySelectorAll(".available-slots > .time-slot")).map(x => parseTimeSlot(x));
    return {
        reservations,
        availabilities,
    };
}

async function reserveTimeSlot(userCookie: UserCookie, slot: TimeSlot) {
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
                cookie: encodeCookies(userCookie),
            },
            body,
        }
    );
    const text = await resp.text();
    console.log(`Slot booked.`);
    return getTimeSlots(userCookie, text);
}

async function reserveBestTimeSlot(userCookie: UserCookie, date: Date, slots: UserTimeSlotInfo) {
    if (slots.reservations.length >= 2) {
        console.log("All reservations booked, skipping...");
        return;
    }
    if (slots.availabilities.length === 0) {
        console.log("No slots available, skipping...");
        return;
    }
    const isWeekend = date.getDay() == 0 || date.getDay() == 6;
    const weekendPreferences = ["at 3:30 PM", "at 2:00 PM"];
    const weekdayPreferences = ["at 7:00 PM", "at 8:30 PM"];
    const targetTimes = isWeekend ? weekendPreferences : weekdayPreferences;
    const bestSlot: TimeSlot | undefined = targetTimes
        .map(time => slots.availabilities
            .find(slot => slot.time === time))
        .find(slot => slot !== undefined);
    if (bestSlot !== undefined) {
        console.log(`Found preferred slot ${bestSlot.club} ${bestSlot.date} ${bestSlot.time}, booking...`);
        return await reserveTimeSlot(userCookie, bestSlot);
    }
    console.log("No preferred slots found.");
}

function setDate(cookie: UserCookie, date: string): UserCookie {
    const rtn = cookie.filter(x => x.name !== "dp%5Fdate");
    rtn.push({
        name: "dp%5Fdate",
        value: date,
    });
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
    cookie = await loginUser(user.creds);
    for (let i = 0; i < 3; i++) {
        cookie = setDate(cookie, toISOString(targetDate));
        slots = await getTimeSlots(cookie);
        console.log(`Reserving for ${user.name} on date ${toISOString(targetDate)} (${dayNames[targetDate.getDay()]}). ${slots.reservations.length} reservations and ${slots.availabilities.length} availabilities.`);
        reserveBestTimeSlot(cookie, targetDate, slots);
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

export async function main() {
    const workoutEnd = new Date(Date.now());
    const checkAnyways = new Date(Date.now());
    while (true) {
        if (Date.now() < Math.min(workoutEnd.getTime(), checkAnyways.getTime())) {
            await sleep(1000);
            continue;
        }
        checkAnyways.setTime(Date.now() + 1000*60*30);
        for (const user of users) {
            const slots = await ensureWorkoutsBooked(user);
            for (const slot of slots.reservations) {
                const endDate = new Date(Date.parse(slot.date + " " + slot.time.substr(3)));
                endDate.setTime(endDate.getTime() + 1000 * 60 * 60); // ensure date is at end of workout
                if (workoutEnd.getTime() < Date.now() || workoutEnd > endDate) {
                    workoutEnd.setTime(endDate.getTime());
                }
            }
            user.latestSlots = slots;
        }
        const nextCheck = workoutEnd < checkAnyways ? workoutEnd : checkAnyways;
        console.log(`Checking again at ${toISOString(nextCheck)} (${dayNames[nextCheck.getDay()]}) ${formatHours(nextCheck)}`)
    }

}
