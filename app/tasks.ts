import {Client, RichEmbed}   from 'discord.js';
import * as logger           from './logger';
import {CommandResult, Task} from './index';

const taskList: Task[] = [];

export function getTasks() {
    return taskList;
}

export function refreshTasks() {
    taskList.length = 0;
    let files    = require('fs').readdirSync(__dirname + '/tasks/');
    for (let file of files) {
        if (!file.endsWith('.js')) return;
        delete require.cache[require.resolve(`./tasks/${file}`)];
        taskList.push(require(`./tasks/${file}`).default);
    }
}

export function init(client: Client) {
    refreshTasks();
    taskList.filter(t => t.autoStart).forEach(task => {
        try {
            logger.info(logger.strip(task.start(client)))
        } catch (error) {
            logger.error(`Error running task ${task.name}: ${error}`);
        }
    });
}

export function getTask(identifier: string): Task {
    return taskList.find(task => task.name.toLowerCase() == identifier.toLowerCase());
}

export async function startTask(client: Client, identifier: string): Promise<CommandResult> {
    let task: Task = getTask(identifier);
    if (task === null)
        return new RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
    try {
        return await task.start(client);
    } catch (error) {
        return new RichEmbed().setColor('ORANGE').setDescription(error);
    }
}

export async function stopTask(client: Client, identifier: string): Promise<CommandResult> {
    let task: Task = getTask(identifier);
    if (task === null)
        return new RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
    try {
        return await task.stop(client);
    } catch (error) {
        return new RichEmbed().setColor('ORANGE').setDescription(error);
    }
}