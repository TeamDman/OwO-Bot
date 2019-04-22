import {Command, CommandExecutor} from '../index';
import {inspect}                  from 'util';

const invoke: CommandExecutor = async (message, args) => {
    try {
        return `>${inspect(eval(args.shift())).substr(0, 2047)}`;
    } catch (error) {
        return error;
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