"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("../tasks");
exports.default = new tasks_1.ListenerTask({
    name: 'Terracotta',
    description: 'Facetious responses to commonly asked questions.',
    listeners: {
        'message': (message) => {
            if (message.author.bot)
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