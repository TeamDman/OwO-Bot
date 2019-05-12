import {Client, Message, MessageAttachment, MessageEmbed, RichEmbed} from 'discord.js';
import {MessageContent, Task}                                         from '../index';
import * as logger                                                   from '../logger';
import config                                                        from '../config';

const listeners =  {
    'message': (message:Message) => {
        if (message.author.bot) return;
        if (message.guild.id in config['bot guild:[channel] whitelists'] && !(message.channel.id in config['bot guild:[channel] whitelists'][message.guild.id])) return;
        if (message.content.toLowerCase().indexOf('terracotta') == -1) return;
        if (message.content.toLowerCase().indexOf('where') == -1 && message.content.toLowerCase().indexOf('how') == -1) return;
        message.channel.send('WhErE iS ThE TeRrAcOtTa!?');
    },
};
let running:boolean = false;

function start(client: Client): MessageContent {
    if (running)
        return new RichEmbed().setColor('ORANGE').setDescription('Terracotta task is already running.');
    for (let key of Object.keys(listeners)) {
        client.addListener(key, listeners[key]);
    }
    running = true;

    return new RichEmbed().setColor('GREEN').setDescription('Terracotta task has been started.');
}

function stop(client: Client): MessageContent {
    if (!running)
        return new RichEmbed().setColor('ORANGE').setDescription('Terracotta task is not running.');
    for (let key of Object.keys(listeners)) {
        client.removeListener(key, listeners[key]);
    }
    running = false;
    return new RichEmbed().setColor('GREEN').setDescription('Terracotta task has been stopped.');
}

export default {
    name: 'Terracotta',
    allowConcurrent: false,
    autoStart: true,
    start,
    stop
} as Task