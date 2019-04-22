import {Command, CommandExecutor} from '../index';
import {RichEmbed}                from 'discord.js';
import commands                   from '../commands';

const invoke: CommandExecutor = async (message) =>
    new RichEmbed()
        .setTitle('Commands')
        .setDescription(commands.map((c: Command) => c.name).join('\n'));

export default {
    name:     'Help',
    commands: ['help', 'cmds', 'commands'],
    executor: invoke
} as Command;