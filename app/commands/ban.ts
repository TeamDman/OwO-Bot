import {Command, CommandExecutor} from '../index';
import {RichEmbed}                from 'discord.js';

const invoke: CommandExecutor = async (message, args) => {
    let member = args.shift();
    await member.ban(args.shift());
    return new RichEmbed()
        .setColor('RED')
        .setDescription(`Banned ${member.user} (${member.user.id}).`);
};

export default {
    name:        'Ban',
    commands:    ['ban'],
    description: 'Bans a user from the guild.',
    permissions: ['BAN_MEMBERS'],
    parameters:  [
        {
            name: 'Member',
            type: 'USER'
        },
        {
            name: 'Reason',
            type: 'STRING'
        }
    ],
    executor:    invoke
} as Command;