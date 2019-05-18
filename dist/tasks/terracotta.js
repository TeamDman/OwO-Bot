"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const tasks_1 = require("../tasks");
exports.default = new tasks_1.ListenerTask({
    name: 'Terracotta',
    description: 'Facetious responses to commonly asked questions.',
    listeners: {
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
        }
    }
});
//# sourceMappingURL=terracotta.js.map