import { Cookie } from "set-cookie-parser";

interface User {
    name: string;
    creds: UserCredential;
    discordId: string;
    latestSlots?: UserTimeSlotInfo;
    latestCookie?: UserCookie;
    weekendPreferences?: Array<string>;
    weekdayPreferences?: Array<string>;
    restDays?: Date[];
}

interface UserTimeSlotInfo {
    reservations: TimeSlot[],
    availabilities: TimeSlot[],
}

type UserCookie = Cookie[];

type TimeSlot = {
    id: string;
    club?: string;
    date?: string;
    time?: string;
};

interface UserCredential {
    emailaddress: string;
    password: string;
}
