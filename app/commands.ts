import {GuildMember, Message, RichEmbed}                                                    from 'discord.js';
import {Command, Parameter, ParameterizedCommand, Permission, RoutedCommand, SimpleCommand} from './index';
import * as logger                                                                          from './logger';
import * as utils                                                                           from './utils';
import config                                                                               from './config';

const commands: Command[] = [];

export function getCommands(): Command[] {
    return commands;
}

export function init() {
    require('fs').readdir(__dirname + '/commands/', (err, files) => {
        if (err) return logger.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            commands.push(require(`./commands/${file}`).default);
        });
    });
}

export function hasPermission(member: GuildMember, perm: Permission): boolean {
    if (member.id in config.bot['bot manager ids'] && member.client.user.id in config.bot['dev bot ids'])
        return true;
    if (typeof perm === 'string') {
        if (perm === 'MANAGE_BOT')
            return member.id in config.bot['bot manager ids'];
        else if (perm === 'HAS_ADMIN_ROLE')
            if (!(member.guild.id in config.bot['admin roles (guild:[channel])']))
                return false;
            else return Object.keys(config.bot['admin roles (guild:[channel])'])
                .some(id => member.roles.has(id));
        return member.hasPermission(perm);
    } else {
        return (perm as { roles: [string] }).roles.some(r => member.roles.has(r));
    }
}

export function isSimple(c: Command): c is SimpleCommand {
    return !isParameterized(c) && !isRouted(c);
}

export function isParameterized(c: Command): c is ParameterizedCommand {
    return 'parameters' in c;
}

export function isRouted(c: Command): c is RoutedCommand {
    return 'routes' in c;
}


export async function attemptCommand(message: Message, command: Command, content: string): Promise<string | RichEmbed> {
    logger.info(logger.formatMessageToString(message));
    if (message.channel.type !== 'text' && command.requiresGuildContext)
        return `Commands can not be used outside of guilds.`;
    if ((command.permissions || []).some(perm => !hasPermission(message.member, perm)))
        return 'You do not have permissions to use this command.';
    let args = content.match(/\\?.|^$/g).reduce((p: any, c: any) => {
        if (c === '"') {
            p.quote ^= 1;
        } else if (!p.quote && c === ' ') {
            p.a.push('');
        } else {
            p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
        }
        return p;
    }, {a: ['']}).a;
    let params: Parameter[];
    let route;
    if (isSimple(command)) {
        return await command.executor.call(null, [message]);
    } else if (isRouted(command)) {
        route = args.shift().trim().toLowerCase();
        if (!(route in command.routes))
            return `Unknown route ${route} for command ${command.name}`;
        params = command.routes[route].parameters || [];
    } else if (isParameterized(command)) {
        params = command.parameters;
    }
    if (params.some(param => (param.permissions || []).some(perm => !hasPermission(message.member, perm))))
        return `You do not have permission to use this command.`;

    if (args.length < params.length)
        return `Only ${args.length} arguments found, expected ${params.length}`;
    args = [...args.slice(0, params.length - 1), args.slice(params.length - 1).join(' ')];
    args = args.map(arg => arg.trim());
    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (param.type === 'STRING') {
        } else if (param.type === 'USER') {
            let user = utils.getMember(message.guild, args[i]);
            if (user === null)
                return `User ${args[i]} was not found.`;
            args[i] = user;
        } else if (param.type === 'ROLE') {
            let role = utils.getRole(message.guild, args[i]);
            if (role === null)
                return `Role ${args[i]} was not found.`;
            args[i] = role;
        } else if (param.type === 'CHANNEL') {
            let ch = utils.getChannel(message.guild, args[i]);
            if (ch === null)
                return `Channel ${args[i]} was not found.`;
            args[i] = ch;
        } else if (param.type === 'INTEGER') {
            if (isNaN(args[i]))
                return `Argument ${args[i]} is not a number.`;
            args[i] = parseInt(args[i]);
        } else if (param.type === 'DECIMAL') {
            if (isNaN(args[i]))
                return `Argument ${args[i]} is not a number.`;
            args[i] = parseFloat(args[i]);
        }
    }
    if (route !== undefined) {
        args = [message, route, args];
    } else {
        args = [message, args];
    }

    return await command.executor.apply(null, args);
}

export async function onMessage(message: Message) {
    try {
        if (message.author.bot) return;
        if (message.channel.type === 'text' && message.guild.id in config.bot['bot usage channel whitelists (guild:{channel})'] && !(message.channel.id in config.bot['bot usage channel whitelists (guild:{channel})'][message.guild.id])) return;
        if (message.channel.type !== 'text') logger.info(logger.formatMessageToString(message));
        if (message.content.match(config.bot.prefix) === null) return;

        let tokens = message.content.substr(message.content.match(config.bot.prefix).index + config.bot.prefix.length + 1).split(' ');
        let cmd    = tokens.shift().trim();
        for (let command of commands) {
            if (command.commands.some(c => cmd.match(c) !== null)) {
                let result = await attemptCommand(message, command, tokens.join(' '));
                if (result !== null && result !== undefined && !(typeof result === 'string' && result.length === 0))
                    return await message.channel.send(result);
                else
                    return;
            }
        }
    } catch (e) {
        logger.error(`Error during message handler\n${e}`);
    }
}
