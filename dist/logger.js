"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const config_1 = require("./config");
const stream = fs_1.createWriteStream(config_1.default['log file'], { flags: 'a' });
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
//# sourceMappingURL=logger.js.map