import {Command, CommandExecutor} from '../../index';
import {GuildMember, RichEmbed}   from 'discord.js';

const invoke: CommandExecutor = async (message, args) => {
    let member:GuildMember = args.shift();
    return new RichEmbed()
        .setTitle(`Avatar for ${member.displayName}`)
        .setImage(member.user.avatarURL)
        .addField('URL',member.user.avatarURL, true);
};

export default {
    name:       'avatar',
    commands:   ['avatar', 'pfp'],
    description: 'Displays the URL of the avatar for a user.',
    parameters: [{
        type: 'USER'
    }],
    executor:   invoke
} as Command;