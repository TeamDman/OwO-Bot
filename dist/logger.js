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
    let s = augment(`[INFO] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}
exports.info = info;
function error(text) {
    let s = augment(`[ERROR] ${text}`);
    process.stderr.write(s);
    stream.write(s);
}
exports.error = error;
//# sourceMappingURL=logger.js.map