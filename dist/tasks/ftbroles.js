"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInfo(message) {
    return `${message.guild}\t#${'name' in message.channel && message.channel.name || 'UNKNOWN CHANNEL'}\t<@${message.author.id}> (${message.author.tag})`;
}
exports.default = {
    allowConcurrent: false,
    autoStart: false,
    description: "Creates the role controller message.",
    name: "FTBRolesSend",
    runningCount: 0,
    start: (client) => {
    },
    stop: (client) => {
    },
};
//# sourceMappingURL=ftbroles.js.map