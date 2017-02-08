
import * as chalk from 'chalk';
import * as commandLineUsage from 'command-line-usage';
import * as logging from 'plylog';
import {ProjectConfig} from 'prime-project-config';

import {globalArguments} from '../args';

import {Command, CommandOptions} from './command';

let logger = logging.getLogger('cli.command.help');

const b = chalk.blue;
const m = chalk.magenta;
const CLI_TITLE = chalk.bold.underline('Prime-CLI');
const CLI_DESCRIPTION = 'The multi-tool for Prime projects';
const CLI_USAGE = 'Usage: \`prime <command> [options ...]\`';

const HELP_HEADER = '\n' +
  b('   /\\˜˜/   ') + m('/\\˜˜/') + b('\\   ') + '\n' +
  b('  /__\\/   ') + m('/__\\/') + b('__\\  ') + '  ' + CLI_TITLE + '\n' +
  b(' /\\  /   ') + m('/\\  /') + b('\\  /\\ ') + '\n' +
  b('/__\\/   ') + m('/__\\/  ') + b('\\/__\\') + '  ' + CLI_DESCRIPTION + '\n' +
  b('\\  /\\  ') + m('/\\  /   ') + b('/\\  /') + '\n' +
  b(' \\/__\\') + m('/__\\/   ') + b('/__\\/ ') + '  ' + CLI_USAGE + '\n' +
  b('  \\  ') + m('/\\  /   ') + b('/\\  /  ') + '\n' +
  b('   \\') + m('/__\\/   ') + b('/__\\/   ') + '\n';

  export class HelpCommand implements Command {
  name = 'help';

  description = 'Shows this help message, or help for a specific command';
  parseArgs = true;
  args = [{
    name: 'command',
    description: 'The command to display help for',
    defaultOption: true,
  }];

  commands: Map<String, Command> = new Map();

  constructor(commands: Map<String, Command>) {
    this.commands = commands;
  }

  generateGeneralUsage() {
    return commandLineUsage([
      {
        content: HELP_HEADER,
        raw: true,
      },
      {
        header: 'Available Commands',
        content: Array.from(this.commands.values()).map((command) => {
          return {name: command.name, summary: command.description};
        }),
      },
      {header: 'Global Options', optionList: globalArguments},
      {
        content:
            'Run `prime help <command>` for help with a specific command.',
        raw: true,
      }
    ]);
  }

  generateCommandUsage(command: Command) {
    return commandLineUsage([
      {
        header: `prime ${command.name}`,
        content: command.description,
      },
      {header: 'Command Options', optionList: command.args},
      {header: 'Global Options', optionList: globalArguments},
    ]);
  }

  run(options: CommandOptions, _config: ProjectConfig): Promise<any> {
    return new Promise<any>((resolve, _) => {
      const commandName: string = options['command'];
      if (!commandName) {
        logger.debug(
            'no command given, printing general help...', {options: options});
        console.log(this.generateGeneralUsage());
        resolve(null);
        return;
      }

      let command = this.commands.get(commandName);
      if (!command) {
        logger.error(`'${commandName}' is not an available command.`);
        console.log(this.generateGeneralUsage());
        resolve(null);
        return;
      }

      logger.debug(`printing help for command '${commandName}'...`);
      console.log(this.generateCommandUsage(command));
      resolve(null);
    });
  }
}