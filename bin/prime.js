#!/usr/bin/env node

process.title = 'prime';

const resolve = require('resolve');
const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');
const program = require('commander');
const logging = require('plylog');
const logger = logging.getLogger('cli');
updateNotifier({pkg: packageJson}).notify();

let list = (directory,options)  => {
    const cmd = 'ls';
    let params = [];
    
    if (options.all) params.push("a");
    if (options.long) params.push("l");
    let parameterizedCommand = params.length 
                                ? cmd + ' -' + params.join('') 
                                : cmd ;
    if (directory) parameterizedCommand += ' ' + directory ;
    
    let output = (error, stdout, stderr) => {
        if (error) console.log(chalk.red.bold.underline("exec error:") + error);
        if (stdout) console.log(chalk.green.bold.underline("Result:") + stdout);
        if (stderr) console.log(chalk.red("Error: ") + stderr);
    };
    
    exec(parameterizedCommand,output);
    
};
resolve('prime-cli', {basedir: process.cwd()}, function(error, path) {
  let lib = path ? require(path) : require('../lib/prime-cli');
  let args = process.argv.slice(2);
  let cli = new lib.PrimeCli(args);
  cli.run().catch((err) => {
    logger.error(`cli runtime exception: ${err}`);
    if (err.stack) {
      logger.error(err.stack);
    }
    process.exit(1);
  });
});