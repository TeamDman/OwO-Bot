import { Client, Message, MessageEmbed, ReactionCollector, } from "discord.js";
import { token } from "./token";
import { users } from "./users";
import { dayNames, getTimeSlotDate, isSameDay, toggleRestDay, sync } from "./workout";

const syncEmoji = "🔄";
const dayEmojis = ["🥞", "🧇", "🍋", "🍞", "🥐", "🥖", "🥨"]


export function buildEmbed(): MessageEmbed {
    const date = new Date();
    const embed = new MessageEmbed()
    .setColor("#F3B233")
    .setTitle("Fit4Less Summary")
    .setURL("https://myfit4less.gymmanager.com/portal/booking/index.asp")
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
    return embed;
}

function buildCollector(embedMessage: Message, emojiLookup: Record<string, Date>): ReactionCollector {
    const collector = new ReactionCollector(
        embedMessage,
        () => true,
        { time: 180000 }
    );
    collector.on("collect", async (reaction, user) => {
        const workoutUser = users.find(u => u.discordId === user.id);
        if (!workoutUser) return;
        if (reaction.emoji.name === syncEmoji) {
            await sync();
            await embedMessage.edit(buildEmbed());
        } else {
            const isResting = toggleRestDay(workoutUser, emojiLookup[reaction.emoji.name]);
            const dayName = dayNames[dayEmojis.findIndex(e => e === reaction.emoji.name)];
            if (isResting) {
                reaction.message.channel.send(`<@${workoutUser.discordId}> is now resting this ${dayName}. Auto-booking disabled. `);
            } else {
                reaction.message.channel.send(`<@${workoutUser.discordId}> is no longer resting this ${dayName}. Auto-booking enabled.`);
            }
        }
    });
    return collector;
}

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
                const date = new Date(Date.now());
                const embed = buildEmbed();
                const embedMsg = await msg.channel.send(embed);
                const emojiLookup: Record<string, Date> = {};
                date.setTime(Date.now());
                for (let i = 0; i < 3; i++) {
                    const emoji = dayEmojis[date.getDay()];
                    await embedMsg.react(emoji);
                    emojiLookup[emoji] = new Date(date);
                    date.setDate(date.getDate() + 1);
                }
                await embedMsg.react(syncEmoji);
                buildCollector(embedMsg, emojiLookup);
            }
        } catch (e) {
            console.log("Error encountered handling message");
            console.error(e);
        }
    });
}