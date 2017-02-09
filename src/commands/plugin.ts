'use strict';
import {Command} from './command';
import {ProjectConfig} from 'prime-project-config';
import * as logging from 'plylog';

const logger = logging.getLogger('cli.command.plugin');
const Q = require('q');
const cordova = require('cordova-lib').cordova;

export class PluginCommand implements Command {
    name = 'plugin';
    description = 'add/remove cordova plugin in project.';
    parseArgs = false;
    args = [
        {
            name: 'add',
            type: Boolean,
            description: 'add new plugin into project.'
        },
        {
            name: 'remove',
            type: Boolean,
            description: 'remove specific plugin form project.'
        },
        {
            name: 'variable',
            type: Object,
            description: 'plugin variable'
        }
    ];
    parseCLIArgs(args: string[]): Object {
        let results: any = {};
        let lastIndex = 0;
        for (let index = 0; index < args.length; index++) {
            let item = args[index], k = index + 1;
            if (lastIndex !== 0 && lastIndex >= index) { 
                console.log('continue looping'); 
                continue;
            }
            let plugins = Object.keys(results);
            if (plugins.indexOf(item) === -1 && !item.startsWith('--')) 
                results[item] = 'latest';
            for (let j = 0; j < this.args.length; j++) {
                let arg = this.args[j];
                let name = arg.name;
                let pluginName: any = (index > 0) ? args[index - 1] : null;
                if (item.includes(`--${arg.name}`)) {
                    results[pluginName] = {};
                    results[pluginName][name] = (arg.type === Object) ? {} : '';
                    let count = 0;
                    for (let n = k; n < args.length; n++) {
                        let i = args[n];
                        if (i.indexOf('=') > -1) {
                            count += 1;
                            let o: any = {};
                            let t = i.split('=');
                            o[t[0]] = t[1];
                            results[pluginName][name] = o;
                            lastIndex = n ;                            
                        } else {
                            break;
                        }
                    }
                    if (results[pluginName][name] === {} || results[pluginName][name] === '')
                    results[pluginName] = 'latest';
                }
            }
        }
        return results;
    }
    remove(plugin: string, option: any, _config: ProjectConfig) {
        return new Promise((resolve, reject) => {
            if (typeof option !== 'object') option = {};
            Q.fcall(() => {
                logger.info(`removing plugin ${plugin}`);
                return cordova.raw.plugin('remove', plugin, option);
            }).then((e: any) => {
                logger.info(`finish removing plugin ${plugin}`);
                resolve(e);
            }).catch((error: any) => {
                logger.error('PromiseException:', error);
                reject(error);
            });
        });
    }
    add(plugin: string, option: any, _config: ProjectConfig): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof option !== 'object') 
                option = {version: option};
            Q.fcall(() => {
                logger.info(`installing plugin ${plugin}`);
                return cordova.raw.plugin('add', plugin, option);
            }).then((e: any) => {
                logger.info(`finish installing plugin ${plugin}`);
                resolve(e);
            }).catch((error: any) => {
                logger.error('PromiseException:', error);
                reject(error);
            });
        });
    }
    run(args: string[], _config: ProjectConfig): Promise<any> {
        let promises: Array<any> = [];
        let argsv: any = this.parseCLIArgs(args.slice(1));
        let plugins: Array<string> = Object.keys(argsv);
        if (!plugins.length)
            logger.info(`You need to specify what plugin you want to ${args[0]}.`);
        if (args.length) {
            switch (args[0]) {
                case 'add':
                    if (plugins.length > 1) {
                        plugins.forEach((plugin: string) => {
                            promises.push(this.add(plugin, argsv[plugin], _config));
                        });
                    } else {
                        let plugin = plugins[0];
                        promises.push(this.add(plugin, argsv[plugin], _config));
                    }
                    break;
                case 'remove':
                    if (plugins.length > 1) {
                        plugins.forEach((plugin: string) => {
                            promises.push(this.remove(plugin, argsv[plugin], _config));
                        });
                    } else {
                        let plugin = plugins[0];
                        promises.push(this.remove(plugin, argsv[plugin], _config));
                    }
                    break;
            }
            
        } else {
            logger.info(`You need to specify what plugin you want to ${args[0]}.`);
        }
        return Promise.all(promises);
    }
}