import {Command, CommandExecutor} from '../index';
import {startPurge}               from '../purgeHandler';
import config                     from '../config';


const invoke: CommandExecutor = async (message, args) => {
    message.channel.send(config.snap['begin message']);
    await startPurge(message, args.shift() || Number.MAX_SAFE_INTEGER);
};

export default {
    name:       'Snap',
    commands:   ['snap'],
    description: 'Eliminates users not matching a certain criteria from the guild.',
    requiresGuildContext: true,
    parameters: [{
        name: 'Count',
        type: 'INTEGER',
        description: 'Number of users to remove (0 or empty for all).'
    }],
    executor:   invoke
} as Command;