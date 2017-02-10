
'use strict';

const path = require('path');
const assert = require('chai').assert;
const PrimeCli = require('../../../lib/prime-cli').PrimeCli;
const polylintCli = require('polylint/lib/cli');
const sinon = require('sinon');

suite('lint', () => {

  let polylintCliStub;
  let defaultConfigOptions;

  setup(function() {
    polylintCliStub = sinon.stub(polylintCli, 'runWithOptions').returns(Promise.resolve());
    defaultConfigOptions = {
      entrypoint: 'index.html',
      fragments: ['foo.html'],
      shell: 'bar.html',
    };
  });

  teardown(() => {
    polylintCliStub.restore();
  });

  test('lints the entrypoint, shell, and fragments when no specific inputs are given', () => {
    let cli = new PrimeCli(['lint'], defaultConfigOptions);
    cli.run();
    assert.isOk(polylintCliStub.calledOnce);
    assert.deepEqual(polylintCliStub.firstCall.args[0].input, [
      `${path.sep}index.html`,
      `${path.sep}bar.html`,
      `${path.sep}foo.html`,
    ]);
  });

  test('lints the given files when provided through the `input` argument', () => {
    let cli = new PrimeCli(['lint', '--input', 'PATH/TO/TEST_THIS_FILE.html'], defaultConfigOptions);
    cli.run();
    assert.isOk(polylintCliStub.calledOnce);
    assert.deepEqual(polylintCliStub.firstCall.args[0].input, ['PATH/TO/TEST_THIS_FILE.html']);
  });

  test('lints the given files when provided through the default arguments', () => {
    let cli = new PrimeCli(['lint', 'PATH/TO/TEST_THIS_FILE.html'], defaultConfigOptions);
    cli.run();
    assert.isOk(polylintCliStub.calledOnce);
    assert.deepEqual(polylintCliStub.firstCall.args[0].input, ['PATH/TO/TEST_THIS_FILE.html']);
  });

  test('follow and lint dependencies by default when no specific inputs are given', () => {
    let cli = new PrimeCli(['lint'], defaultConfigOptions);
    cli.run();
    assert.isOk(polylintCliStub.calledOnce);
    assert.equal(polylintCliStub.firstCall.args[0]['no-recursion'], false);
  });

  test('does not follow and lint dependencies when specific inputs are given', () => {
    let cli = new PrimeCli(['lint', 'PATH/TO/TEST_THIS_FILE.html'], defaultConfigOptions);
    cli.run();
    assert.isOk(polylintCliStub.calledOnce);
    assert.equal(polylintCliStub.firstCall.args[0]['no-recursion'], true);
  });

  test('follows and lint dependencies when "follow-dependencies" argument is true', () => {
    let cli = new PrimeCli(['lint', '--follow-dependencies', 'PATH/TO/TEST_THIS_FILE.html'], defaultConfigOptions);
    cli.run();
    assert.isOk(polylintCliStub.calledOnce);
    assert.equal(polylintCliStub.firstCall.args[0]['no-recursion'], false);
  });

  test('does not follow and lint dependencies when "no-follow-dependencies" argument is true', () => {
    let cli = new PrimeCli(['lint', '--no-follow-dependencies'], defaultConfigOptions);
    cli.run();
    assert.isOk(polylintCliStub.calledOnce);
    assert.equal(polylintCliStub.firstCall.args[0]['no-recursion'], true);
  });

});
