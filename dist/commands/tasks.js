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
const tasks_1 = require("../tasks");
const discord_js_1 = require("discord.js");
const invoke = ((message, route, args) => __awaiter(this, void 0, void 0, function* () {
    try {
        tasks_1.runTask(message.client, args.shift());
    }
    catch (error) {
        yield message.channel.send(new discord_js_1.RichEmbed().setDescription(error));
    }
}));
exports.default = {
    name: 'Tasks',
    commands: ['tasks', 'task'],
    routes: {
        'run': [{
                name: 'Task Name',
                type: 'STRING'
            }]
    },
    executor: invoke
};
//# sourceMappingURL=tasks.js.map