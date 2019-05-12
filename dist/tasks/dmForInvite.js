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
const tasks_1 = require("../tasks");
const config_1 = require("../config");
function handle(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.channel.type !== 'dm')
            return;
        if (!message.content.match(config_1.default['dm for invite']['match']))
            return;
        yield message.channel.send(config_1.default['dm for invite']['response']);
    });
}
exports.default = new tasks_1.ListenerTask({
    name: 'DM For Invite',
    description: `Provides invite links in DMs (prompt: '${config_1.default['dm for invite']['match']}'.)`,
    listeners: {
        'message': handle,
    }
});
//# sourceMappingURL=dmForInvite.js.map