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
const discord_js_1 = require("discord.js");
const logger = require("./logger");
const logger_1 = require("./logger");
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
function hackBan(client, identifier, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        let banCount = 0;
        let hackBanCount = 0;
        for (const [, guild] of client.guilds) {
            const has = guild.members.has(identifier) ? 1 : 0;
            try {
                banCount += has;
                hackBanCount++;
                yield guild.ban(identifier, reason);
            }
            catch (e) {
                banCount -= has;
                hackBanCount--;
                logger_1.warn(`Failed to ban ${identifier} in guild ${guild.name}. ${e}`);
            }
        }
        return new discord_js_1.RichEmbed()
            .setTitle('Chain Ban Results')
            .setColor('RED')
            .addField('Ban Results', `User was banned from [${banCount}] of [${client.guilds.size}] available guilds.`)
            .addField('Hackban results', `User was pre-banned from [${hackBanCount}] of [${client.guilds.size}] available guilds.`)
            .setFooter(new Date().toLocaleString('en-ca'));
    });
}
exports.hackBan = hackBan;
//# sourceMappingURL=utils.js.map