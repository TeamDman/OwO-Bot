import {GuildMember, Message, RichEmbed}                                                    from 'discord.js';
import {Command, Parameter, ParameterizedCommand, Permission, RoutedCommand, SimpleCommand} from './index';
import * as logger                                                                          from './logger';
import * as utils                                                                           from './utils';
import config                                                                               from './config';

const commands: Command[] = [];

export default commands;

export function init() {
    require('fs').readdir('./app/commands/', (err, files) => {
        if (err) return logger.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            commands.push(require(`./commands/${file}`).default);
        });
    });
}

export function hasPermission(member: GuildMember, level: Permission): boolean {
    return true;
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
    logger.info(`${message.guild.name}\t${message.channel}\t${message.author.tag}\t${message.content}`);
    if ((command.permissions||[]).some(perm => !hasPermission(message.member, perm)))
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
        params = command.routes[route];
    } else if (isParameterized(command)) {
        params = command.parameters;
    }
    if (params.some(param => (param.permissions || []).some(perm => !hasPermission(message.member, perm))))
        return `You do not have permission to use this command.`;

    if (args.length < params.length)
        return `Only ${args.length} arguments found, expected ${params.length}`;
    args = [...args.slice(0, params.length - 2), args.slice(params.length - 1).join(' ')];
    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (param.type === 'STRING') {
            continue;
        } else if (param.type === 'USER') {
            let user = utils.getMember(message, args[i]);
            if (user === null)
                return `User ${args[i]} was not found.`;
            args[i] = user;
        } else if (param.type === 'ROLE') {
            let role = utils.getRole(message, args[i]);
            if (role === null)
                return `Role ${args[i]} was not found.`;
            args[i] = role;
        } else if (param.type === 'CHANNEL') {
            let ch = utils.getChannel(message, args[i]);
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
        args = [message, args]
    }

    return await command.executor.apply(null, args);
}

export async function onMessage(message: Message) {
    try {
        if (message.author.bot) return;
        if (message.guild.id in config['bot guild:[channel] whitelists'] && !(message.channel.id in config['bot guild:[channel] whitelists'][message.guild.id])) return;
        if (message.content.match(config.prefix) === null) return;

        let tokens = message.content.substr(message.content.match(config.prefix).index + config.prefix.length + 1).split(' ');
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
