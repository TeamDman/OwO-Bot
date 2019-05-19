"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger = require("./logger");
const logger_1 = require("./logger");
const taskList = [];
function getTasks() {
    return taskList;
}
exports.getTasks = getTasks;
function refreshTasks() {
    taskList.length = 0;
    let files = require('fs').readdirSync(__dirname + '/tasks/');
    for (let file of files) {
        if (!file.endsWith('.js'))
            continue;
        delete require.cache[require.resolve(`./tasks/${file}`)];
        let task = require(`./tasks/${file}`).default;
        if (task.name === undefined || task.description === undefined) {
            logger_1.warn('Task name and description must not be null, skipping.');
            continue;
        }
        taskList.push(task);
    }
}
exports.refreshTasks = refreshTasks;
function init(client) {
    refreshTasks();
    taskList.filter(t => t.autoStart).forEach((task) => __awaiter(this, void 0, void 0, function* () {
        try {
            logger.info(logger.strip(yield task.start.call(task, client)));
        }
        catch (error) {
            logger.error(`Error running task ${task.name}: ${error}`);
        }
    }));
}
exports.init = init;
function getTask(identifier) {
    refreshTasks();
    return taskList.find(task => task.name.toLowerCase() == identifier.toLowerCase()) || null;
}
exports.getTask = getTask;
function startTask(client, identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = getTask(identifier);
        if (task === null)
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
        try {
            return yield task.start.call(task, client);
        }
        catch (error) {
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Error starting task ${identifier}: ${error}`);
        }
    });
}
exports.startTask = startTask;
function stopTask(client, identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = getTask(identifier);
        if (task === null)
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
        try {
            return yield task.stop.call(task, client);
        }
        catch (error) {
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Error stopping task ${identifier}: ${error}`);
        }
    });
}
exports.stopTask = stopTask;
function ListenerTask(properties) {
    for (const [key, value] of Object.entries(properties))
        if (key !== 'listeners')
            this[key] = value;
    //set defaults
    for (const [key, value] of Object.entries({ allowConcurrent: false, autoStart: true }))
        if (this[key] === undefined)
            this[key] = value;
    this.runningCount = 0;
    this.start = (client) => __awaiter(this, void 0, void 0, function* () {
        if (this.runningCount === 1)
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`${properties.name} task is already running.`);
        if (properties.start) {
            yield properties.start(client);
        }
        for (const [key, value] of Object.entries(properties.listeners)) {
            yield client.addListener(key, value);
        }
        this.runningCount = 1;
        return new discord_js_1.RichEmbed().setColor('GREEN').setDescription(`${properties.name} task has been started.`);
    });
    this.stop = (client) => __awaiter(this, void 0, void 0, function* () {
        if (this.runningCount === 0)
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`${properties.name} task is not running.`);
        for (const [key, value] of Object.entries(properties.listeners)) {
            client.removeListener(key, value);
        }
        if (properties.stop) {
            yield properties.stop(client);
        }
        this.runningCount = 0;
        return new discord_js_1.RichEmbed().setColor('GREEN').setDescription(`${properties.name} task has been stopped.`);
    });
}
exports.ListenerTask = ListenerTask;
//# sourceMappingURL=tasks.js.map