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
const fs_1 = require("fs");
const config_1 = require("./config");
const utils_1 = require("./utils");
const stream = fs_1.createWriteStream(config_1.default.bot['log file'], { flags: 'a' });
function augment(text) {
    return `[${new Date().toLocaleString('en-ca')}] ${text}\n`;
}
exports.augment = augment;
function info(text) {
    if (text === null)
        return;
    let s = augment(`[INFO] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}
exports.info = info;
function report(context, content) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(context.id in config_1.default.bot['bot logger report channels (guild:channel)']))
            return;
        let channel = utils_1.getChannel(context, config_1.default.bot['bot logger report channels (guild:channel)'][context.id]);
        if (channel === null)
            return;
        yield channel.send(content);
    });
}
exports.report = report;
function warn(text) {
    if (text === null)
        return;
    let s = augment(`[WARNING] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}
exports.warn = warn;
function error(text) {
    if (text === null)
        return;
    let s = augment(`[ERROR] ${text}`);
    process.stderr.write(s);
    stream.write(s);
}
exports.error = error;
function strip(v) {
    if (v === null || v === undefined)
        return null;
    if (typeof v === 'string')
        return v;
    if (typeof v === 'object' && 'description' in v)
        return v.description;
    return null;
}
exports.strip = strip;
function formatMessageToString(message) {
    return `${message.channel.type == 'text' && message.guild.name
        || message.channel.type == 'dm' && 'Direct Messages'
        || 'Unknown Guild'}`
        + `\t#${message.channel.type == 'text' && message.channel.name
            || message.channel.type == 'dm' && message.channel.recipient.tag}`
        + `\t<@${message.author.id}> (${message.author.tag})`
        + `\t${message.content}`;
}
exports.formatMessageToString = formatMessageToString;
//# sourceMappingURL=logger.js.map