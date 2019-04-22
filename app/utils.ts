import {Channel, Client, Guild, GuildMember, Message, Role, User} from 'discord.js';
import * as logger from './logger';

export function getRole(context: Message, identifier: any): Role {
    if (typeof identifier === 'string') {
        if ((identifier = identifier.replace(/\s+/g, '_').toLowerCase()).match(/\d+/g)) {
            identifier = identifier.match(/\d+/g);
        }
    }
    // for (let guild of context.guilds.values()) {
        for (let role of context.guild.roles.values()) {
            if (role.id == identifier || role.name.replace(/\s+/g, '_').toLowerCase() == identifier) {
                return role;
            }
        }
    // }
    return null;
}

export function getChannel(context: Client, identifier: any): Channel {
    if (typeof identifier === 'string') {
        if (identifier.match(/\d+/g)) {
            identifier = identifier.match(/\d+/g);
        }
    }
    for (let guild of context.guilds.values()) {
        for (let channel of guild.channels.values()) {
            if (channel.id == identifier || channel.name == identifier) {
                return channel;
            }
        }
    }
    return null;
}

export function getMember(context: Message, identifier: any): GuildMember {
    if (typeof identifier === 'string') {
        if ((identifier = identifier.replace(/\s+/g, '_').toLowerCase()).match(/\d+/g)) {
            identifier = identifier.match(/\d+/g);
        }
    }
    for (let member of context.guild.members.values()) {
        if (member.id == identifier || member.user.username.replace(/\s+/g, '_').toLowerCase() == identifier) {
            return member;
        }
    }
    return null;
}

export async function createPaginator(sourceMessage: Message, message: Message, next, prev): Promise<void> {
    const emojinext = '▶';
    const emojiprev = '◀';
    const emojistop = '❌';
    try {
        await message.react(emojiprev);
        await message.react(emojinext);
        // await message.react(emojistop);
        let handle = (reaction, user) => {
            if (reaction.message.id !== message.id) {
                return;
            }
            if (user.id !== sourceMessage.author.id ||
                reaction.emoji.name !== emojinext &&
                reaction.emoji.name !== emojiprev &&
                reaction.emoji.name !== emojistop) {
                return;
            }
            switch (reaction.emoji.name) {
                case emojinext:
                    next();
                    break;
                case emojiprev:
                    prev();
                    break;
                case emojistop:
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
            const id = input.replace(/<|!|>|@/g, '');
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
            const channel: any = context.client.channels.get(input.replace(/<|#|>/g, ''));
            if (channel) return `#${channel.name}`;
            return input;
        })
        .replace(/<@&[0-9]+>/g, input => {
            if (context.channel.type === 'dm' || context.channel.type === 'group') return input;
            const role = context.guild.roles.get(input.replace(/<|@|>|&/g, ''));
            if (role) return `@${role.name}`;
            return input;
        });
}
