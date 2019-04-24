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
            return;
        delete require.cache[require.resolve(`./tasks/${file}`)];
        taskList.push(require(`./tasks/${file}`).default);
    }
}
exports.refreshTasks = refreshTasks;
function init(client) {
    refreshTasks();
    taskList.filter(t => t.autoStart).forEach(task => {
        try {
            logger.info(logger.strip(task.start(client)));
        }
        catch (error) {
            logger.error(`Error running task ${task.name}: ${error}`);
        }
    });
}
exports.init = init;
function getTask(identifier) {
    return taskList.find(task => task.name.toLowerCase() == identifier.toLowerCase());
}
exports.getTask = getTask;
function startTask(client, identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = getTask(identifier);
        if (task === null)
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Could not find task with identifier ${identifier}.`);
        try {
            return yield task.start(client);
        }
        catch (error) {
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(error);
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
            return yield task.stop(client);
        }
        catch (error) {
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(error);
        }
    });
}
exports.stopTask = stopTask;
//# sourceMappingURL=tasks.js.map