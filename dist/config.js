"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const config = require('../config.json');
// https://stackoverflow.com/a/51413778/11141271
const wrap = (obj) => new Proxy(obj, {
    get(target, p, receiver) {
        let result = Reflect.get(target, p, receiver);
        if (!target.hasOwnProperty(p))
            throw new Error(`Unknown config value '${String(p)}'.`);
        return typeof result === 'object' ? wrap(result) : result;
    },
    set(target, p, value, receiver) {
        //return Reflect.set(target, p, value, receiver);
        logger_1.error('Config properties are read-only.');
        return false;
    }
});
exports.default = wrap(config);
//# sourceMappingURL=config.js.map