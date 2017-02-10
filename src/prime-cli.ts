import * as commandLineArgs from 'command-line-args';

import {Command} from './commands/command';
import {AnalyzeCommand} from './commands/analyze';
import {BuildCommand} from './commands/build';
import {HelpCommand} from './commands/help';
import {InitCommand} from './commands/init';
import {InstallCommand} from './commands/install';
import {LintCommand} from './commands/lint';
import {ServeCommand} from './commands/serve';
import {PlatformsCommand} from './commands/platforms';
import {PluginCommand} from './commands/plugin';

import * as logging from 'plylog';
import {ProjectConfig, ProjectOptions} from 'prime-project-config';
import {globalArguments, mergeArguments} from './args';
import {ParsedCommand} from 'command-line-commands';
import commandLineCommands = require('command-line-commands');
// import {ParsedCommand} from 'command-line-commands';

const logger = logging.getLogger('cli.main');

process.on('uncaughtException', (error: any) => {
    logger.error(`Uncaught exception: ${error}`);
    if (error.stack)
        logger.error(error.stack);
    process.exit(1);
});

process.on('unhandledRejection', (error: any) => {
    logger.error(`Promise rejection: ${error}`);
    if (error.stack)
        logger.error(error.stack);
    process.exit(1);
});

function parseCLIArgs(commandOptions: any): {[name: string]: string} {
    commandOptions = commandOptions && commandOptions['_all'];
    let parsedOptions = Object.assign({}, commandOptions);

    if (commandOptions['extra-dependencies']) {
        parsedOptions.extraDependencies = commandOptions['extra-dependencies'];
    }
    if (commandOptions['root-dir']) {
        parsedOptions.rootDir = commandOptions['root-dir'];
    }
    if (commandOptions['out-dir']) {
        parsedOptions.outDir = commandOptions['out-dir'];
    }
    return parsedOptions;
}

export class PrimeCli {
    commands: Map<string, Command> = new Map();
    args: string[];
    defaultConfigOptions: ProjectOptions;
    shouldParseArgs: Boolean;
    constructor(args: string[], configOptions?: any) {
        // If the "--quiet"/"-q" flag is ever present, set our global logging
        // to quiet mode. Also set the level on the logger we've already created.
        if (args.indexOf('--quiet') > -1 || args.indexOf('-q') > -1) {
            logging.setQuiet();
        }

        // If the "--verbose"/"-v" flag is ever present, set our global logging
        // to verbose mode. Also set the level on the logger we've already created.
        if (args.indexOf('--verbose') > -1 || args.indexOf('-v') > -1) {
            logging.setVerbose();
        }

        this.args = args;
        logger.debug('got args:', {args: args});
        if (typeof configOptions !== 'undefined') {
            this.defaultConfigOptions = configOptions;
            logger.debug(
                'got default config from constructor argument:',
                {config: this.defaultConfigOptions});
        } else {
            this.defaultConfigOptions =
                ProjectConfig.loadOptionsFromFile('prime.json');
            if (this.defaultConfigOptions) {
                logger.debug(
                    'got default config from prime.json file:',
                    {config: this.defaultConfigOptions});
            } else {
                logger.debug('no prime.json file found, no config loaded');
            }
        }
        this.addCommand(new AnalyzeCommand());
        this.addCommand(new BuildCommand());
        this.addCommand(new HelpCommand(this.commands));
        this.addCommand(new InitCommand());
        this.addCommand(new InstallCommand());
        this.addCommand(new LintCommand());
        this.addCommand(new ServeCommand());
        this.addCommand(new PlatformsCommand());
        this.addCommand(new PluginCommand());
        this.shouldParseArgs = this._shouldParseArgs();
    }
    addCommand(command: Command) {
        logger.debug('adding command', command.name);
        this.commands.set(command.name, command);
    }
    getCommandsWithoutParsedArgs(): string[] {
        let withoutParsedCommandsName: string[] = [];
        this.commands.forEach((command) => {
            if (!command.parseArgs) {
                withoutParsedCommandsName.push(command.name);
            }
        });
        return withoutParsedCommandsName;
    }
    _shouldParseArgs() {
        let exceptions: string[] = this.getCommandsWithoutParsedArgs();
        let args = this.args;
        if (exceptions.includes(args[0])) {
            return false;
        } else {
            return true;
        }
    }
    _shouldParseCLIArgs() {
        let exceptions: string[] = this.getCommandsWithoutParsedArgs();
        let arg = (this.args[0].startsWith('--')) ? this.args[0].replace('--','') : this.args[0];
        if (exceptions.includes(arg) && !arg.includes('help') && !arg.includes('-h')) {
            return false;
        } else {
            return true;
        }
    }
    run(): Promise<any> {
        const helpCommand = this.commands.get('help')!;
        const commandNames = Array.from(this.commands.keys());
        let parsedArgs: ParsedCommand|any;
        logger.debug('running...');
        logger.debug('running command with arg',this.args);
        if (this.args.indexOf('--version') > -1) {
            console.log(require('../package.json').version);
            return Promise.resolve();
        }
        try {
            parsedArgs = (this.shouldParseArgs) ? commandLineCommands(commandNames, this.args) : this.args;
            logger.debug('parseArgs',parsedArgs);
        } catch (error) {
        // Prime CLI needs a valid command name to do anything. If the given
        // command is invalid, run the generalized help command with default
        // config. This should print the general usage information.
            if (error.name === 'INVALID_COMMAND') {
                if (error.command) {
                    logger.warn(`'${error.command}' is not an available command.`);
                }
                return helpCommand.run(
                    {command: error.command},
                    new ProjectConfig(this.defaultConfigOptions));
            }
            // If an unexpected error occurred, propagate it
            throw error;
        }

        const commandName = (this.shouldParseArgs) ? parsedArgs.command : this.args[0];
        const commandArgs = (this.shouldParseArgs) ? parsedArgs.argv : this.args.slice(1);
        const command = this.commands.get(commandName)!;
        if (command == null)
            throw new TypeError('command is null');

        logger.debug(
            `command '${commandName}' found, parsing command args:`,
            {args: commandArgs});

        const commandDefinitions = mergeArguments([command.args, globalArguments]);
        const commandOptionsRaw = commandLineArgs(commandDefinitions, commandArgs);
        const commandOptions: any = (this._shouldParseCLIArgs()) ? parseCLIArgs(commandOptionsRaw) : this.args.slice(1);
        logger.debug(`command options parsed from args:`, commandOptions);

        const mergedConfigOptions =
            Object.assign({}, this.defaultConfigOptions, commandOptions);

        const config = new ProjectConfig(mergedConfigOptions);
        logger.debug(`final project configuration generated:`, config);

        // Help is a special argument for displaying help for the given command.
        // If found, run the help command instead, with the given command name as
        // an option.
        if (commandOptions['help']) {
            logger.debug(
                `'--help' option found, running 'help' for given command...`);
            return helpCommand.run({command: commandName}, config);
        }

        logger.debug('Running command...');
        return command.run(commandOptions, config);
    }
}