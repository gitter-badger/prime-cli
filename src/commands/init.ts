import {ArgDescriptor} from 'command-line-args';
import * as logging from 'plylog';
import {ProjectConfig} from 'prime-project-config';
import {Command, CommandOptions} from './command';

let logger = logging.getLogger('cli.command.init');

export class InitCommand implements Command {
  name = 'init';
  description = 'Initializes a Prime project';
  parseArgs = true;
  args: ArgDescriptor[] = [{
    name: 'name',
    description: 'The template name to use to initialize the project',
    type: String,
    defaultOption: true,
  }];

  run(options: CommandOptions, _config: ProjectConfig): Promise<any> {
    // Defer dependency loading until needed
    const primeInit = require('../init/init');

    const templateName = options['name'];
    if (templateName) {
      const subgen = (templateName.indexOf(':') !== -1) ? '' : ':app';
      const generatorName = `prime-init-${templateName}${subgen}`;
      logger.debug('template name provided', {
        generator: generatorName,
        template: templateName,
      });
      return primeInit.runGenerator(generatorName, options);
    }

    logger.debug('no template name provided, prompting user...');
    return primeInit.promptGeneratorSelection();
  }
}
