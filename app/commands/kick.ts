import {Command, CommandExecutor} from '../index';

const invoke: CommandExecutor = async (message, args) => {
    return await args.shift().kick();
};

export default {
    name:        'Kick',
    commands:    ['kick'],
    description: 'Kicks a user from the guild.',
    permissions: ['KICK_MEMBERS'],
    parameters:  [{
        name: 'Member',
        type: 'USER'
    }],
    executor:    invoke
} as Command;