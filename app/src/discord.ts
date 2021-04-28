import { Client, Message, MessageEmbed, Snowflake } from "discord.js";
import OpenAI from "openai-api";
import { inspect } from "util";
import { discordToken, gptToken } from "./token";

class State {
    openai: OpenAI;
    client: Client;
    
    history: Array<string> = [];

    allowedChannels: Array<Snowflake> = [
        // "432713268755300382", // guh
        // "835743861892579378", // raddest
        "837068363691458661", // mine
    ];

    chatBaseTemplate = 
    "The following is a conversation with an AI assistant."
    + " The assistant is helpful, creative, clever, and very friendly.\n\n"
    + "Human: Hello, who are you?\n"
    + "AI: I am an AI. How can I help you today?\n"
    + "Human: %s\n"
    + "AI:";
    chatFollowUpTemplate = "Human: %s\nAI:";

    basePrompt: string = this.chatBaseTemplate;
    followUpPrompt: string = this.chatFollowUpTemplate;    

    pushLine(line: string, edit?: boolean) {
        if (edit===true && this.history.length > 0) {
            let msg = this.history[this.history.length-1];
            msg = msg + line;
            this.history[this.history.length-1] = msg;
        } else {
            this.history.push(line);
        }
        while (this.getPrompt("").full.length > 800) {
            this.history = this.history.slice(1);
        }
    }

    clearHistory() {
        this.history = [];
    }

    getPrompt(msg: string): {
        mode: "raw" | "chat";
        full: string;
        new: string;
    } {
        if (msg.startsWith(".")) {
            return {
                mode: "raw",
                full: (this.history.join("\n") + "\n" + msg.substr(1)).trim() + (msg.length === 1 ? "\n" : ""),
                new: msg.substr(1).trim(),
            };
        } else {
            if (this.history.length === 0) {
                const line = this.basePrompt.replace(/%s/, msg).trim();
                return {
                    mode:"chat",
                    full: line,
                    new: line,
                };
            } else {
                let line = this.history.join("\n") + "\n";
                const x = this.followUpPrompt.replace(/%s/, msg).trim();
                line += x
                return {
                    mode:"chat",
                    full: line,
                    new: x,
                };
            }
        }
    }

    async getResponse(prompt: string, options: any): Promise<string | undefined> {
        const gptResponse = await state.openai.complete({
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
            ...options,
        });
        console.dir(gptResponse.data);
        const text: string = gptResponse.data.choices[0].text.replace(/\\n/g, "\n");
        const isEmpty = text.match(/^\s*$/);
        return isEmpty ? undefined : text;
    }
}

const state: State = new State();

async function handleMessage(state: State, msg: Message) {
    if (msg.content.startsWith("!eval")) {
        try {
            if (msg.author.id != "159018622600216577") {
                throw new Error("not authorized");
            }
            msg.channel.send(new MessageEmbed().setDescription(`>${inspect(eval(msg.content.substr(5))).substr(0, 2047)}`))
        } catch (error) {
            msg.channel.send(new MessageEmbed().setDescription(`Error:${error}`));
        }
        return;
    }
    // "comments"
    if (msg.content.startsWith("#")) {
        return;
    }

    // clear history
    if (msg.content.startsWith("!")) {
        state.clearHistory();
        if (msg.content.length === 0) return;
        msg.content = msg.content.substr(1);
    }

    const options:Record<string,any> = {};
    if (msg.content.startsWith("~~")) {
        msg.content = msg.content.substr(2);
    } else if (msg.content.startsWith("~")) {
        msg.content = msg.content.substr(1);
        options.stop = ["Human:", "AI:"];
    } else {
        options.stop = ["\n", " Human:", " AI:"];
    }

    console.dir(state.history);

    // get prompt
    const prompt = state.getPrompt(msg.content);
    console.log(prompt.full);

    // get response
    const response = await state.getResponse(prompt.full, options);
    console.log(response);

    // bad response
    if (response === undefined) {
        await msg.channel.send("`Invalid response received.`");
        state.clearHistory();
        return;
    }

    // good response

    // save prompt
    state.history.push(prompt.new);

    // save response
    if (prompt.mode === "chat") {
        state.pushLine(response, true);
    } else {
        state.pushLine(response);
    }

    // send response
    await msg.channel.send(response);
}


export async function start() {
    state.openai = new OpenAI(gptToken);
    state.client = new Client();
    state.client.login(discordToken)
    state.client.on("ready", () => {
        console.log(`Discord client ready as ${state.client.user.tag}`);
    });
    state.client.on("message", async msg => {
        try {
            if (!state.allowedChannels.includes(msg.channel.id)) return;
            if (msg.author.id === "431980306111660062") return;
            handleMessage(state, msg);
        } catch (e) {
            console.log("Error encountered handling message");
            console.error(e);
        }
    });
}