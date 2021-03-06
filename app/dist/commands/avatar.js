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
    return new discord_js_1.RichEmbed()
        .setTitle(`Avatar for ${member.displayName}`)
        .setImage(member.user.avatarURL)
        .addField('URL', member.user.avatarURL, true);
});
exports.default = {
    name: 'avatar',
    commands: ['avatar', 'pfp'],
    description: 'Displays the URL of the avatar for a user.',
    parameters: [{
            type: 'USER'
        }],
    executor: invoke
};
//# sourceMappingURL=avatar.js.map