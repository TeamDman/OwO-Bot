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
const utils_1 = require("../utils");
const invoke = (message, args) => __awaiter(this, void 0, void 0, function* () { return utils_1.cleanContent(message, args.shift()); });
exports.default = {
    name: 'Echo',
    commands: ['echo', 'say'],
    permissions: ['MANAGE_MESSAGES'],
    parameters: [{
            name: 'Message',
            type: 'STRING',
            examples: ['Hello world!']
        }],
    executor: invoke
};
//# sourceMappingURL=echo.js.map