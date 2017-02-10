
'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const PrimeCli = require('../../../lib/prime-cli').PrimeCli;
const primeInit = require('../../../lib/init/init');

suite('init', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.sandbox.create();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('runs the given generator when name argument is provided', () => {
    let runGeneratorStub = sandbox.stub(primeInit, 'runGenerator').returns(Promise.resolve());
    let cli = new PrimeCli(['init', 'shop'], null);
    cli.run();
    assert.isOk(runGeneratorStub.calledOnce);
    assert.isOk(runGeneratorStub.calledWith(`prime-init-shop:app`, {
      name: 'shop',
    }));
  });

  test('prompts the user to select a generator when no argument is provided', () => {
    let promptSelectionStub = sandbox.stub(primeInit, 'promptGeneratorSelection').returns(Promise.resolve());
    let cli = new PrimeCli(['init'], null);
    cli.run();
    assert.isOk(promptSelectionStub.calledOnce);
  });

});
