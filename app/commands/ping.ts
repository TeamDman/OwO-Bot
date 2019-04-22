import {Command, CommandExecutor} from '../index';

const invoke: CommandExecutor = async (message, args) => {
    if (args.length === 0) {
        let start = Date.now();
        let msg   = await message.channel.send('Ping!');
        await (msg.edit(`Pong! (${Date.now() - start}ms)`));
    } else {
        setTimeout(async () => {
            await message.channel.send(message.member.toString());
        }, args.shift() * 1000);
    }
};

export default {
    name:       'ping',
    commands:   ['ping'],
    parameters: [{
        name: 'Delay (seconds)',
        type: 'INTEGER'
    }],
    executor:   invoke
} as Command;