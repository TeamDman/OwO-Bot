import {Command, CommandExecutor} from '../index';
import createIssue                from 'github-create-issue';

const invoke: CommandExecutor = async (message, args) => {
    return new Promise<string>(resolve => {
        createIssue('FTBTeam/FTB-Interactions', args.shift(), {
            'token':  process.env.GITHUB_TOKEN,
            'labels': ['auto'],
            'body':   `${args.shift()}\n\nSubmitter: \`${message.author.tag}\`\nBody: \`${message.content}\`\nAttachments:\n${message.attachments.map(m => `![attachment](${m.url})`).join('\n')}`
        }, () => {
            resolve('Issue added to tracker.');
        });
    });
};

export default {
    name:        'Issue',
    commands:    ['issue'],
    description: 'Creates issues on the FTB:Interactions Github tracker',
    parameters:  [{
        name: 'Title',
        type: 'STRING'
    }],
    executor:    invoke
} as Command;