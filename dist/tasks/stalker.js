"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("../tasks");
const last = {};
function getLastSeen(id) {
    return last[id];
}
exports.getLastSeen = getLastSeen;
exports.default = new tasks_1.ListenerTask({
    name: 'Logger',
    description: 'Logs modified and deleted messages.',
    listeners: {
        'message': (message) => last[message.author.id] = Date.now(),
        'messageDelete': (message) => last[message.author.id] = Date.now(),
        'messageUpdate': (original) => last[original.author.id] = Date.now(),
        'typingStart': (_, user) => last[user.id] = Date.now(),
        'guildMemberSpeaking': (member) => last[member.id] = Date.now(),
        'messageReactionAdd': (_, user) => last[user.id] = Date.now(),
        'messageReactionRemove': (_, user) => last[user.id] = Date.now(),
        'presenceUpdate': (_, member) => last[member.id] = Date.now(),
        'userUpdate': (_, user) => last[user.id] = Date.now(),
        'voiceStateUpdate': (_, member) => last[member.id] = Date.now()
    }
});
//# sourceMappingURL=stalker.js.map