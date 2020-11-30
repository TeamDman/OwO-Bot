import { Client, MessageEmbed, } from "discord.js";
import { token } from "./token";
import { users } from "./users";
import { dayNames, getTimeSlotDate, isSameDay } from "./workout";


const dayEmojis = ["🥞", "🧇", "🍋", "🍞", "🥐", "🥖", "🥨"]
export function start() {
    const client = new Client();
    client.login(token)
    client.on("ready", () => {
        console.log(`Discord client ready as ${client.user.tag}`);
    });
    client.on("message", async msg => {
        try {
            if (msg.channel.id !== "677334390963175434") return;
            if (msg.mentions.users.has("782831608964710400")) {
                msg.react("606522709475590194");
            }
            if (msg.content.startsWith("!fit")) {
                const embed = new MessageEmbed()
                    .setColor("#F3B233")
                    .setTitle("Fit4Less Summary")
                    .setURL("https://myfit4less.gymmanager.com/portal/booking/index.asp")
                const date = new Date(Date.now());
                for (let i = 0; i < 3; i++) {
                    const header = dayNames[date.getDay()];
                    let body = users.filter(user => user.latestSlots)
                        .map(user => ({
                            name: user.name,
                            slot: user.latestSlots.reservations
                                .find(slot => isSameDay(getTimeSlotDate(slot), date))
                        }))
                        .filter(user => user.slot)
                        .map(user => `(${user.slot.time}) ${user.name}`)
                        .join("\n");
                    if (body === "") {
                        body = "None";
                    }
                    embed.addField(header, body, true);
                    date.setDate(date.getDate() + 1);
                }
                const embedMsg = await msg.channel.send(embed);
                date.setTime(Date.now());
                for (let i = 0; i < 3; i++) {
                    await embedMsg.react(dayEmojis[date.getDay()]);
                    date.setDate(date.getDate()+1);
                }
            }
        } catch (e) {
            console.log("Error encountered handling message");
            console.error(e);
        }
    });
}