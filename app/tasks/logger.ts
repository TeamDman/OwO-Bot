import {Message, MessageAttachment, MessageEmbed} from 'discord.js';
import * as logger                                from '../logger';
import {ListenerTask}                             from '../tasks';
import {Task}                                     from '../index';

function getInfo(message: Message) {
    return `${message.guild}\t#${'name' in message.channel && message.channel.name || 'UNKNOWN CHANNEL'}\t<@${message.author.id}> (${message.author.tag})`;
}

export default new ListenerTask('Logger', {
    'messageDelete': (message: Message) => {
        if (message.author.bot) return;
        logger.info(`!!! ${getInfo(message)}\t${message.content}`);
        message.embeds.forEach((embed: MessageEmbed) => logger.info(`!!! ${getInfo(message)}\t${embed.type}embed:${embed.url}`));
        // noinspection SpellCheckingInspection
        message.attachments.forEach((attachment: MessageAttachment) => logger.info(`!!! ${getInfo(message)}\turl:${attachment.url}`));
    },
    'messageUpdate': (original: Message, updated: Message) => {
        if (original.author.bot) return;
        if (original.content === updated.content) return;
        const line = `*** ${getInfo(original)}\t`;
        logger.info(`${line}${original.content}`);
        logger.info(`${line.replace(/[^\t]/g, ' ')}${updated.content}`);
    }
}) as Task;