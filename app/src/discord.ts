import { Client, DiscordAPIError, Message, MessageEmbed, ReactionCollector, TextChannel, } from "discord.js";
import { token } from "./token";
import { users } from "./users";
import { dayNames, getTimeSlotDate, isSameDay, toggleRestDay, sync } from "./workout";
import { inspect } from "util";

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
        { time: 1000*60*5 }
    );
    collector.on("collect", async (reaction, user) => {
        const workoutUser = users.find(u => u.discordId === user.id);
        if (!workoutUser) return;
        if (reaction.emoji.name === syncEmoji) {
            await embedMessage.edit("Updating...");
            await sync();
            await embedMessage.edit("Updated.");
            await embedMessage.edit(buildEmbed());
        } else {
            if (!emojiLookup[reaction.emoji.name]) return;
            const isResting = toggleRestDay(workoutUser, emojiLookup[reaction.emoji.name]);
            const dayName = dayNames[dayEmojis.findIndex(e => e === reaction.emoji.name)];
            if (isResting) {
                reaction.message.channel.send(`<@${workoutUser.discordId}> is now resting this ${dayName}. Auto-booking disabled. `);
            } else {
                reaction.message.channel.send(`<@${workoutUser.discordId}> is no longer resting this ${dayName}. Auto-booking enabled.`);
            }
        }
    });
    collector.on("end", async ()=> {
        await embedMessage.reactions.removeAll();
    })
    return collector;
}

let client: Client;
export function getClient() {
    return client;
}

export async function broadcast(message) {
    try {
        const guild = await client.guilds.cache.get("431514494750031882");
        const channel = await guild.channels.cache.get("677334390963175434") as TextChannel;
        await channel.send(message);
    } catch (e) {
        console.log("Error broadcasting message to channel");
        console.error(e);
    }
}

export function start() {
    client = new Client();
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
            if (msg.content.startsWith("!eval")) {
                try {
                    if (msg.author.id != "159018622600216577") {
                        throw new Error("not authorized");
                    }
                    msg.channel.send(new MessageEmbed().setDescription(`>${inspect(eval(msg.content.substr(5))).substr(0,2047)}`))
                } catch (error) {
                    msg.channel.send(new MessageEmbed().setDescription(`Error:${error}`));
                }
            }
        } catch (e) {
            console.log("Error encountered handling message");
            console.error(e);
        }
    });
}