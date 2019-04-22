import {Command, CommandExecutor} from '../index';
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
    name:       'ping',
    commands:   ['ping'],
    routes: {
        "":   [],
        "me": [{
            name: 'Delay (seconds)',
            type: 'INTEGER'
        }]
    },
    executor:   invoke
} as Command;