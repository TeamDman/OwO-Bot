import {createWriteStream} from 'fs';
import config              from './config';
import {CommandResult}     from './index';

const stream = createWriteStream(config['log file'], {flags: 'a'});

export function augment(text: string) {
    return `[${new Date().toLocaleString('en-ca')}] ${text}\n`;

}

export function info(text: string) {
    if (text === null) return;
    let s = augment(`[INFO] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}

export function error(text: string) {
    if (text === null) return;
    let s = augment(`[ERROR] ${text}`);
    process.stderr.write(s);
    stream.write(s);
}

export function strip(v: CommandResult): string {
    if (v === null || v === undefined)
        return null;

    if (typeof v === 'string')
        return v;

    if (typeof v === 'object' && 'description' in v)
        return v.description;

    return null;
}