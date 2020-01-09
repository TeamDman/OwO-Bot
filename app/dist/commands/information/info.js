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
const info = require("../../../package.json");
const invoke = (message, args) => __awaiter(this, void 0, void 0, function* () {
    return new discord_js_1.RichEmbed()
        .setTitle('Bot Info')
        .addField("Author", info.author)
        .addField("Version", info.version)
        .addField("Repository", info.repository.url);
});
exports.default = {
    name: 'Help',
    commands: ['info'],
    description: 'Displays command information.',
    parameters: [{
            name: 'Bot Info',
            description: 'Displays information about the bot\'s current status.',
            type: 'STRING'
        }],
    executor: invoke
};
//# sourceMappingURL=info.js.map