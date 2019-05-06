import {Client, RichEmbed}    from 'discord.js';
import * as logger            from './logger';
import {MessageContent, Task} from './index';

const taskList: Task[] = [];

export function getTasks(): Task[] {
    return taskList;
}

export function refreshTasks(): void {
    taskList.length = 0;
    let files       = require('fs').readdirSync(__dirname + '/tasks/');
    for (let file of files) {
        if (!file.endsWith('.js')) continue;
        delete require.cache[require.resolve(`./tasks/${file}`)];
        taskList.push(require(`./tasks/${file}`).default);
    }
}

export function init(client: Client): void {
    refreshTasks();
    taskList.filter(t => t.autoStart).forEach(task => {
        try {
            logger.info(logger.strip(task.start(client)));
        } catch (error) {
            logger.error(`Error running task ${task.name}: ${error}`);
        }
    });
}

export function getTask(identifier: string): Task {
    return taskList.find(task => task.name.toLowerCase() == identifier.toLowerCase());
}

export async function startTask(client: Client, identifier: string): Promise<MessageContent> {
    let task: Task = getTask(identifier);
    if (task === null)
        return new RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
    try {
        return await task.start(client);
    } catch (error) {
        return new RichEmbed().setColor('ORANGE').setDescription(error);
    }
}

export async function stopTask(client: Client, identifier: string): Promise<MessageContent> {
    let task: Task = getTask(identifier);
    if (task === null)
        return new RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
    try {
        return await task.stop(client);
    } catch (error) {
        return new RichEmbed().setColor('ORANGE').setDescription(error);
    }
}

export function ListenerTask(name: string, listeners: { [index: string]: (...args: any) => void }): void {
    let running: boolean = false;
    this.name            = name;
    this.allowConcurrent = false;
    this.autoStart       = true;
    this.start           = (client: Client): MessageContent => {
        if (running)
            return new RichEmbed().setColor('ORANGE').setDescription(`${name} task is already running.`);
        for (let key of Object.keys(listeners)) {
            client.addListener(key, listeners[key]);
        }
        running = true;

        return new RichEmbed().setColor('GREEN').setDescription(`${name} task has been started.`);
    };
    this.stop            = (client: Client): MessageContent => {
        if (!running)
            return new RichEmbed().setColor('ORANGE').setDescription(`${name} task is not running.`);
        for (let key of Object.keys(listeners)) {
            client.removeListener(key, listeners[key]);
        }
        running = false;
        return new RichEmbed().setColor('GREEN').setDescription(`${name} task has been stopped.`);
    };
}