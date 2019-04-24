"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const listeners = {
    'message': (message) => {
        if (message.author.bot)
            return;
        if (message.guild.id in config_1.default['bot guild:[channel] whitelists'] && !(message.channel.id in config_1.default['bot guild:[channel] whitelists'][message.guild.id]))
            return;
        if (message.content.toLowerCase().indexOf('terracotta') == -1)
            return;
        if (message.content.toLowerCase().indexOf('where') == -1 && message.content.toLowerCase().indexOf('how') == -1)
            return;
        message.channel.send('WhErE iS ThE TeRrAcOtTa!?');
    },
};
let running = false;
function start(client) {
    if (running)
        return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription('Terracotta task is already running.');
    for (let key of Object.keys(listeners)) {
        client.addListener(key, listeners[key]);
    }
    running = true;
    return new discord_js_1.RichEmbed().setColor('GREEN').setDescription('Terracotta task has been started.');
}
function stop(client) {
    if (!running)
        return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription('Terracotta task is not running.');
    for (let key of Object.keys(listeners)) {
        client.removeListener(key, listeners[key]);
    }
    running = false;
    return new discord_js_1.RichEmbed().setColor('GREEN').setDescription('Terracotta task has been stopped.');
}
exports.default = {
    name: 'Terracotta',
    allowConcurrent: false,
    autoStart: true,
    start,
    stop
};
//# sourceMappingURL=terracotta.js.map