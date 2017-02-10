import * as chalk from 'chalk';
import * as path from 'path';
import Generator = require('yeoman-generator');
import * as glob from 'glob';
const Q = require('q');
/**
 * Returns a Yeoman Generator constructor that can be passed to yeoman to be
 * run. A "template name" argument is required to choose the correct
 * `/templates` directory name to generate from.
 * (Ex: "polymer-2.x" to generate the `templates/polymer-2x` template directory)
 */
// function capitalizeFirstLetter(string: string) {
//     var word = string.split(' ');
//     var results: Array<string> = [];
//     if(word.length > 1){
//         word.forEach(function(item){
//             results.push(item.charAt(0).toUpperCase() + item.slice(1)); 
//         });
//         return results.join(' ');
//     }else{
//         return string.charAt(0).toUpperCase() + string.slice(1);
//     }
// }
export function createPluginGenerator(_templateName: string):
    (typeof Generator) {
  return class ApplicationGenerator extends Generator {
    props: any;
    pluginId: any;
    constructor(args: string|string[], options: any) {
      super(args, options);
      this.sourceRoot(path.join(__dirname, 'templates', _templateName));
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
      this.pluginId = this.appname.replace(/\s+/g, '-');
    }

    async prompting(): Promise<void> {
      const prompts = [
        {
          name: 'pluginName',
          type: 'input',
          message: 'Plugin name',
          default: this.appname,
        },
        {
          type: 'input',
          name: 'pluginId',
          message: 'Plugin id',
          default: (answers: any) => `cordova-plugin-${answers.pluginName}`,
          validate: (name: string) => {
            let nameContainsHyphen = name.includes('-');
            if (!nameContainsHyphen) {
              this.log(
                  '\nUh oh, pluginId must include a hyphen in ' +
                  'their name. Please try again.');
            }
            return nameContainsHyphen;
          },
        },
        {
          type: 'input',
          name: 'mainFileName',
          message: 'Main file name',
          default: 'Main',
          validate: (filename: string) => {
            let nameContainsSpace = filename.includes(' ');
            if (nameContainsSpace) {
              this.log(
                  '\nUh oh, Main file name cannot contain a space in ' +
                  'their name. Please try again.');
            }
            return !nameContainsSpace;
          }
        },
        {
          type: 'input',
          name: 'packageName',
          message: 'Java Package name (usually used in android & amazon fireos)',
          default: 'org.apache.cordova.prime',
          validate: (packageName: string) => {
            let nameContainsDot = packageName.includes('.');
            if (!nameContainsDot) {
              this.log(
                  '\nUh oh, package name must include a dot in ' +
                  'their name. Please try again.');
            }
            return nameContainsDot;
          }
        },
        {
            type: 'checkbox',
            name: 'platforms',
            message: 'Select platforms you want to support in this plugin',
            choices: ['android', 'ios', 'blackberry10', 'windows', 'ubuntu', 'amazon'],
            default: ['android', 'ios']
        }
      ];
      this.props = await this.prompt(prompts);
    }

    async writing() {
      let fileName = this.props.mainFileName;
      await Q.fcall(() => {
        this.log('Generating cordova plugin...');
        let platforms: any = {};
        this.props.mainFileNameUpper = this.props.mainFileName.toUpperCase();
        this.props.mainFileNameLower = this.props.mainFileName.toLowerCase();
        this.props.platforms.forEach((platform: string) => {
          platforms[platform] = true;
          return true;
        });
        this.props.platforms = platforms;
        return platforms;
      }).then((platforms: any) => {
        this.log('Copying plugin template...');
        this.fs.copyTpl(
          `${this.templatePath()}/**/?(.)!(_)*`,
          this.destinationPath(),
          this.props);
        this.fs.copyTpl(
          `${this.templatePath()}/www/_main.js`,
          `www/${fileName}.js`,
          this.props);
        platforms = Object.keys(platforms);
        platforms.forEach((platform: string) => {
          glob(this.templatePath(`src/${platform}/*`),{},(_err,files) => {

            files.forEach((file: string) => {
              let ext = path.extname(file);
              if(!ext.includes('gradle')) {
                this.fs.copyTpl(
                  file,
                  `src/${platform}/${fileName}${ext}`,
                  this.props);
              }
            })
          });
        });
      });
    }

    install() {
      this.log(chalk.bold('\nProject generated!'));
      this.log('Installing dependencies...');
      this.installDependencies({
        npm: true,
        bower: false
      });
    }

    end() {
      this.log(chalk.bold('\nSetup Complete!'));
    }
  };
}