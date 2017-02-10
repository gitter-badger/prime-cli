
'use strict';

const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');
const yoAssert = require('yeoman-assert');
const helpers = require('yeoman-test');

const createElementGenerator
  = require('../../../lib/init/plugin/plugin').createPluginGenerator;

suite('init/element', () => {

  test('creates expected 1.x files while passed the 1.x template name', (done) => {
    const TestGenerator = createElementGenerator('prime-1.x');
    helpers
      .run(TestGenerator)
      .withPrompts({pluginName: 'Foo',pluginId:'cordova-plugin-foo',packageName:'com.foo.bar',mainFileName:'Foo'})
      .on('end', (a) => {
        yoAssert.file(['package.json']);
        yoAssert.file(['plugin.xml']);
        yoAssert.fileContent('www/Foo.js', 'module.exports');
        done();
      });
  });

  test('ignoring filenames with dangling underscores when generating templates', (done) => {
    const TestGenerator = createElementGenerator('prime-1.x');
    helpers
      .run(TestGenerator)
      .on('end', (a) => {
        yoAssert.noFile(['_element.html']);
        done();
      });
  });

  test('works when package.json with no name is present', (done) => {
    const TestGenerator = createElementGenerator('prime-1.x');
    helpers
      .run(TestGenerator)
      .inTmpDir((tempDir) => {
        fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      })
      .on('error', (error) => {
        assert.fail();
        done();
      })
      .on('end', (a) => {
        done();
      });
  });


});
