import { Client, MessageEmbed, ReactionCollector, } from "discord.js";
import { token } from "./token";
import { users } from "./users";
import { dayNames, getTimeSlotDate, isSameDay, toggleRestDay } from "./workout";


const dayEmojis = ["🥞", "🧇", "🍋", "🍞", "🥐", "🥖", "🥨"]
export function start() {
    const client = new Client();
    client.login(token)
    client.on("ready", () => {
        console.log(`Discord client ready as ${client.user.tag}`);
    });
    client.on("message", async msg => {
        try {
            if (msg.channel.id !== "677334390963175434" && msg.channel.id !== "432713268755300382") return;
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
                const emojiLookup:Record<string, Date> = {};
                for (let i = 0; i < 3; i++) {
                    const emoji = dayEmojis[date.getDay()];
                    await embedMsg.react(emoji);
                    emojiLookup[emoji] = new Date(date);
                    date.setDate(date.getDate() + 1);
                }
                const collector = new ReactionCollector(
                    embedMsg, 
                    () => true,
                    { time: 180000 }
                );
                collector.on("collect", (reaction, user) => {
                    const workoutUser = users.find(u => u.discordId === user.id);
                    if (workoutUser) {
                        const isResting = toggleRestDay(workoutUser, emojiLookup[reaction.emoji.name]);
                        const dayName = dayNames[dayEmojis.findIndex(e => e === reaction.emoji.name)];
                        if (isResting) {
                            reaction.message.channel.send(`<@${workoutUser.discordId}> is now resting this ${dayName}. Auto-booking disabled. `);
                        } else {
                            reaction.message.channel.send(`<@${workoutUser.discordId}> is no longer resting this ${dayName}. Auto-booking enabled.`);
                        }
                    }
                });
            }
        } catch (e) {
            console.log("Error encountered handling message");
            console.error(e);
        }
    });
}