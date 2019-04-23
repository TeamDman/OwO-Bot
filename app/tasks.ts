import {Client} from 'discord.js';
import * as logger from './logger';

export function runTask(client: Client, task: string) {
    delete require.cache[require.resolve(`./tasks/${task}`)];
    require(`./tasks/${task}`)(client);
}

export function init(client: Client) {
    require('fs').readdir('app/autotasks/', (err, files) => {
        if (err) return logger.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            require(`./autotasks/${file}`)(client);
        });
    });
}
