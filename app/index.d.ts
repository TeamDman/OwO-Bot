import {Client, Message, PermissionString, RichEmbed} from 'discord.js';

export type ParameterType =
    | 'STRING'
    | 'USER'
    | 'ROLE'
    | 'CHANNEL'
    | 'GUILD'
    | 'INTEGER'
    | 'DECIMAL';

export type Permission = PermissionString | 'MANAGE_BOT' | 'HAS_ADMIN_ROLE' | { roles: [string] };

export interface Parameter {
    name?: string;
    description?: string;
    type: ParameterType;
    permissions?: Permission[];
}

export interface Route {
    name?: string;
    description?: string;
    parameters?: Parameter[];
}

export interface CommandBase {
    name: string;
    commands: string[];
    description?: string;
    permissions?: Permission[];
    requiresGuildContext?: boolean;
}

export interface SimpleCommand extends CommandBase {
    executor: SimpleCommandExecutor;
}

export interface RoutedCommand extends CommandBase {
    routes: { [index: string]: Route };
    executor: RoutedCommandExecutor;
}

export interface ParameterizedCommand extends CommandBase {
    parameters: Parameter[];
    executor: ParameterizedCommandExecutor;
}

export type MessageContent = void | string | RichEmbed;
export type SimpleCommandExecutor = (message: Message) => Promise<MessageContent>;
export type RoutedCommandExecutor = (message: Message, route: string, args: any[]) => Promise<MessageContent>;
export type ParameterizedCommandExecutor = (message: Message, args: any[]) => Promise<MessageContent>;

export type Command = SimpleCommand | RoutedCommand | ParameterizedCommand;
export type CommandExecutor = RoutedCommandExecutor | ParameterizedCommandExecutor;

export interface TaskProperties {
    name: string;
    description: string;
    allowConcurrent?: boolean;
    autoStart?: boolean;
}

export interface Task extends TaskProperties {
    start: (client: Client) => MessageContent;
    stop?: (client: Client) => MessageContent;
    runningCount: number;
}
