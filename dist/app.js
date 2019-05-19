"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands = require("./commands");
const dotenv_1 = require("dotenv");
const discord = require("discord.js");
const logger = require("./logger");
const tasks = require("./tasks");
const config_1 = require("./config");
console.log(String.raw `   ____           ____     ____        __ `);
console.log(String.raw `  / __ \_      __/ __ \   / __ )____  / /_`);
console.log(String.raw ` / / / / | /| / / / / /  / __  / __ \/ __/`);
console.log(String.raw `/ /_/ /| |/ |/ / /_/ /  / /_/ / /_/ / /_  `);
console.log(String.raw `\____/ |__/|__/\____/  /_____/\____/\__/  `);
process.stdout.write('Loading');
let loading = setInterval(() => process.stdout.write('.'), 500);
dotenv_1.config();
const client = new discord.Client();
client.on('ready', () => {
    clearInterval(loading);
    console.log();
    client.user.setActivity(config_1.default.bot.presence, { type: config_1.default.bot['presence type'] }).catch(logger.error);
    logger.info(`Logged in as ${client.user.username}\nMonitoring ${client.users.size} users in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    tasks.init(client);
    commands.init();
    client.on('message', commands.onMessage);
});
client.on('error', logger.error);
client.login(process.env.DISCORD_TOKEN).catch(e => {
    clearInterval(loading);
    logger.error(`\nFailed to log in, aborting: ${e}`);
});
//# sourceMappingURL=app.js.map