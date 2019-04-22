import {Command, CommandExecutor} from '../index';
import {RichEmbed}                from 'discord.js';

const invoke: CommandExecutor = async (message, args) => new RichEmbed({image: args.shift().avatarURL});

export default {
    name:       'avatar',
    commands:   ['avatar', 'pfp'],
    parameters: [{
        type: 'USER'
    }],
    executor:   invoke
} as Command;