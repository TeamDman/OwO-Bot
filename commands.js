'use strict';
const discord = require('discord.js');
const config = require('./config/config.json');
const utils = require('./utils.js');
const util = require('util');
const commands = {};
let client = null;

commands.onMessage = async message => {
  try {
    if (message.author.bot) { return; }
    if (message.content.indexOf(config.prefix) !== 0) { return; }
    let args = message.content.slice(config.prefix.length).trim().split(/\s+/g);
    let command = args.shift().toLocaleLowerCase();
    for (let cmd of commands.list) {
      if (command.match(cmd.pattern)) {
        if (!cmd.adminonly ||
            client.user.id === '431980306111660062' &&
            message.author.id === '159018622600216577') {
          return await cmd.action(message, args);
        } else {
          return message.channel.send('You do not have permissions to use this command.');
        }
      }
    }
    // message.channel.send(`No command found matching '${command}'`);
  } catch (e) {
    client.error(`Error during message handler\n${e}`);
  }
};

commands.init = cl => {
  client = cl;
  client.on('message', message => commands.onMessage(message));
};

module.exports = commands;
commands.list = [];

function addCommand (adminonly, name, action) {
  commands.list.push({name: name.name, pattern: name.pattern || name.name, action: action, adminonly: adminonly});
}

addCommand(false, {name: 'cmds'}, async (message, args) => {
  message.channel.send(new discord.RichEmbed()
    .setTitle('Commands')
    .setDescription(commands.list.map(cmd => cmd.name).join('\n')));
});

addCommand(true, {name: 'inforaw'}, async (message, args) => {
  let embed = new discord.RichEmbed()
    .setTitle('config.json')
    .setColor('GRAY')
    .setDescription(util.inspect(config).substr(0, 2048));
  message.channel.send(embed);
});

addCommand(true, {name: 'eval'}, async (message, args) => {
  let resp = 'undefined';
  try {
    resp = `>${util.inspect(eval(args.join(' '))).substr(0, 2047)}`;
    await message.channel.send(new discord.RichEmbed().setDescription(resp));
  } catch (error) {
    try {
      await message.channel.send(resp);
    } catch (e) {
      await message.channel.send(`Error displaying error\n${e}\n${error}`);
    }
  }
});

addCommand(true, {name: 'task'}, async (message, args) => {
  try {
    utils.task(args.join(' '));
  } catch (error) {
    await message.channel.send(new discord.RichEmbed().setDescription(error));
  }
});

addCommand(true, {name: 'echo'}, async (message, args) => {
  message.channel.send(args.join(' '));
  await message.delete();
});

addCommand(false, {name: 'avatar'}, async (message, args) => {
  message.channel.send(new discord.RichEmbed({image: message.author.avatarURL}));
});
