import {Client, Message, PermissionString, RichEmbed} from 'discord.js';

export type ParameterType =
    | 'STRING'
    | 'USER'
    | 'ROLE'
    | 'CHANNEL'
    | 'GUILD'
    | 'INTEGER'
    | 'DECIMAL'

export type Permission = PermissionString | 'MANAGE_BOT' | { roles: [string] }

export interface Parameter {
    name?: string,
    description?: string,
    type: ParameterType,
    permissions?: Permission[],
}

export interface Route {
    name?: string,
    description?: string,
    parameters?: Parameter[]
}


export interface CommandBase {
    name: string,
    commands: string[],
    description?: string
    permissions?: Permission[],
}

export interface SimpleCommand extends CommandBase {
    executor: SimpleCommandExecutor
}

export interface RoutedCommand extends CommandBase {
    routes: { [index: string]: Route },
    executor: RoutedCommandExecutor
}

export interface ParameterizedCommand extends CommandBase {
    parameters: Parameter[],
    executor: ParameterizedCommandExecutor
}

export type CommandResult = void | string | RichEmbed
export type SimpleCommandExecutor = (message: Message) => Promise<CommandResult>
export type RoutedCommandExecutor = (message: Message, route: string, args: any[]) => Promise<CommandResult>
export type ParameterizedCommandExecutor = (message: Message, args: any[]) => Promise<CommandResult>

export type Command = SimpleCommand | RoutedCommand | ParameterizedCommand
export type CommandExecutor = RoutedCommandExecutor | ParameterizedCommandExecutor

export interface Task {
    name: string,
    description: string,
    allowConcurrent: boolean,
    autoStart: boolean,
    start: (client:Client) => CommandResult,
    stop?: (client:Client) => CommandResult
}
