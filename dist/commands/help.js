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
const config_1 = require("../config");
const invoke = (message, route, args) => __awaiter(this, void 0, void 0, function* () {
    switch (route) {
        case '':
            return new discord_js_1.RichEmbed()
                .setTitle('Commands')
                .setDescription(commands_1.getCommands().map((c) => `${c.name}: ${c.description}`).join('\n'));
        case 'info':
            args[0] = args[0].toLowerCase();
            let command = commands_1.getCommands().find(c => c.name.toLowerCase() == args[0] || c.commands.some(com => com.toLowerCase() == args[0]));
            if (command === null)
                return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Could not find command named ${args[0]}.`);
            let rtn = new discord_js_1.RichEmbed().setTitle(command.name)
                .addField('Description', command.description, true)
                .addField('Aliases', command.commands.join(', '), true);
            let buildParamString = (params) => {
                return params.filter(p => p.name && p.description)
                    .map(p => `${p.name}: ${p.description || ''}`)
                    .join('\n');
            };
            if ('parameters' in command) {
                rtn.addField('Usage', `${config_1.default.bot.prefix} ${command.commands[0]} ${command.parameters.map(p => `<${p.type} ${p.name}>`).join(' ')}`
                    + '\n\n' + buildParamString(command.parameters));
            }
            if ('routes' in command) {
                for (let route of Object.keys(command.routes)) {
                    rtn.addField(command.routes[route].name || route || '*', `${config_1.default.bot.prefix} ${command.commands[0]} ${route} ${(command.routes[route].parameters || []).map(p => `<${p.type} ${p.name}>`).join(' ')}`
                        + `\n${command.routes[route].description}\n` + buildParamString(command.routes[route].parameters || []));
                }
            }
            return rtn;
    }
});
exports.default = {
    name: 'Help',
    commands: ['help', 'info', 'cmds', 'commands'],
    description: 'Displays command information.',
    routes: {
        '': {
            name: 'List Commands',
            description: 'Lists available commands.'
        },
        'info': {
            name: 'Command Info',
            description: 'Displays information for a specific command.',
            parameters: [{
                    name: 'Command Name',
                    type: 'STRING'
                }]
        }
    },
    executor: invoke
};
//# sourceMappingURL=help.js.map