import {Command, CommandExecutor, Parameter} from '../../index';
import {Message, RichEmbed}                  from 'discord.js';
import {getCommands}                         from '../../commands';
import config                                from '../../config';
const info = require("../../../package.json");

const invoke: CommandExecutor = async (message: Message, args: any[]) => {
    return new RichEmbed()
        .setTitle('Bot Info')
        .addField("Author", info.author)
        .addField("Version",info.version)
        .addField("Repository",info.repository.url)
};

export default {
    name:        'Help',
    commands:    ['info'],
    description: 'Displays command information.',
    parameters:  [{
        name:        'Bot Info',
        description: 'Displays information about the bot\'s current status.',
        type:        'STRING'
    }],
    executor:    invoke
} as Command;