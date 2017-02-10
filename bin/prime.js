#!/usr/bin/env node

process.title = 'prime';

const resolve = require('resolve');
const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');
const program = require('commander');
const logging = require('plylog');
const logger = logging.getLogger('cli');
updateNotifier({pkg: packageJson}).notify();

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