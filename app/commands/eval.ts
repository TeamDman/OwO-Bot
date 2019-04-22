import {Command, CommandExecutor} from '../index';
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
    parameters: [{
        name:     'Code',
        type:     'STRING',
        examples: ['2+2', 'message.author']
    }],
    executor:   invoke
} as Command;