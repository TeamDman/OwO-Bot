import {Command, CommandExecutor, Parameter} from '../../index';
import {Message, RichEmbed}                  from 'discord.js';


const invoke: CommandExecutor = async (message: Message, args: any[]) => {
    const votes = {};

    const rtn = new RichEmbed()
        .setTitle('Poll Results');
    for (const key of Object.keys(votes)) {
        rtn.addField(key, votes[key].length);
    }
};

export default {
    name:        'Poll',
    commands:    ['poll', 'callvote'],
    description: 'Creates a poll with the given options.',
    parameters:  [{
        name:        'Vote Options',
        description: 'Displays information about the bot\'s current status.',
        type:        'STRING'
    }],
    executor:    invoke
} as Command;