import {Command, CommandExecutor, Parameter} from '../../index';
import {Message, RichEmbed}                  from 'discord.js';
import {getCommands}                         from '../../commands';
import config                                from '../../config';

const invoke: CommandExecutor = async (message: Message, args: any[]) => {
    if (args[0] === '')
        return new RichEmbed()
            .setTitle('Commands')
            .setDescription(getCommands().map((c: Command) => `${c.name}: ${c.description}`).join('\n'));

    args[0]              = (args[0] as string).toLowerCase();
    let command: Command = getCommands().find(c => c.name.toLowerCase() == args[0] || c.commands.some(com => com.toLowerCase() == args[0]));
    if (command === null)
        return new RichEmbed().setColor('ORANGE').setDescription(`Could not find command named ${args[0]}.`);
    let rtn: RichEmbed = new RichEmbed().setTitle(command.name)
        .addField('Description', command.description, true)
        .addField('Aliases', command.commands.join(', '), true);

    let buildParamString = (params: Parameter[]): string => {
        return params.filter(p => p.name && p.description)
            .map(p => `${p.name}: ${p.description || ''}`)
            .join('\n');
    };

    if ('parameters' in command) {
        rtn.addField('Usage', `${config.bot.prefix} ${command.commands[0]} ${command.parameters.map(p => `<${p.type} ${p.name}>`).join(' ')}`
            + '\n\n' + buildParamString(command.parameters));
    }
    if ('routes' in command) {
        for (let route of Object.keys(command.routes)) {
            rtn.addField(command.routes[route].name || route || '*', `${config.bot.prefix} ${command.commands[0]} ${route} ${(command.routes[route].parameters || []).map(p => `<${p.type} ${p.name}>`).join(' ')}`
                + `\n${command.routes[route].description}\n` + buildParamString(command.routes[route].parameters || []));
        }
    }
    return rtn;
};

export default {
    name:        'Help',
    commands:    ['help', 'cmds', 'commands'],
    description: 'Displays command information.',
    parameters:  [{
        name:        'Command Name',
        description: 'The name of the command to display info for. Empty to list all.',
        type:        'STRING'
    }],
    executor:    invoke
} as Command;