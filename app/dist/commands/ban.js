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
    let member = args.shift();
    yield member.ban(args.shift());
    return new discord_js_1.RichEmbed()
        .setColor('RED')
        .setDescription(`Banned ${member.user} (${member.user.id}).`);
});
exports.default = {
    name: 'Ban',
    commands: ['ban'],
    description: 'Bans a user from the guild.',
    permissions: ['BAN_MEMBERS'],
    parameters: [
        {
            name: 'Member',
            type: 'USER'
        },
        {
            name: 'Reason',
            type: 'STRING'
        }
    ],
    executor: invoke
};
//# sourceMappingURL=ban.js.map