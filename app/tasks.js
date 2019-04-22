"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("./logger");
function runTask(client, task) {
    delete require.cache[require.resolve(`./tasks/${task}`)];
    require(`./tasks/${task}`)(client);
}
exports.runTask = runTask;
function init(client) {
    require('fs').readdir('app/autotasks/', (err, files) => {
        if (err)
            return logger.error(err);
        files.forEach(file => {
            require(`./autotasks/${file}`)(client);
        });
    });
}
exports.init = init;
//# sourceMappingURL=tasks.js.map