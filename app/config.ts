import {error} from './logger';

const config = require('../config.json');

// https://stackoverflow.com/a/51413778/11141271

const wrap: any = (obj: any) => new Proxy(obj,{
    get(target: {}, p: string | number | symbol, receiver: any): any {
        let result = Reflect.get(target, p, receiver);
        if (!target.hasOwnProperty(p))
            throw new Error(`Unknown config value '${String(p)}'.`);
        return typeof result === 'object' ? wrap(result) : result;
    },
    set(target: {}, p: string | number | symbol, value: any, receiver: any): boolean {
        //return Reflect.set(target, p, value, receiver);
        error('Config properties are read-only.');
        return false;
    }
});

export default wrap(config);
