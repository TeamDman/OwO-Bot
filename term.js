const kit = require('terminal-kit');
const term = kit.terminal;
let client = null;

term.fullscreen(true);
term.windowTitle('OwO Bot');
term.grabInput();
term.on('key', function (key, matches, data) {
  if (key === 'CTRL_C') {
    process.exit();
  }
});

term(String.raw`   ____           ____     ____        __ `)('\n');
term(String.raw`  / __ \_      __/ __ \   / __ )____  / /_`)('\n');
term(String.raw` / / / / | /| / / / / /  / __  / __ \/ __/`)('\n');
term(String.raw`/ /_/ /| |/ |/ / /_/ /  / /_/ / /_/ / /_  `)('\n');
term(String.raw`\____/ |__/|__/\____/  /_____/\____/\__/  `)('\n');
term('Loading');
let loading = setInterval(() => term('.'), 500);

const stream = require('fs').createWriteStream('logs.txt', {flags: 'a'});

const display = {
  init: function (cl) {
    client = cl;
    clearInterval(loading);
    term.moveTo(1, 6).eraseLine()(`Monitoring ${client.users.size} users in ${client.channels.size} channels of ${client.guilds.size} guilds.\n`);
  },
  log: function (text) {
    stream.write(`[${new Date().toLocaleString('en-ca')}]\t${text}\n`);
    term(`${text}\n`);
  },
  write: function (text, opt) {
    term(`${text}\n`);
  },
  error: function (text) {
    term.error.red(`${text}\n`);
  }
};
module.exports = display;
