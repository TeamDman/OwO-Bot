import {Message, PermissionString, RichEmbed} from 'discord.js';

export type ParameterType =
    | 'STRING'
    | 'USER'
    | 'ROLE'
    | 'CHANNEL'
    | 'GUILD'
    | 'INTEGER'
    | 'DECIMAL'

export type Permission = PermissionString | 'MANAGE_BOT' | {roles:[string]}

export interface Parameter {
    name?: string,
    description?: string,
    type: ParameterType,
    permissions?: Permission[],
    examples?: string[]
}

export type CommandResult = void | string | RichEmbed

export interface CommandBase {
    name: string,
    commands: string[],
    description?: string
    permissions?: Permission[],
}

export interface SimpleCommand extends CommandBase {
    executor: SimpleCommandExecutor
}
export type SimpleCommandExecutor = (message: Message) => Promise<CommandResult>

export interface RoutedCommand extends CommandBase {
    routes: { [index: string]: Parameter[] },
    executor: RoutedCommandExecutor
}

export type RoutedCommandExecutor = (message: Message, route: string, args: any[]) => Promise<CommandResult>

export interface ParameterizedCommand extends CommandBase {
    parameters: Parameter[],
    executor: ParameterizedCommandExecutor
}

export type ParameterizedCommandExecutor = (message: Message, args: any[]) => Promise<CommandResult>

export type Command = SimpleCommand | RoutedCommand | ParameterizedCommand
export type CommandExecutor = RoutedCommandExecutor | ParameterizedCommandExecutor