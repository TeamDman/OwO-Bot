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
const tasks_1 = require("../tasks");
const commands_1 = require("../commands");
const logger_1 = require("../logger");
const config_1 = require("../config");
function handle(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.author.bot)
            return false;
        if (!(message.guild.id in config_1.default['anti-mention']['whitelist']))
            return;
        if (!message.content.match(config_1.default['anti-mention']['match']))
            return;
        if (commands_1.hasAdminRole(message.member))
            return message.channel.send('👀').catch(e => console.error(e));
        yield logger_1.report(message.guild, new discord_js_1.RichEmbed()
            .setTitle('Rei Mention Notice')
            .setColor('ORANGE')
            .addField('User', `${message.author}`, true)
            .addField('Guild', `${message.guild.name}`, true)
            .addField('Channel', `${message.channel}`, true)
            .addField('Message', message.content, true)
            .addField('Message Link', message.url, true));
        let timer = config_1.default['anti-mention'].countdown;
        let embed = new discord_js_1.RichEmbed()
            .setColor('RED')
            .setDescription(getRandomText(message.author))
            .setFooter(`${timer} seconds`);
        message.member.addRole(config_1.default['anti-mention']['silence roles'][message.guild.id], config_1.default['anti-mention']['ban reason']).catch(e => console.error(e));
        let display = yield message.channel.send(embed);
        display.react('✅').catch(e => console.error(e));
        let hook = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield display.edit(embed.setFooter(`${--timer} seconds`));
            if (timer !== 0)
                return;
            clearInterval(hook);
            collector.stop('banned');
            yield display.edit(embed.setFooter('Member was banned.'));
            message.author.send(config_1.default['anti-mention']['dm message']).catch(e => console.error(e));
            let banCount = 0;
            let hackBanCount = 0;
            for (const guild of Object.keys(config_1.default['anti-mention']['whitelist'])) {
                if (message.client.guilds.has(guild)) {
                    const has = message.client.guilds.get(guild).members.has(message.member.id) ? 1 : 0;
                    try {
                        hackBanCount++;
                        banCount += has;
                        yield message.client.guilds.get(guild).ban(message.member, { reason: config_1.default['anti-mention']['ban reason'] });
                    }
                    catch (e) {
                        hackBanCount--;
                        banCount -= has;
                        logger_1.warn(`Failed to ban ${message.member} in guild ${message.client.guilds.get(guild).name}.`);
                    }
                }
            }
            display.clearReactions().catch(e => console.error(e));
            yield logger_1.report(message.guild, new discord_js_1.RichEmbed()
                .setColor('RED')
                .setDescription(`${message.author} was banned from [${banCount}] guilds and pre-banned from [${hackBanCount}] guilds for mentioning Rei.`));
        }), 1000);
        let collector = display.createReactionCollector((react, user) => user.id !== message.client.user.id &&
            commands_1.hasAdminRole(message.guild.members.get(user.id)) &&
            react.emoji.name === '✅').on('collect', () => __awaiter(this, void 0, void 0, function* () {
            clearInterval(hook);
            collector.stop('pardoned');
            message.member.removeRole(config_1.default['anti-mention']['silence roles'][message.guild.id], 'pardoned').catch(e => console.error(e));
            display.clearReactions().catch(e => console.error(e));
            display.edit(embed.setColor('GREEN')).catch(e => console.error(e));
            yield logger_1.report(message.guild, new discord_js_1.RichEmbed()
                .setColor('GREEN')
                .setDescription(`${message.author} was pardoned.`));
        }));
    });
}
function getRandomText(user) {
    return config_1.default['anti-mention']['fun texts'][Math.floor(Math.random() * config_1.default['anti-mention']['fun texts'].length)].replace('{name}', `<@${user.id}>`);
}
exports.default = new tasks_1.ListenerTask({
    name: 'Mentions',
    description: 'Performs actions when certain mentions are detected.',
    listeners: {
        'message': handle,
        'messageUpdate': (original, updated) => handle(updated)
    }
});
//# sourceMappingURL=mentions.js.map