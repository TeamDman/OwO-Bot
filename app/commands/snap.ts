import {Command, CommandExecutor} from '../index';
import {startPurge}               from '../purgeHandler';
import config                     from '../config';


const invoke: CommandExecutor = async (message, args) => {
    message.channel.send(config['begin message']);
    await startPurge(message, args.shift());
};

export default {
    name:       'Snap',
    commands:   ['snap'],
    description: 'Eliminates users not matching a certain criteria from the guild.',
    parameters: [{
        name: 'Count',
        type: 'INTEGER',
        description: 'Number of users to remove (0 for all).'
    }],
    executor:   invoke
} as Command;