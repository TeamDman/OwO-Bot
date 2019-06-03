import {Command, CommandExecutor} from '../index';
import {hackBan}                  from '../utils';

const invoke: CommandExecutor = async (message, args) => {
    return await hackBan(message.client, args.shift(), args.shift());
};

export default {
    name:        'Kill',
    commands:    ['kill', 'hackban'],
    description: 'Bans a user from every connected guild.',
    permissions: ['BAN_MEMBERS'],
    parameters:  [
        {
            name: 'Member Identifier',
            type: 'STRING'
        },
        {
            name: 'Reason',
            type: 'STRING'
        }
    ],
    executor:    invoke
} as Command;