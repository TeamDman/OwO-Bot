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
const stalker_1 = require("../tasks/stalker");
const invoke = (message, args) => __awaiter(this, void 0, void 0, function* () {
    return new discord_js_1.RichEmbed().setDescription(`${args[0]} was last seen on ${new Date(stalker_1.getLastSeen(args[0].id)).toLocaleString('en-ca')}`);
});
exports.default = {
    name: 'Stalk',
    commands: ['stalk'],
    description: 'Returns when a user was last seen.',
    parameters: [
        {
            name: 'Member',
            type: 'USER'
        }
    ],
    executor: invoke
};
//# sourceMappingURL=stalk.js.map