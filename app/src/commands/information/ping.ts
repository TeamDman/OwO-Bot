import {Command, CommandExecutor} from '../../index';
import {Message}                  from 'discord.js';

const invoke: CommandExecutor = async (message, route, args) => {
    if (route !== 'me') {
        let start = Date.now();
        let msg = await message.channel.send('Ping!');
        await ((<Message> msg).edit(`Pong! (${Date.now() - start}ms)`));
    } else {
        setTimeout(async () => {
            await message.channel.send(message.member.toString());
        }, args.shift() * 1000);
    }
};

export default {
    name:       'Ping',
    commands:   ['ping'],
    description: 'Makes the bot print to the chat.',
    routes: {
        "":   {
            name: 'Latency',
            description: 'Prints the bot latency to the chat.',
        },
        "me": {
            name: 'Self Ping',
            description: 'Makes the bot mention you.',
            parameters: [{
                name: 'Delay',
                type: 'INTEGER',
                description: 'Time, in seconds.'
            }]
        }
    },
    executor:   invoke
} as Command;