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
const tasks = require("../tasks");
const discord_js_1 = require("discord.js");
const invoke = ((message, route, args) => __awaiter(this, void 0, void 0, function* () {
    switch (route) {
        case 'list':
            return new discord_js_1.RichEmbed().setTitle('Tasks').setDescription(tasks.getTasks().map(t => `${t.name}: ${t.description} (${t.runningCount} running)`).join('\n'));
        case 'start':
            return tasks.startTask(message.client, args.shift());
        case 'stop':
            return tasks.stopTask(message.client, args.shift());
    }
}));
exports.default = {
    name: 'Tasks',
    commands: ['tasks', 'task'],
    description: 'Manages available tasks.',
    permissions: ['MANAGE_BOT'],
    routes: {
        'list': {
            name: 'List Tasks',
            description: 'Lists available tasks.',
        },
        'start': {
            name: 'Start Task',
            description: 'Starts a task by name.',
            parameters: [{
                    name: 'Task Name',
                    type: 'STRING'
                }]
        },
        'stop': {
            name: 'Stop Task',
            description: 'Stops a task by name.',
            parameters: [{
                    name: 'Task Name',
                    type: 'STRING'
                }]
        }
    },
    executor: invoke
};
//# sourceMappingURL=tasks.js.map