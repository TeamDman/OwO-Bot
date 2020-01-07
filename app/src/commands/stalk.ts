import {Command, CommandExecutor} from '../index';
import {RichEmbed}                from "discord.js";
import {getLastSeen}              from '../tasks/stalker';

const invoke: CommandExecutor = async (message, args) => {
    return new RichEmbed().setDescription(`${args[0]} was last seen on ${new Date(getLastSeen(args[0].id)).toLocaleString('en-ca')}`);
};

export default {
    name:        'Stalk',
    commands:    ['stalk'],
    description: 'Returns when a user was last seen.',
    parameters:  [
        {
            name: 'Member',
            type: 'USER'
        }
    ],
    executor:    invoke
} as Command;