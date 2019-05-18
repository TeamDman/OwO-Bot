import {Client, Message, MessageAttachment, MessageEmbed} from 'discord.js';
import * as logger                                        from '../logger';
import {ListenerTask}                                     from '../tasks';
import {Task}                                             from '../index';

function getInfo(message: Message) {
    return `${message.guild}\t#${'name' in message.channel && message.channel.name || 'UNKNOWN CHANNEL'}\t<@${message.author.id}> (${message.author.tag})`;
}

export default {
    allowConcurrent: false,
    autoStart: false,
    description: "Creates the role controller message.",
    name: "FTBRolesSend",
    runningCount: 0,
    start: (client: Client) => {

    },
    stop: (client: Client) => {

    },
} as Task