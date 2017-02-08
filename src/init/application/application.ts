import * as chalk from 'chalk';
import * as path from 'path';
import Generator = require('yeoman-generator');
import * as del from 'del';
const cordova = require('cordova-lib').cordova;
const Q = require('q');
/**
 * Returns a Yeoman Generator constructor that can be passed to yeoman to be
 * run. A "template name" argument is required to choose the correct
 * `/templates` directory name to generate from.
 * (Ex: "polymer-2.x" to generate the `templates/polymer-2x` template directory)
 */
export function createApplicationGenerator(templateName: string):
    (typeof Generator) {
  return class ApplicationGenerator extends Generator {
    props: any;

    constructor(args: string|string[], options: any) {
      super(args, options);
      this.sourceRoot(path.join(__dirname, 'templates', templateName));
    }

    // This is necessary to prevent an exception in Yeoman when creating
    // storage for generators registered as a stub and used in a folder
    // with a package.json but with no name property.
    // https://github.com/Polymer/polymer-cli/issues/186
    rootGeneratorName(): string {
      return 'ApplicationGenerator';
    }

    initializing() {
      // Yeoman replaces dashes with spaces. We want dashes.
      this.appname = this.appname.replace(/\s+/g, '-');
    }

    async prompting(): Promise<void> {
      const prompts = [
        {
          name: 'name',
          type: 'input',
          message: `Application name`,
          default: this.appname,
        },
        {
          type: 'input',
          name: 'elementName',
          message: `Main element name`,
          default: (answers: any) => `${answers.name}-app`,
          validate: (name: string) => {
            let nameContainsHyphen = name.includes('-');
            if (!nameContainsHyphen) {
              this.log(
                  '\nUh oh, custom elements must include a hyphen in ' +
                  'their name. Please try again.');
            }
            return nameContainsHyphen;
          },
        },
        {
          type: 'input',
          name: 'description',
          message: 'Brief description of the application',
        },
      ];

      this.props = await this.prompt(prompts);
    }

    writing() {
      const elementName = this.props.elementName;
      Q.fcall(() => {
        this.log('Generating cordova project...');
        // create a new cordova project in current directory.
        return cordova.raw.create('.','com.prime.blank','PrimeDemo');
      }).then(() =>{
        // clean all files in www directory that created when we create cordova project.
        del(path.join(this.destinationPath(),'www','**','*'));
        let data = {
          "directory": "src/bower_components/",
          "timeout": 60000
        };
        // create .bowerrc file to redirect all components to src > bower_components folder.
        this.fs.writeJSON(`${path.join(this.destinationPath(),'.bowerrc')}`, data);
        // create .gitignore to ignore bower_components folder.
        this.fs.write(`${path.join(this.destinationPath(),'src','.gitignore')}`, 'bower_components');
        // copy all the template that selected by user.
        this.fs.copyTpl(
          `${this.templatePath()}/**/?(.)!(_)*`,
          this.destinationPath(),
          this.props);
        this.fs.copyTpl(
            this.templatePath('src/app/_app.html'),
            `src/app/${elementName}.html`,
            this.props);
        
      });
      
    }

    install() {
      this.log(chalk.bold('\nProject generated!'));
      this.log('Installing dependencies...');
      this.installDependencies({
        npm: false,
      });
    }

    end() {
      this.log(chalk.bold('\nSetup Complete!'));
      this.log(
          'Check out your new project README for information about what to do next.\n');
    }
  };
}