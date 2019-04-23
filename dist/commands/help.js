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
const commands_1 = require("../commands");
const invoke = (message) => __awaiter(this, void 0, void 0, function* () {
    return new discord_js_1.RichEmbed()
        .setTitle('Commands')
        .setDescription(commands_1.default.map((c) => c.name).join('\n'));
});
exports.default = {
    name: 'Help',
    commands: ['help', 'cmds', 'commands'],
    executor: invoke
};
//# sourceMappingURL=help.js.map