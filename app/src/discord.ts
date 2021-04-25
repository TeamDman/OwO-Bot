import { Client, MessageEmbed } from "discord.js";
import OpenAI from "openai-api";
import { inspect } from "util";
import { discordToken, gptToken } from "./token";

let client: Client;
export function getClient() {
    return client;
}
let lines = [];
let allowedChannels = [
    "432713268755300382", // guh
    "835743861892579378", // raddest
]
export async function start() {
    const openai = new OpenAI(gptToken);
    client = new Client();
    client.login(discordToken)
    client.on("ready", () => {
        console.log(`Discord client ready as ${client.user.tag}`);
    });
    client.on("message", async msg => {
        try {
            if (!allowedChannels.includes(msg.channel.id)) return;
            if (msg.author.id === "431980306111660062") return;
            if (msg.content.startsWith("!eval")) {
                try {
                    if (msg.author.id != "159018622600216577") {
                        throw new Error("not authorized");
                    }
                    msg.channel.send(new MessageEmbed().setDescription(`>${inspect(eval(msg.content.substr(5))).substr(0, 2047)}`))
                } catch (error) {
                    msg.channel.send(new MessageEmbed().setDescription(`Error:${error}`));
                }
            } else {
                let prompt = lines.join("\n") + "\n";
                let humanResponse: string;
                if (msg.content === "!") {
                    lines = [];
                } else if (msg.content.substr(0, 1) == ".") {
                    humanResponse = msg.content.substr(1);
                } else {
                    humanResponse = "Human: " + msg.content;
                }
                prompt += humanResponse;
                prompt = prompt.trim();
                prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?` + "\n" + prompt + "\n" + "AI:";
                console.log(prompt);
                const gptResponse = await openai.complete({
                    engine: "davinci",
                    prompt,
                    maxTokens: 158,
                    temperature: 0.9,
                    topP: 1,
                    frequencyPenalty: 0,
                    presencePenalty: 0.6,
                    bestOf: 1,
                    n: 1,
                    stream: false,
                    stop: ["\n", " Human:", " AI:"]
                });
                console.dir(gptResponse.data);
                const text: string = gptResponse.data.choices[0].text.replace(/\\n/g, "\n");
                const isEmpty = text.match(/^\s*$/);
                if (isEmpty) {
                    await msg.channel.send("`Invalid response received.`");
                    lines = [];
                } else {
                    lines.push(humanResponse);
                    lines.push("AI: " + text);
                    lines = lines.slice(lines.length - 8, lines.length)
                    await msg.channel.send(text);
                }

            }
        } catch (e) {
            console.log("Error encountered handling message");
            console.error(e);
        }
    });
}