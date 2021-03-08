import * as fs from "fs";
import { dayNames, isSameDay } from "./util";
import { User } from "./workout.d";
import { inspect } from "util";
import * as path from "path";

const fileName = "./state.json";


export interface WorkoutState {
    users: Array<User>
}

// import state from json
export const state = require(path.join("..", fileName)) as WorkoutState;

// correct rest days to Date objects
state.users.forEach(user => user.restDays = user.restDays.map(str => new Date(str)));

/**
 * Write the state object to disk.
 * Should be called after making changes to state object that should be persisted.
 */
export function writeState() {
    pruneRestDays();
    console.log("Writing state");
    // console.log(inspect(state, false, 10));
    fs.writeFile(fileName, JSON.stringify(state, null, 4), function writeJSON(err) {
        if (err) return console.error(err);
        console.log("State updated");
    });
}

/**
 * Remove from the state all rest days that have already passed.
 * This prevents the state file from getting bloated with unneeded data.
 * Called by writeState
 */
function pruneRestDays() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    for (const user of state.users) {
        user.restDays = user.restDays?.filter(d => d > yesterday) ?? [];
    }
}

/**
 * Update user's state with rest day preference.
 * Returns True if now resting
 */
export function toggleRestDay(user: User, date: Date): boolean {
    const alreadyResting = user.restDays.find(rest => isSameDay(rest, date));
    if (alreadyResting) {
        user.restDays = user.restDays.filter(rest => !isSameDay(rest, date));
        return false;
    } else {
        user.restDays.push(date);
        return true;
    }
}

/**
 * Gets a user from their discordId
 */
export function getUser(discordId: string): User | undefined {
    if (discordId === undefined) throw new Error("discordId cannot be undefined");
    return state.users.find(user => user.discordId === discordId);
}

/**
 * Gets the timeslots the user preferrs for the given date
 */
export function getPreferredSlots(user: User, date: Date) {
    const isWeekend = date.getDay() == 0 || date.getDay() == 6;
    const preferred = (isWeekend 
            ? user?.weekendPreferences
            : user?.weekdayPreferences
        ) ?? [];
    return preferred;
}

/**
 * Modify a user's booking preferences
 */
export function modifyAvailability(
    user: User,
    dayType: "weekend" | "weekday",
    action: "add" | "remove",
    slot: string
): void {
    if (dayType === "weekday") {
        user.weekdayPreferences = user?.weekdayPreferences ?? [];
        if (action === "add") {
            user.weekdayPreferences.push(slot);
        } else if (action === "remove") {
            user.weekdayPreferences = user.weekdayPreferences
                .filter(val => val !== slot);
        }
    } else if (dayType === "weekend") {
        user.weekendPreferences = user?.weekendPreferences ?? [];
        if (action === "add") {
            user.weekendPreferences.push(slot);
        } else if (action === "remove") {
            user.weekendPreferences = user.weekendPreferences
                .filter(val => val !== slot);
        }
    }
}