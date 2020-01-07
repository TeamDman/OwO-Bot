import {Client, Guild, GuildMember, Message, RichEmbed, Role, TextChannel} from 'discord.js';
import * as logger                                                         from './logger';
import {warn}                                                              from './logger';
import {MessageContent}                                                    from './index';

export function getRole(context: Guild, identifier: string): Role {
    for (let role of context.roles.values())
        if (role.id == identifier)
            return role;
    for (let role of context.roles.values())
        if (role.name.toLowerCase() == identifier.toLowerCase())
            return role;
    return null;
}

export function getChannel(context: Guild, identifier: string): TextChannel {
    for (let channel of context.channels.values())
        if (channel.id == identifier && channel.type === 'text')
            return channel as any;
    for (let channel of context.channels.values())
        if (channel.name.toLowerCase() == identifier.toLowerCase() && channel.type === 'text')
            return channel as any;
    return null;
}


export function getMember(context: Guild, identifier: string): GuildMember {
    let match = identifier.match(/<@!?(\d+)>/);
    if (match)
        identifier = match[1];
    for (let member of context.members.values())
        if (member.id === identifier)
            return member;
    for (let member of context.members.values())
        if (member.user.username.toLowerCase() == identifier.toLowerCase())
            return member;
    for (let member of context.members.values())
        if (member.nickname && member.nickname.toLowerCase() == identifier.toLowerCase())
            return member;
    return null;
}

export async function createPaginator(sourceMessage: Message, message: Message, next, prev): Promise<void> {
    const emojiNext = '▶';
    const emojiPrev = '◀';
    const emojiStop = '❌';
    try {
        await message.react(emojiPrev);
        await message.react(emojiNext);
        // await message.react(emojiStop);
        let handle = (reaction, user) => {
            if (reaction.message.id !== message.id) {
                return;
            }
            if (user.id !== sourceMessage.author.id ||
                reaction.emoji.name !== emojiNext &&
                reaction.emoji.name !== emojiPrev &&
                reaction.emoji.name !== emojiStop) {
                return;
            }
            switch (reaction.emoji.name) {
                case emojiNext:
                    next();
                    break;
                case emojiPrev:
                    prev();
                    break;
                case emojiStop:
                    message.delete().catch(e => logger.error(e));
                    sourceMessage.delete().catch(e => logger.error(e));
                    break;
                default:
                    logger.error('Something went processing emoji reactions.');
                    break;
            }
        };
        sourceMessage.client.on('messageReactionAdd', handle);
        sourceMessage.client.on('messageReactionRemove', handle);
    } catch (error) {
        logger.error(`Error involving reaction collector. ${error}`);
    }
}

// Borrowed from discord.js impl
export function cleanContent(context: Message, content: string): string {
    return content
        .replace(/@(everyone|here)/g, '@\u200b$1')
        .replace(/<@!?[0-9]+>/g, input => {
            const id = input.replace(/[<!>@]/g, '');
            if (this.channel.type === 'dm' || this.channel.type === 'group') {
                return context.client.users.has(id) ? `@${context.client.users.get(id).username}` : input;
            }

            const member = context.guild.members.get(id);
            if (member) {
                if (member.nickname) return `@${member.nickname}`;
                return `@${member.user.username}`;
            } else {
                const user = context.client.users.get(id);
                if (user) return `@${user.username}`;
                return input;
            }
        })
        .replace(/<#[0-9]+>/g, input => {
            const channel: any = context.client.channels.get(input.replace(/[<#>]/g, ''));
            if (channel) return `#${channel.name}`;
            return input;
        })
        .replace(/<@&[0-9]+>/g, input => {
            if (context.channel.type === 'dm' || context.channel.type === 'group') return input;
            const role = context.guild.roles.get(input.replace(/[<@>&]/g, ''));
            if (role) return `@${role.name}`;
            return input;
        });
}

export async function hackBan(client: Client, identifier: string, reason: string): Promise<MessageContent> {
    let banCount     = 0;
    let hackBanCount = 0;
    for (const [, guild] of client.guilds) {
        const has = guild.members.has(identifier) ? 1 : 0;
        try {
            banCount += has;
            hackBanCount++;
            await guild.ban(identifier, reason);
        } catch (e) {
            banCount -= has;
            hackBanCount--;
            warn(`Failed to ban ${identifier} in guild ${guild.name}. ${e}`);
        }
    }

    return new RichEmbed()
        .setTitle('Chain Ban Results')
        .setColor('RED')
        .addField('Ban Results', `User was banned from [${banCount}] of [${client.guilds.size}] available guilds.`)
        .addField('Hackban results', `User was pre-banned from [${hackBanCount}] of [${client.guilds.size}] available guilds.`)
        .setFooter(new Date().toLocaleString('en-ca'));
}


export async function unHackBan(client: Client, identifier: string, reason: string): Promise<MessageContent> {
    let unbanCount     = 0;
    let count = 0;
    for (const [, guild] of client.guilds) {
        let has = 0;
        try {
            count++;
            has = (await guild.fetchBans()).has(identifier) ? 1 : 0;
            unbanCount += has;
            await guild.unban(identifier, reason);
        } catch (e) {
            unbanCount -= has;
            count--;
            warn(`Failed to unban ${identifier} in guild ${guild.name}. ${e}`);
        }
    }

    return new RichEmbed()
        .setTitle('Chain Ban Results')
        .setColor('GREEN')
        .addField('Unban Results', `User was unbanned from [${unbanCount}] of [${client.guilds.size}] available guilds.`)
        .addField('Unhackban results', `User was un-pre-banned from [${count}] of [${client.guilds.size}] available guilds.`)
        .setFooter(new Date().toLocaleString('en-ca'));
}