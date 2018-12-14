'use strict';
const config = require('./config/config');
const inspect = require('util').inspect;
const discord = require('discord.js');
const client = new discord.Client();

console.log(String.raw`   ____           ____     ____        __ `);
console.log(String.raw`  / __ \_      __/ __ \   / __ )____  / /_`);
console.log(String.raw` / / / / | /| / / / / /  / __  / __ \/ __/`);
console.log(String.raw`/ /_/ /| |/ |/ / /_/ /  / /_/ / /_/ / /_  `);
console.log(String.raw`\____/ |__/|__/\____/  /_____/\____/\__/  `);

const stream = require('fs').createWriteStream('logs.txt', {flags: 'a'});
process.stdout.write('Loading');

let loading = setInterval(() => process.stdout.write('.'), 500);
client.on('ready', () => {
    clearInterval(loading);
    client.log = function (text) {
        term.log(text);
        stream.write(`[${new Date().toLocaleString('en-ca')}]\t${text}\n`);
    };
    client.error = function (text) {
        term.error(text);
    };
    client.inspect = function (object) {
        term.log(inspect(object));
    };

    client.user.setActivity(config.presence, {type: config.presence_type});
    console.log(`\nMonitoring ${client.users.size} users in ${client.channels.size} channels of ${client.guilds.size} guilds.\n`);

    require('./utils.js').init(client);
    require('./commands.js').init(client);
    require('fs').readdir('./autotasks/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            require(`./autotasks/${file}`)(client);
        });
    });
});

client.login(require('./config/token.json').token);
