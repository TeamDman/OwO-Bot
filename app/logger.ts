import {createWriteStream}                from 'fs';
import config                             from './config';
import {CommandResult}                    from './index';
import {DMChannel, GuildChannel, Message} from 'discord.js';

const stream = createWriteStream(config['log file'], {flags: 'a'});

export function augment(text: string) {
    return `[${new Date().toLocaleString('en-ca')}] ${text}\n`;

}

export function info(text: string) {
    if (text === null) return;
    let s = augment(`[INFO] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}

export function error(text: string) {
    if (text === null) return;
    let s = augment(`[ERROR] ${text}`);
    process.stderr.write(s);
    stream.write(s);
}

export function strip(v: CommandResult): string {
    if (v === null || v === undefined)
        return null;

    if (typeof v === 'string')
        return v;

    if (typeof v === 'object' && 'description' in v)
        return v.description;

    return null;
}

export function formatMessageToString(message: Message): string {
    return `${
        message.channel.type == 'text' && message.guild.name
        || message.channel.type == 'dm' && 'Direct Messages'
        || 'Unknown Guild'
            }`
        + `\t#${
        message.channel.type == 'text' && (message.channel as GuildChannel).name
        || message.channel.type == 'dm' && (message.channel as DMChannel).recipient.tag
            }`
        + `\t<@${message.author.id}> (${message.author.tag})`
        + `\t${message.content}`;
}