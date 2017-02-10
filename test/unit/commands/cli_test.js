
'use strict';

const packageJSON = require('../../../package.json');
const PrimeCli = require('../../../lib/prime-cli').PrimeCli;
const logging = require('plylog');
const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');

suite('The general CLI', () => {

  test('displays general help when no command is called', () => {
    let cli = new PrimeCli([]);
    let helpCommand = cli.commands.get('help');
    let helpCommandSpy = sinon.spy(helpCommand, 'run');
    return cli.run().then(() => {
      assert.isOk(helpCommandSpy.calledOnce);
      assert.deepEqual(helpCommandSpy.firstCall.args[0], {command: null});
    });
  });

  test('displays general help when no command is called with the --help flag', () => {
    let cli = new PrimeCli(['--help']);
    let helpCommand = cli.commands.get('help');
    let helpCommandSpy = sinon.spy(helpCommand, 'run');
    return cli.run().then(() => {
      assert.isOk(helpCommandSpy.calledOnce);
      assert.deepEqual(helpCommandSpy.firstCall.args[0], {command: null});
    });
  });

  test('displays general help when unknown command is called', () => {
    let cli = new PrimeCli(['THIS_IS_SOME_UNKNOWN_COMMAND']);
    let helpCommand = cli.commands.get('help');
    let helpCommandSpy = sinon.spy(helpCommand, 'run');
    return cli.run().then(() => {
      assert.isOk(helpCommandSpy.calledOnce);
      assert.deepEqual(helpCommandSpy.firstCall.args[0], {command: 'THIS_IS_SOME_UNKNOWN_COMMAND'});
    });
  });

  test('displays command help when called with the --help flag', () => {
    let cli = new PrimeCli(['build', '--help']);
    let helpCommand = cli.commands.get('help');
    let helpCommandSpy = sinon.spy(helpCommand, 'run');
    return cli.run().then(() => {
      assert.isOk(helpCommandSpy.calledOnce);
      assert.deepEqual(helpCommandSpy.firstCall.args[0], {command: 'build'});
    });
  });

  test('displays command help when called with the -h flag', () => {
    let cli = new PrimeCli(['init', '-h']);
    let helpCommand = cli.commands.get('help');
    let helpCommandSpy = sinon.spy(helpCommand, 'run');
    return cli.run().then(() => {
      assert.isOk(helpCommandSpy.calledOnce);
      assert.deepEqual(helpCommandSpy.firstCall.args[0], {command: 'init'});
    });
  });

  test('displays version information when called with the --version flag', () => {
    let cli = new PrimeCli(['--version']);
    let consoleLogSpy = sinon.spy(console, 'log');
    return cli.run().then(() => {
      assert.isOk(consoleLogSpy.calledWithExactly(packageJSON.version));
      consoleLogSpy.restore();
    });
  });

  test('sets the appropriate log levels when the --verbose & --quiet flags are used', () => {
    let logger = logging.getLogger('TEST_LOGGER');
    new PrimeCli(['help', '--verbose']);
    assert.equal(logger.level, 'debug');
    new PrimeCli(['help', '--quiet']);
    assert.equal(logger.level, 'error');
  });

  test('read config from flags', () => {
    let cli = new PrimeCli([
      'build',
      '--root-dir', 'public-cli',
      '--out-dir', 'out-cli',
      '--entrypoint', 'foo-cli.html',
      '--shell', 'bar-cli.html',
      '--sources', '**/*',
      '--extra-dependencies', 'bower_components/baz-cli/**/*',
    ]);
    let buildCommand = cli.commands.get('build');
    let buildCommandStub = sinon.stub(buildCommand, 'run').returns(Promise.resolve());
    return cli.run().then(() => {
      assert.isOk(buildCommandStub.calledOnce);
      let config = buildCommandStub.firstCall.args[1];
      let expectedRoot = path.resolve('public-cli');
      let expectedOut = path.resolve('out-cli');
      assert.equal(config.rootDir, expectedRoot);
      assert.equal(config.outDir, expectedOut);
      assert.equal(config.entrypoint, path.resolve(expectedRoot, 'foo-cli.html'));
      assert.equal(config.shell, path.resolve(expectedRoot, 'bar-cli.html'));
      assert.deepEqual(config.extraDependencies, [path.resolve(expectedRoot, 'bower_components/baz-cli/**/*')]);
      assert.deepEqual(config.sources, [
        path.resolve(expectedRoot, '**/*'),
        path.resolve(expectedRoot, 'foo-cli.html'),
        path.resolve(expectedRoot, 'bar-cli.html'),
      ]);
    });
  });

 test('flags override default config values', () => {
    let cli = new PrimeCli(['build',
        '--root-dir', 'public-cli',
        '--out-dir', 'out-cli',
        '--entrypoint', 'foo-cli.html',
        '--extra-dependencies', 'bower_components/baz-cli/**/*',
      ], {
        rootDir: 'public',
        outDir: 'out',
        entrypoint: 'foo.html',
        shell: 'bar.html',
        extraDependencies: ['bower_components/baz/**/*'],
        sources: ['src/**'],
      });
    let buildCommand = cli.commands.get('build');
    let buildCommandStub = sinon.stub(buildCommand, 'run').returns(Promise.resolve());
    return cli.run().then(() => {
      assert.isOk(buildCommandStub.calledOnce);
      let config = buildCommandStub.firstCall.args[1];
      let expectedRoot = path.resolve('public-cli');
      let expectedOut = path.resolve('out-cli');
      assert.equal(config.rootDir, expectedRoot);
      assert.equal(config.outDir, expectedOut);
      assert.equal(config.entrypoint, path.resolve(expectedRoot, 'foo-cli.html'));
      assert.equal(config.shell, path.resolve(expectedRoot, 'bar.html'));
      assert.deepEqual(config.extraDependencies, [path.resolve(expectedRoot, 'bower_components/baz-cli/**/*')]);
      assert.deepEqual(config.sources, [
        path.resolve(expectedRoot, 'src/**'),
        path.resolve(expectedRoot, 'foo-cli.html'),
        path.resolve(expectedRoot, 'bar.html'),
      ]);
    });
  });

});
