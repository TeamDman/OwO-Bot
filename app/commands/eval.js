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
const util_1 = require("util");
const discord_js_1 = require("discord.js");
const invoke = (message, args) => __awaiter(this, void 0, void 0, function* () {
    try {
        return new discord_js_1.RichEmbed().setColor('GREEN').setDescription(`>${util_1.inspect(eval(args.shift())).substr(0, 2047)}`);
    }
    catch (error) {
        return new discord_js_1.RichEmbed().setColor('RED').setDescription(error);
    }
});
exports.default = {
    name: 'Evaluate',
    commands: ['eval', 'exec'],
    parameters: [{
            name: 'Code',
            type: 'STRING',
            examples: ['2+2', 'message.author']
        }],
    executor: invoke
};
//# sourceMappingURL=eval.js.map