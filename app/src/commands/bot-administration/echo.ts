import {Command, CommandExecutor} from '../../index';
import {cleanContent}                                   from '../../utils';

const invoke: CommandExecutor = async (message, args) => cleanContent(message, args.shift());

export default {
    name:        'Echo',
    commands:    ['echo', 'say'],
    description: 'Prints a given line to the chat.',
    permissions: ['MANAGE_MESSAGES'],
    parameters:  [{
        name:     'Message',
        type:     'STRING'
    }],
    executor:    invoke
} as Command;