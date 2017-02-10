
'use strict';

const assert = require('chai').assert;
const ProjectConfig = require('prime-project-config').ProjectConfig;
const PrimeCli = require('../../../lib/prime-cli').PrimeCli;
const sinon = require('sinon');

suite('help', () => {
  const defaultConfig = new ProjectConfig();

  test('displays help for a specific command when called with that command', () => {
    let cli = new PrimeCli(['help', 'build']);
    let helpCommand = cli.commands.get('help');
    let helpCommandSpy = sinon.spy(helpCommand, 'run');
    cli.run();
    assert.isOk(helpCommandSpy.calledOnce);
    assert.deepEqual(
      helpCommandSpy.firstCall.args,
      [{command: 'build'}, defaultConfig]
    );
  });

  test('displays general help when the help command is called with no arguments', () => {
    let cli = new PrimeCli(['help']);
    let helpCommand = cli.commands.get('help');
    let helpCommandSpy = sinon.spy(helpCommand, 'run');
    cli.run();
    assert.isOk(helpCommandSpy.calledOnce);
    assert.deepEqual(helpCommandSpy.firstCall.args, [{}, defaultConfig]);
  });

});
