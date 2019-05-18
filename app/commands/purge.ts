import {Command, CommandExecutor}        from '../index';
import {Message, RichEmbed, TextChannel} from 'discord.js';
import {warn}                            from '../logger';

const invoke: CommandExecutor = async (message, args) => {
    const start = Date.now();
    let count = 0;
    for (const m of (await (message.channel as TextChannel).fetchMessages({limit: args[0]+1})).values()) {
        if (m.id === message.id)
            continue;
        await m.delete();
        count++;
    }
    return new RichEmbed().setDescription(`Purged ${count} messages in ${(Date.now()-start)/1000} seconds.`);
};

export default {
    name:       'Purge',
    commands:   ['purge'],
    description: 'Removes recent messages from the channel.',
    parameters: [{
        name: 'Count',
        description: 'Amount of messages to purge, not including your own.',
        type: 'INTEGER'
    }],
    executor:   invoke
} as Command;