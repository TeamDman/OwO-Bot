'use strict';
const discord = require('discord.js');
const config = require('./config.json');
const utils = require('./utils.js');
const util = require('util');
const createIssue = require('github-create-issue');
const commands = {};
let client = null;

commands.onMessage = async message => {
    try {
        // if (message.author.bot) return;
        if (message.guild.id === "381386573830160396" && message.channel.id !== "452530315630477333") return;
        if (message.content.indexOf(config.prefix) === -1) return;
        let args = message.content.slice(message.content.indexOf(config.prefix)+config.prefix.length).trim().match(/\\?.|^$/g).reduce((p, c) => {
            if(c === '"'){
                p.quote ^= 1;
            }else if(!p.quote && c === ' '){
                p.a.push('');
            }else{
                p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
            }
            return  p;
        }, {a: ['']}).a;
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

function addCommand(adminonly, name, action) {
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

addCommand(false, {name: 'snapsitrep'}, async (message, args) => {
    let amount = message.guild.members.filter(m => !m.roles.has("384497390478163971")).size;
    message.channel.send(`Of ${message.guild.members.size} members, ${amount} will be snapped. (${Math.round(amount/message.guild.members.size*10000)/100}%)`);
});

addCommand(true, {name: 'say'}, async (message, args) => {
    utils.getChannel(args.shift()).send(args.join(' '));
});

addCommand(false, {name: 'debug'}, async( message, args) => {
    message.channel.send(args.join('\n'));
})

addCommand(false, {name: 'issue'}, async (message, args) => {
    const getBody = message => {
        return `${args.join(' ')}\n\nSubmitter: \`${message.author.tag}\`\nBody: \`${message.content}\`\nAttachments:\n${message.attachments.map(m => `![attachment](${m.url})`).join('\n')}`;
    }

    createIssue('Vyraal1/FTB-Interactions', args.shift(), {
        'token':process.env.GITHUB_TOKEN,
        'labels':['auto'],
        'body':getBody(message)
    }, ()=>{
        message.channel.send("Issue added to tracker.");
    });
});

addCommand(false, {name: 'pingme'}, async (message, args) => {
    setTimeout(async ()=>{
        await message.author.send("Ping!");
        await message.channel.send("Ping!");
    },parseInt(args.shift() || "5")*1000);
});