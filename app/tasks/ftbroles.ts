import {Client, Message, MessageAttachment, MessageEmbed} from 'discord.js';
import * as logger                                        from '../logger';
import {ListenerTask}                                     from '../tasks';
import {Task}                                             from '../index';

export default {
    allowConcurrent: false,
    autoStart: false,
    description: "Creates the role controller message.",
    name: "FTBRolesSend",
    runningCount: 0,
    start: async (client: Client) => {
        this.runningCount++;
    },
    stop: async (client: Client) => {

    },
} as Task