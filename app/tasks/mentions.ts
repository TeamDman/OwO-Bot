import {Message, MessageAttachment, MessageEmbed} from 'discord.js';
import * as logger                                from '../logger';
import {ListenerTask}                             from '../tasks';
import {Task}                                     from '../index';
import {isAdmin}                                  from '../utils';

function handle(message: Message) {
    if (message.author.bot) return false;
    if (isAdmin(message.member))
        return message.channel.send("👀").catch(e => console.error(e));

}

export default new ListenerTask('Mentions', {
    'message': handle,
    'messageUpdate': (original: Message, updated: Message) => handle(updated)
}) as Task;