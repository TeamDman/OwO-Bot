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
    for (let role of context.roles.values())
        if (role.id == identifier)
            return role;
    for (let role of context.roles.values())
        if (role.name.toLowerCase() == identifier.toLowerCase())
            return role;
    return null;
}
exports.getRole = getRole;
function getChannel(context, identifier) {
    for (let channel of context.channels.values())
        if (channel.id == identifier && channel.type === 'text')
            return channel;
    for (let channel of context.channels.values())
        if (channel.name.toLowerCase() == identifier.toLowerCase() && channel.type === 'text')
            return channel;
    return null;
}
exports.getChannel = getChannel;
function getMember(context, identifier) {
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
exports.getMember = getMember;
function createPaginator(sourceMessage, message, next, prev) {
    return __awaiter(this, void 0, void 0, function* () {
        const emojiNext = '▶';
        const emojiPrev = '◀';
        const emojiStop = '❌';
        try {
            yield message.react(emojiPrev);
            yield message.react(emojiNext);
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
        const id = input.replace(/[<!>@]/g, '');
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
        const channel = context.client.channels.get(input.replace(/[<#>]/g, ''));
        if (channel)
            return `#${channel.name}`;
        return input;
    })
        .replace(/<@&[0-9]+>/g, input => {
        if (context.channel.type === 'dm' || context.channel.type === 'group')
            return input;
        const role = context.guild.roles.get(input.replace(/[<@>&]/g, ''));
        if (role)
            return `@${role.name}`;
        return input;
    });
}
exports.cleanContent = cleanContent;
//# sourceMappingURL=utils.js.map