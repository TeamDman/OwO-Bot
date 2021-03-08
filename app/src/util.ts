import { state } from "./persistance";
import { User } from "./workout.d";

export enum Day {
    SUNDAY = "sunday",
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday"
}

export const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

/**
 * Returns True if two date objects represent the same YYYY-MM-DD
 */
export function isSameDay(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
}

/**
 * Gets the index of a day
 */
export function getDayIndex(day: Day): number {
    return dayNames.map(name => name.toLowerCase()).indexOf(day);
}

/**
 * Gets a date object from a day name
 */
export function getDateFromName(day: Day): Date {
    let date = new Date(); // start with 'today';
    const idx = getDayIndex(day);
    while (date.getDay() != idx) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}