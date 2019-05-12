import {createWriteStream}                       from 'fs';
import config                                    from './config';
import {MessageContent}                          from './index';
import {DMChannel, Guild, GuildChannel, Message} from 'discord.js';
import {getChannel}                              from './utils';

const stream = createWriteStream(config.bot['log file'], {flags: 'a'});

export function augment(text: string): string {
    return `[${new Date().toLocaleString('en-ca')}] ${text}\n`;

}

export function info(text: string): void {
    if (text === null) return;
    let s = augment(`[INFO] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}

export async function report(context: Guild, content: MessageContent): Promise<void> {
    if (!(context.id in config.bot['bot logger report channels (guild:channel)']))
        return;
    let channel = getChannel(context, config.bot['bot logger report channels (guild:channel)'][context.id]);
    if (channel === null)
        return;
    await channel.send(content);
}

export function warn(text: string): void {
    if (text === null) return;
    let s = augment(`[WARNING] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}

export function error(text: string): void {
    if (text === null) return;
    let s = augment(`[ERROR] ${text}`);
    process.stderr.write(s);
    stream.write(s);
}

export function strip(v: MessageContent): string {
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