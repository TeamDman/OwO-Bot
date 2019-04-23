"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("./logger");
function getRole(context, identifier) {
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
exports.getRole = getRole;
function getChannel(context, identifier) {
    if (typeof identifier === 'string') {
        if (identifier.match(/\d+/g)) {
            identifier = identifier.match(/\d+/g);
        }
    }
    // for (let guild of context.guilds.values()) {
    for (let channel of context.guild.channels.values()) {
        if (channel.id == identifier || channel.name == identifier) {
            return channel;
        }
    }
    // }
    return null;
}
exports.getChannel = getChannel;
function getMember(context, identifier) {
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
exports.getMember = getMember;
function createPaginator(sourceMessage, message, next, prev) {
    return __awaiter(this, void 0, void 0, function* () {
        const emojinext = '▶';
        const emojiprev = '◀';
        const emojistop = '❌';
        try {
            yield message.react(emojiprev);
            yield message.react(emojinext);
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
        }
        catch (error) {
            logger.error(`Error involving reaction collector. ${error}`);
        }
    });
}
exports.createPaginator = createPaginator;
// Borrowed from discord.js impl
function cleanContent(context, content) {
    return content
        .replace(/@(everyone|here)/g, '@\u200b$1')
        .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, '');
        if (this.channel.type === 'dm' || this.channel.type === 'group') {
            return context.client.users.has(id) ? `@${context.client.users.get(id).username}` : input;
        }
        const member = context.guild.members.get(id);
        if (member) {
            if (member.nickname)
                return `@${member.nickname}`;
            return `@${member.user.username}`;
        }
        else {
            const user = context.client.users.get(id);
            if (user)
                return `@${user.username}`;
            return input;
        }
    })
        .replace(/<#[0-9]+>/g, input => {
        const channel = context.client.channels.get(input.replace(/<|#|>/g, ''));
        if (channel)
            return `#${channel.name}`;
        return input;
    })
        .replace(/<@&[0-9]+>/g, input => {
        if (context.channel.type === 'dm' || context.channel.type === 'group')
            return input;
        const role = context.guild.roles.get(input.replace(/<|@|>|&/g, ''));
        if (role)
            return `@${role.name}`;
        return input;
    });
}
exports.cleanContent = cleanContent;
//# sourceMappingURL=utils.js.map