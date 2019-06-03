import {Command, CommandExecutor} from '../index';
import {hackBan, unHackBan}       from '../utils';

const invoke: CommandExecutor = async (message, args) => {
    return await unHackBan(message.client, args.shift(), args.shift());
};

export default {
    name:        'Unkill',
    commands:    ['unkill', 'unhackban'],
    description: 'Unbans a user from every connected guild.',
    permissions: ['BAN_MEMBERS'],
    parameters:  [
        {
            name: 'Identifier',
            type: 'STRING'
        },
        {
            name: 'Reason',
            type: 'STRING'
        }
    ],
    executor:    invoke
} as Command;