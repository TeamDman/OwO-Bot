import {Command, CommandExecutor} from '../index';
import * as tasks                 from '../tasks';
import {RichEmbed}                from 'discord.js';

const invoke: CommandExecutor = (async (message, route, args) => {
    switch (route) {
        case 'list':
            return new RichEmbed().setTitle('Tasks').setDescription(tasks.getTasks().map(t => `${t.name}: ${t.description} (${t.runningCount} running)`).join('\n'));
        case 'start':
            return tasks.startTask(message.client, args.shift());
        case 'stop':
            return tasks.stopTask(message.client, args.shift());
    }
});

export default {
    name:     'Tasks',
    commands: ['tasks', 'task'],
    description: 'Manages available tasks.',
    routes:   {
        'list':  {
            name: 'List Tasks',
            description: 'Lists available tasks.',
        },
        'start': {
            name: 'Start Task',
            description: 'Starts a task by name.',
            parameters: [{
                name: 'Task Name',
                type: 'STRING'
            }]
        },
        'stop': {
            name: 'Stop Task',
            description: 'Stops a task by name.',
            parameters: [{
                name: 'Task Name',
                type: 'STRING'
            }]
        }
    },
    executor: invoke
} as Command;