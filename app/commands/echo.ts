import {Command, CommandExecutor, ParameterizedCommand} from '../index';
import {cleanContent}                                   from '../utils';

const invoke: CommandExecutor = async (message, args) => cleanContent(message, args.shift());

export default {
    name:        'Echo',
    commands:    ['echo', 'say'],
    permissions: ['MANAGE_MESSAGES'],
    parameters:  [{
        name:     'Message',
        type:     'STRING',
        examples: ['Hello world!']
    }],
    executor:    invoke
} as ParameterizedCommand;