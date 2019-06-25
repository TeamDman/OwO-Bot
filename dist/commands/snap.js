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
const purgeHandler_1 = require("../purgeHandler");
const config_1 = require("../config");
const invoke = (message, args) => __awaiter(this, void 0, void 0, function* () {
    message.channel.send(config_1.default.snap['begin message']);
    yield purgeHandler_1.startPurge(message, args.shift() || Number.MAX_SAFE_INTEGER);
});
exports.default = {
    name: 'Snap',
    commands: ['snap'],
    description: 'Eliminates users not matching a certain criteria from the guild.',
    permissions: ['BAN_MEMBERS'],
    requiresGuildContext: true,
    parameters: [{
            name: 'Count',
            type: 'INTEGER',
            description: 'Number of users to remove (0 or empty for all).'
        }],
    executor: invoke
};
//# sourceMappingURL=snap.js.map