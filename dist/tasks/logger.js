"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../logger");
const tasks_1 = require("../tasks");
function getInfo(message) {
    return `${message.guild}\t#${'name' in message.channel && message.channel.name || 'UNKNOWN CHANNEL'}\t<@${message.author.id}> (${message.author.tag})`;
}
exports.default = new tasks_1.ListenerTask('Logger', {
    'messageDelete': (message) => {
        if (message.author.bot)
            return;
        logger.info(`!!! ${getInfo(message)}\t${message.content}`);
        message.embeds.forEach((embed) => logger.info(`!!! ${getInfo(message)}\t${embed.type}embed:${embed.url}`));
        // noinspection SpellCheckingInspection
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
});
//# sourceMappingURL=logger.js.map