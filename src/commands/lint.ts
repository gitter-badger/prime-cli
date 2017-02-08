import * as commandLineArgs from 'command-line-args';
import * as logging from 'plylog';
import {ProjectConfig} from 'prime-project-config';
import {Command, CommandOptions} from './command';

const logger = logging.getLogger('cli.lint');

export class LintCommand implements Command {
  name = 'lint';
  description = 'Lints the project';
  parseArgs = true;
  args = [
    {
      name: 'input',
      type: String,
      alias: 'i',
      defaultOption: true,
      multiple: true,
      description: 'Files and/or folders to lint. Exclusive. Defaults to cwd.'
    },
    {
      name: 'policy',
      type: String,
      alias: 'p',
      description: 'Your jsconf.json policy file.',
      defaultValue: false
    },
    {
      name: 'config-file',
      type: String,
      defaultValue: 'bower.json',
      description: (
          'If inputs are specified, look for `config-field` in this JSON file.')
    },
    {
      name: 'config-field',
      type: String,
      defaultValue: 'main',
      description:
          ('If config-file is used for inputs, this field determines which ' +
           'file(s) are linted.')
    },
    {
      name: 'follow-dependencies',
      type: Boolean,
      description:
          ('Follow through and lint dependencies. This is default behavior ' +
           'when linting your entire application via the entrypoint, shell, ' +
           'and fragment arguments.')
    },
    {
      name: 'no-follow-dependencies',
      type: Boolean,
      description:
          ('Only lint the files provided, ignoring dependencies. This is ' +
           'default behavior when linting a specific list of files provided ' +
           'via the input argument.')
    }
  ];

  run(options: CommandOptions, config: ProjectConfig): Promise<any> {
    // Defer dependency loading until this specific command is run
    const polylint = require('polylint/lib/cli');

    let lintFiles: string[] = options['input'];
    if (!lintFiles) {
      lintFiles = [];
      if (config.entrypoint)
        lintFiles.push(config.entrypoint);
      if (config.shell)
        lintFiles.push(config.shell);
      if (config.fragments)
        lintFiles = lintFiles.concat(config.fragments);
      lintFiles = lintFiles.map((p) => p.substring(config.rootDir.length));
    }

    if (lintFiles.length === 0) {
      logger.warn(
          'No inputs specified. Please use the --input, --entrypoint, ' +
          '--shell or --fragment flags');
      let argsCli = commandLineArgs(this.args);
      console.info(argsCli.getUsage({
        title: `polymer ${this.name}`,
        description: this.description,
      }));
      return Promise.resolve();
    }

    // Default to false if input files are provided, otherwise default to true
    let followDependencies = !options['input'];
    if (options['follow-dependencies']) {
      followDependencies = true;
    } else if (options['no-follow-dependencies']) {
      followDependencies = false;
    }

    return polylint
        .runWithOptions({
          input: lintFiles,
          rootDir: config.rootDir,
          // TODO: read into config
          bowerdir: 'bower_components',
          policy: options['policy'],
          'config-file': options['config-file'],
          'config-field': options['config-field'],
          // NOTE: `no-recursion` has the opposite behavior of
          // `follow-dependencies`
          'no-recursion': !followDependencies,
        })
        .then(() => undefined);
  }
}