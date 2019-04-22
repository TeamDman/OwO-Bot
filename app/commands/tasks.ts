import {Command, CommandExecutor} from '../index';
import {runTask}                  from '../tasks';
import {RichEmbed}                from 'discord.js';


const invoke: CommandExecutor = (async (message, route, args) => {
    try {
        runTask(message.client, args.shift());
    } catch (error) {
        await message.channel.send(new RichEmbed().setDescription(error));
    }
});

export default {
    name:     'Tasks',
    commands: ['tasks', 'task'],
    routes:   {
        'run': [{
            name: 'Task Name',
            type: 'STRING'
        }]
    },
    executor: invoke
} as Command;