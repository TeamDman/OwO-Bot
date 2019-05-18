import {Client, Message, MessageAttachment, MessageEmbed, RichEmbed} from 'discord.js';
import {MessageContent, Task}                                        from '../index';
import * as logger                                                   from '../logger';
import config                                                        from '../config';
import {ListenerTask}                                                from '../tasks';

export default new ListenerTask({
    name:        'Terracotta',
    description: 'Facetious responses to commonly asked questions.',
    listeners:   {
        'message': (message:Message) => {
            if (message.author.bot) return;
            if (message.guild.id in config['bot guild:[channel] whitelists'] && !(message.channel.id in config['bot guild:[channel] whitelists'][message.guild.id])) return;
            if (message.content.toLowerCase().indexOf('terracotta') == -1) return;
            if (message.content.toLowerCase().indexOf('where') == -1 && message.content.toLowerCase().indexOf('how') == -1) return;
            message.channel.send('WhErE iS ThE TeRrAcOtTa!?');
        }
    }
}) as Task;