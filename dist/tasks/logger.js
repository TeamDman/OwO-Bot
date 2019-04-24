"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger = require("../logger");
const listeners = {
    'messageDelete': (message) => {
        if (message.author.bot)
            return;
        logger.info(`!!! ${getInfo(message)}\t${message.content}`);
        message.embeds.forEach((embed) => logger.info(`!!! ${getInfo(message)}\t${embed.type}embed:${embed.url}`));
        message.attachments.forEach((attachment) => logger.info(`!!! ${getInfo(message)}\turl:${attachment.url}`));
    },
    'messageUpdate': (original, updated) => {
        if (original.author.bot)
            return;
        if (original.content === updated.content)
            return;
        const line = `*** ${getInfo(original)}\t`;
        logger.info(`${line}${original.content}`);
        logger.info(`${line.replace(/[^\t]/g, ' ')}${updated.content}`);
    }
};
let running = false;
function getInfo(message) {
    return `${message.guild}\t#${'name' in message.channel && message.channel.name || 'UNKNOWN CHANNEL'}\t<@${message.author.id}> (${message.author.tag})`;
}
function start(client) {
    if (running)
        return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription('Logger task is already running.');
    for (let key of Object.keys(listeners)) {
        client.addListener(key, listeners[key]);
    }
    running = true;
    return new discord_js_1.RichEmbed().setColor('GREEN').setDescription('Logger task has been started.');
}
function stop(client) {
    if (!running)
        return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription('Logger task is not running.');
    for (let key of Object.keys(listeners)) {
        client.removeListener(key, listeners[key]);
    }
    running = false;
    return new discord_js_1.RichEmbed().setColor('GREEN').setDescription('Logger task has been stopped.');
}
exports.default = {
    name: 'Logger',
    allowConcurrent: false,
    autoStart: true,
    start,
    stop
};
//# sourceMappingURL=logger.js.map