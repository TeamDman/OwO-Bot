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
const invoke = (message, args) => __awaiter(this, void 0, void 0, function* () {
    const start = Date.now();
    let count = 0;
    for (const m of (yield message.channel.fetchMessages({ limit: args[0] + 1 })).values()) {
        if (m.id === message.id)
            continue;
        yield m.delete();
        count++;
    }
    return new discord_js_1.RichEmbed().setDescription(`Purged ${count} messages in ${(Date.now() - start) / 1000} seconds.`);
});
exports.default = {
    name: 'Purge',
    commands: ['purge'],
    description: 'Removes recent messages from the channel.',
    permissions: ['MANAGE_MESSAGES'],
    parameters: [{
            name: 'Count',
            description: 'Amount of messages to purge, not including your own.',
            type: 'INTEGER'
        }],
    executor: invoke
};
//# sourceMappingURL=purge.js.map