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
const createIssue = require('github-create-issue');
const invoke = (message, args) => __awaiter(this, void 0, void 0, function* () {
    return new Promise(resolve => {
        createIssue('FTBTeam/FTB-Interactions', args.shift(), {
            'token': process.env.GITHUB_TOKEN,
            'labels': ['auto'],
            'body': `${args.shift()}\n\nSubmitter: \`${message.author.tag}\`\nBody: \`${message.content}\`\nAttachments:\n${message.attachments.map(m => `![attachment](${m.url})`).join('\n')}`
        }, () => {
            resolve('Issue added to tracker.');
        });
    });
});
exports.default = {
    name: 'Issue',
    commands: ['issue'],
    description: 'Creates issues on the FTB:Interactions Github tracker',
    permissions: [{ roles: ['569940380343074826'] }],
    parameters: [{
            name: 'Title',
            type: 'STRING'
        }],
    executor: invoke
};
//# sourceMappingURL=issue.js.map