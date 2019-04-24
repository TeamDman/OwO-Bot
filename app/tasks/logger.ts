import {Client, Message, MessageAttachment, MessageEmbed, RichEmbed} from 'discord.js';
import {CommandResult, Task}                                         from '../index';
import * as logger                                                   from '../logger';

const listeners =  {
    'messageDelete': (message:Message) => {
        if (message.author.bot) return;
        logger.info(`!!! ${getInfo(message)}\t${message.content}`);
        message.embeds.forEach((embed: MessageEmbed) => logger.info(`!!! ${getInfo(message)}\t${embed.type}embed:${embed.url}`));
        message.attachments.forEach((attachment: MessageAttachment) => logger.info(`!!! ${getInfo(message)}\turl:${attachment.url}`));
    },
    'messageUpdate': (original: Message, updated: Message) => {
        if (original.author.bot) return;
        if (original.content === updated.content) return;
        const line = `*** ${getInfo(original)}\t`;
        logger.info(`${line}${original.content}`);
        logger.info(`${line.replace(/[^\t]/g,' ')}${updated.content}`);
    }
};
let running:boolean = false;

function getInfo(message:Message) {
    return `${message.guild}\t#${'name' in message.channel && message.channel.name || 'UNKNOWN CHANNEL'}\t<@${message.author.id}> (${message.author.tag})`;
}

function start(client: Client): CommandResult {
    if (running)
        return new RichEmbed().setColor('ORANGE').setDescription('Logger task is already running.');
    for (let key of Object.keys(listeners)) {
        client.addListener(key, listeners[key]);
    }
    running = true;

    return new RichEmbed().setColor('GREEN').setDescription('Logger task has been started.');
}

function stop(client: Client): CommandResult {
    if (!running)
        return new RichEmbed().setColor('ORANGE').setDescription('Logger task is not running.');
    for (let key of Object.keys(listeners)) {
        client.removeListener(key, listeners[key]);
    }
    running = false;
    return new RichEmbed().setColor('GREEN').setDescription('Logger task has been stopped.');
}

export default {
    name: 'Logger',
    allowConcurrent: false,
    autoStart: true,
    start,
    stop
} as Task