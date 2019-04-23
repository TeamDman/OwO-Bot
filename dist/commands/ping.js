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
const invoke = (message, route, args) => __awaiter(this, void 0, void 0, function* () {
    if (route !== 'me') {
        let start = Date.now();
        let msg = yield message.channel.send('Ping!');
        yield (msg.edit(`Pong! (${Date.now() - start}ms)`));
    }
    else {
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield message.channel.send(message.member.toString());
        }), args.shift() * 1000);
    }
});
exports.default = {
    name: 'ping',
    commands: ['ping'],
    routes: {
        "": [],
        "me": [{
                name: 'Delay (seconds)',
                type: 'INTEGER'
            }]
    },
    executor: invoke
};
//# sourceMappingURL=ping.js.map