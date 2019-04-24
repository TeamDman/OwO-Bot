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
const logger = require("./logger");
const utils = require("./utils");
const config_1 = require("./config");
const commands = [];
function getCommands() {
    return commands;
}
exports.getCommands = getCommands;
function init() {
    require('fs').readdir(__dirname + '/commands/', (err, files) => {
        if (err)
            return logger.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js'))
                return;
            commands.push(require(`./commands/${file}`).default);
        });
    });
}
exports.init = init;
function hasPermission(member, perm) {
    if (member.id in config_1.default['bot manager ids'] && member.client.user.id in config_1.default['dev bot ids'])
        return true;
    if (typeof perm === 'string') {
        if (perm === 'MANAGE_BOT')
            return member.id in config_1.default['bot manager ids'];
        return member.hasPermission(perm);
    }
    else {
        return perm.roles.some(r => member.roles.has(r));
    }
}
exports.hasPermission = hasPermission;
function isSimple(c) {
    return !isParameterized(c) && !isRouted(c);
}
exports.isSimple = isSimple;
function isParameterized(c) {
    return 'parameters' in c;
}
exports.isParameterized = isParameterized;
function isRouted(c) {
    return 'routes' in c;
}
exports.isRouted = isRouted;
function attemptCommand(message, command, content) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(logger.formatMessageToString(message));
        if (message.channel.type !== 'text')
            return `Commands can not be used outside of guilds.`;
        if ((command.permissions || []).some(perm => !hasPermission(message.member, perm)))
            return 'You do not have permissions to use this command.';
        let args = content.match(/\\?.|^$/g).reduce((p, c) => {
            if (c === '"') {
                p.quote ^= 1;
            }
            else if (!p.quote && c === ' ') {
                p.a.push('');
            }
            else {
                p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
            }
            return p;
        }, { a: [''] }).a;
        let params;
        let route;
        if (isSimple(command)) {
            return yield command.executor.call(null, [message]);
        }
        else if (isRouted(command)) {
            route = args.shift().trim().toLowerCase();
            if (!(route in command.routes))
                return `Unknown route ${route} for command ${command.name}`;
            params = command.routes[route].parameters || [];
        }
        else if (isParameterized(command)) {
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
            }
            else if (param.type === 'USER') {
                let user = utils.getMember(message, args[i]);
                if (user === null)
                    return `User ${args[i]} was not found.`;
                args[i] = user;
            }
            else if (param.type === 'ROLE') {
                let role = utils.getRole(message, args[i]);
                if (role === null)
                    return `Role ${args[i]} was not found.`;
                args[i] = role;
            }
            else if (param.type === 'CHANNEL') {
                let ch = utils.getChannel(message, args[i]);
                if (ch === null)
                    return `Channel ${args[i]} was not found.`;
                args[i] = ch;
            }
            else if (param.type === 'INTEGER') {
                if (isNaN(args[i]))
                    return `Argument ${args[i]} is not a number.`;
                args[i] = parseInt(args[i]);
            }
            else if (param.type === 'DECIMAL') {
                if (isNaN(args[i]))
                    return `Argument ${args[i]} is not a number.`;
                args[i] = parseFloat(args[i]);
            }
        }
        if (route !== undefined) {
            args = [message, route, args];
        }
        else {
            args = [message, args];
        }
        return yield command.executor.apply(null, args);
    });
}
exports.attemptCommand = attemptCommand;
function onMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (message.author.bot)
                return;
            if (message.channel.type === 'text' && message.guild.id in config_1.default['bot guild:[channel] whitelists'] && !(message.channel.id in config_1.default['bot guild:[channel] whitelists'][message.guild.id]))
                return;
            if (message.channel.type !== 'text')
                logger.info(logger.formatMessageToString(message));
            if (message.content.match(config_1.default.prefix) === null)
                return;
            if (message.channel.type !== 'text')
                return yield message.channel.send('Commands can not be used outside of guilds.');
            let tokens = message.content.substr(message.content.match(config_1.default.prefix).index + config_1.default.prefix.length + 1).split(' ');
            let cmd = tokens.shift().trim();
            for (let command of commands) {
                if (command.commands.some(c => cmd.match(c) !== null)) {
                    let result = yield attemptCommand(message, command, tokens.join(' '));
                    if (result !== null && result !== undefined && !(typeof result === 'string' && result.length === 0))
                        return yield message.channel.send(result);
                    else
                        return;
                }
            }
        }
        catch (e) {
            logger.error(`Error during message handler\n${e}`);
        }
    });
}
exports.onMessage = onMessage;
//# sourceMappingURL=commands.js.map