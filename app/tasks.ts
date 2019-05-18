import {Client, RichEmbed}                    from 'discord.js';
import * as logger                            from './logger';
import {warn}                                 from './logger';
import {MessageContent, Task, TaskProperties} from './index';

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
        let task: Task = require(`./tasks/${file}`).default;
        if (task.name === undefined || task.description === undefined) {
            warn('Task name and description must not be null, skipping.');
            continue;
        }
        taskList.push(task);
    }
}

export function init(client: Client): void {
    refreshTasks();
    taskList.filter(t => t.autoStart).forEach(task => {
        try {
            logger.info(logger.strip(task.start.call(task, client)));
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
        return await task.start.call(task,client);
    } catch (error) {
        return new RichEmbed().setColor('ORANGE').setDescription(`Error starting task ${identifier}: ${error}`);
    }
}

export async function stopTask(client: Client, identifier: string): Promise<MessageContent> {
    let task: Task = getTask(identifier);
    if (task === null)
        return new RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
    try {
        return await task.stop.call(task, client);
    } catch (error) {
        return new RichEmbed().setColor('ORANGE').setDescription(`Error stopping task ${identifier}: ${error}`);
    }
}

export function ListenerTask(properties: { listeners: { [index: string]: (...args: any) => void } } & TaskProperties): void {
    for (const [key, value] of Object.entries(properties))
        if (key !== 'listeners')
            this[key] = value;

    //set defaults
    for (const [key, value] of Object.entries({allowConcurrent: false, autoStart: true}))
        if (this[key] === undefined)
            this[key]=value;

    this.runningCount = 0;
    this.start        = (client: Client): MessageContent => {
        if (this.runningCount === 1)
            return new RichEmbed().setColor('ORANGE').setDescription(`${properties.name} task is already running.`);
        for (const [key, value] of Object.entries(properties.listeners)) {
            client.addListener(key, value);
        }
        this.runningCount = 1;
        return new RichEmbed().setColor('GREEN').setDescription(`${properties.name} task has been started.`);
    };
    this.stop         = (client: Client): MessageContent => {
        if (this.runningCount === 0)
            return new RichEmbed().setColor('ORANGE').setDescription(`${properties.name} task is not running.`);
        for (const [key, value] of Object.entries(properties.listeners)) {
            client.removeListener(key, value);
        }
        this.runningCount = 0;
        return new RichEmbed().setColor('GREEN').setDescription(`${properties.name} task has been stopped.`);
    };
}