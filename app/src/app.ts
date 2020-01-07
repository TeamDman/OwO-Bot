import * as commands          from './commands';
import {config as dotenvInit} from 'dotenv';
import * as discord           from 'discord.js';
import * as logger            from './logger';
import * as tasks             from './tasks';
import config                 from './config';


console.log(String.raw`   ____           ____     ____        __ `);
console.log(String.raw`  / __ \_      __/ __ \   / __ )____  / /_`);
console.log(String.raw` / / / / | /| / / / / /  / __  / __ \/ __/`);
console.log(String.raw`/ /_/ /| |/ |/ / /_/ /  / /_/ / /_/ / /_  `);
console.log(String.raw`\____/ |__/|__/\____/  /_____/\____/\__/  `);
process.stdout.write('Loading');
let loading = setInterval(() => process.stdout.write('.'), 500);

dotenvInit();

const client = new discord.Client();
client.on('ready', () => {
    clearInterval(loading);
    console.log();

    client.user.setActivity(config.bot.presence, {type: config.bot['presence type']}).catch(logger.error);
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