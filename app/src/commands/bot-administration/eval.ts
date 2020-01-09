import {Command, CommandExecutor} from '../../index';
import {inspect}                  from 'util';
import {RichEmbed}                from 'discord.js';

const invoke: CommandExecutor = async (message, args) => {
    try {
        return new RichEmbed().setColor('GREEN').setDescription(`>${inspect(eval(args.shift())).substr(0, 2047)}`);
    } catch (error) {
        return new RichEmbed().setColor('RED').setDescription(error);
    }
};

export default {
    name:       'Evaluate',
    commands:   ['eval', 'exec'],
    description: 'Evaluates a given javascript statement',
    permissions: ['MANAGE_BOT'],
    parameters: [{
        name:     'Code',
        type:     'STRING'
    }],
    executor:   invoke
} as Command;