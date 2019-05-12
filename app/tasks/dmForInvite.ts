import {Message}      from 'discord.js';
import {ListenerTask} from '../tasks';
import {Task}         from '../index';
import config         from '../config';

async function handle(message: Message) {
    if (message.channel.type !== 'dm') return;
    if (!message.content.match(config['dm for invite']['match'])) return;
    await message.channel.send(config['dm for invite']['response']);
}

export default new ListenerTask({
    name:        'DM For Invite',
    description: `Provides invite links in DMs (prompt: '${config['dm for invite']['match']}'.)`,
    listeners:   {
        'message': handle
    }
}) as Task;