import { Client, DiscordAPIError, Message, MessageEmbed, ReactionCollector, TextChannel, } from "discord.js";
import { token } from "./token";
import { state, writeState, getUser, modifyAvailability } from "./persistance";
import { getTimeSlotDate, toggleRestDay, sync } from "./workout";
import { inspect } from "util";
import { dayNames, Day, isSameDay, getDateFromName } from "./util";

const syncEmoji = "🔄";
const dayEmojis = ["🥞", "🧇", "🍋", "🍞", "🥐", "🥖", "🥨"]


export function buildEmbed(): MessageEmbed {
    const date = new Date();
    const embed = new MessageEmbed()
        .setColor("#F3B233")
        .setTitle("Fit4Less Summary")
        .setURL("https://myfit4less.gymmanager.com/portal/booking/index.asp")
    for (let i = 0; i < dayNames.length; i++) {
        const header = dayNames[date.getDay()];
        let body = state.users.filter(user => user.latestSlots)
            .map(user => ({
                name: user.name,
                slot: user.latestSlots.reservations
                    .find(slot => isSameDay(getTimeSlotDate(slot), date)),
                rest: user.restDays.find(day => isSameDay(day, date))
            }))
            .filter(user => user.slot || user.rest)
            .map(user => {
                if (user.slot && user.rest) {
                    return `(${user.slot.time}) ${user.name} (R)`
                } else if (user.slot) {
                    return `(${user.slot.time}) ${user.name}`
                } else if (user.rest) {
                    return `${user.name} (R)`
                }
            })
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
        const workoutUser = getUser(user.id);
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
            writeState();
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
    client.ws.on("INTERACTION_CREATE" as any, async interaction => {
        console.log(inspect(interaction,false,10));
        // "812445651069042729"
        if (interaction.data.name !== "fit") return;

        let cmd = interaction.data.options[0];

        const respond = async data => 
            await (client as any)
                .api
                .interactions(interaction.id, interaction.token)
                .callback
                .post({data});

        const update = async data => 
            await (client as any)
                .api
                .webhooks(client.user.id, interaction.token)
                .messages("@original")
                .patch({data});

        const userId = interaction?.member?.user?.id ?? interaction?.user?.id;

        if (cmd.name === "info") {
            await respond({
                type: 4,
                data: {
                    embeds: [buildEmbed()]
                }
            });
        } else if (cmd.name === "sync") {
            await respond({
                type: 4,
                data: {
                    content:"Updating..."
                }
            });
            await sync();
            // await new Promise((res, rej) => setTimeout(res, 3000));
            await update({
                content:"Updated.",
                embeds: [buildEmbed()]
            });
        } else if (cmd.name == "rest") {
            const user = getUser(userId);
            const day: Day = cmd.options[0].value;
            const date = getDateFromName(day);
            if (!user) {
                await respond({
                    type: 4,
                    data: {
                        content: "No workout user found."
                    }
                });
                return;
            }
            const isResting = toggleRestDay(user, date);
            writeState();
            await respond({
                type: 4,
                data: {
                    content: isResting
                     ? `You are now resting on ${day}.`
                     : `You are no longer resting on ${day}.`
                }
            })
        } else if (cmd.name == "weekday-availability") {
            const user = getUser(userId);
            const action = cmd.options[0].value;
            const slot = cmd.options[1].value;
            if (!user) {
                await respond({
                    type: 4,
                    data: {
                        content: "No workout user found."
                    }
                });
                return;
            }
            modifyAvailability(user, "weekday", action, slot);
            writeState();
            await respond({
                type: 4,
                data: {
                    content:`${action === "add" ? "Added" : "Removed"} ${slot} to your weekday preferences.`
                }
            })
        } else if (cmd.name == "weekend-availability") {
            const user = getUser(userId);
            const action = cmd.options[0].value;
            const slot = cmd.options[1].value;
            if (!user) {
                await respond({
                    type: 4,
                    data: {
                        content: "No workout user found."
                    }
                });
                return;
            }
            modifyAvailability(user, "weekend", action, slot);
            writeState();
            await respond({
                type: 4,
                data: {
                    content:`${action === "add" ? "Added" : "Removed"} ${slot} to your weekend preferences.`
                }
            })
        }
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