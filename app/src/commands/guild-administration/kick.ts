import {Command, CommandExecutor} from '../../index';
import {RichEmbed}                from "discord.js";

const invoke: CommandExecutor = async (message, args) => {
    let member = args.shift();
    await member.kick(args.shift());
    return new RichEmbed()
        .setColor('ORANGE')
        .setDescription(`Banned ${member.user} (${member.user.id}).`);
};

export default {
    name:        'Kick',
    commands:    ['kick'],
    description: 'Kicks a user from the guild.',
    permissions: ['KICK_MEMBERS'],
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