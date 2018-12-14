'use strict';
const config = require('./config/config');
const term = require('./term.js');
const inspect = require('util').inspect;
const discord = require('discord.js');
const client = new discord.Client();

client.on('ready', () => {
  client.log = function (text) {
    term.log(text);
  };
  client.error = function (text) {
    term.error(text);
  };
  client.inspect = function (object) {
    term.log(inspect(object));
  };

  client.user.setActivity(config.presence, {type: config.presence_type});

  term.init(client);
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
