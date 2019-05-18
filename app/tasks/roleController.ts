import {Client, Message, MessageAttachment, MessageEmbed} from 'discord.js';
import * as logger                                        from '../logger';
import {ListenerTask}                                     from '../tasks';
import {Task}                                             from '../index';

export default {
    name: "Role Controller",
    allowConcurrent: false,
    autoStart: false,
    description: "Creates and listens to the role controller message.",
    runningCount: 0,
    start: async (client: Client) => {
        this.runningCount++;

        this.runningCount--;
    },
    stop: async (client: Client) => {

    },
} as Task