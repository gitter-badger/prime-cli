
'use strict';
import {Command} from './command';
import {ProjectConfig} from 'prime-project-config';
import * as logging from 'plylog';

let logger = logging.getLogger('cli.command.platforms');

const cordova = require('cordova-lib').cordova;


export class PlatformsCommand implements Command {
    name = 'platforms';
    description = 'add or remove specific platforms';
    parseArgs = false;
    args = [
        {
            name: 'add',
            type: Boolean,
            description: 'add new plaform into project.'
        },
        {
            name: 'remove',
            type: Boolean,
            description: 'remove specific platform form project.'
        }
    ];
    availablePlatforms = ['blackberry10', 'android', 'ios', 'osx', 'ubuntu', 'windows'];
    platforms = require('../platformsConfig.json');
    run(args: string[], _config: ProjectConfig): Promise<any> {
        let promises: Array<any> = [];
        if (args.length) {
            if (args.length > 1) {
                if (this.platforms[args[1]] !== undefined) {
                    let act = (args[0] === 'remove') ? 'remov' : args[0];
                    logger.info(`${act}ing platform ${args[1]}...`);
                    promises.push(cordova.raw.platforms(args[0], args[1]));
                    if (this.platforms[args[1]].deprecated && args[0] === 'add')
                    logger.warn(`platform ${args[1]} has been deprecated and will no longer be supported in future versions`);
                } else {
                    logger.error(`Cannot find platform ${args[1]}`);
                }
            } else {
                logger.info(`You need to specify what platform you want to ${args[0]}.`);
            }
        }
        return Promise.all(promises);
    }
}