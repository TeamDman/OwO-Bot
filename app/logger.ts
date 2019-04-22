import {createWriteStream} from 'fs';
import config              from './config';

const stream = createWriteStream(config['log file'], {flags: 'a'});

export function augment(text: string) {
    return `[${new Date().toLocaleString('en-ca')}] ${text}\n`;

}

export function info(text: string) {
    let s = augment(`[INFO] ${text}`);
    process.stdout.write(s);
    stream.write(s);
}

export function error(text: string) {
    let s = augment(`[ERROR] ${text}`);
    process.stderr.write(s);
    stream.write(s);
}
