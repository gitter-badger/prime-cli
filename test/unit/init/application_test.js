
'use strict';

const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');
const yoAssert = require('yeoman-assert');
const helpers = require('yeoman-test');

const createApplicationGenerator
  = require('../../../lib/init/application/application').createApplicationGenerator;

suite('init/application', () => {

  test('creates expected 1.x files while passed the 1.x template name', (done) => {
    const TestGenerator = createApplicationGenerator('prime-1.x');
    helpers
      .run(TestGenerator)
      .withPrompts({name: 'foobar'})
      .on('end', (a) => {
        yoAssert.file(['bower.json']);
        yoAssert.fileContent('src/app/foobar-app.html', 'Polymer({');
        done();
      });
  });


  test('ignoring filenames with dangling underscores when generating templates', (done) => {
    const TestGenerator = createApplicationGenerator('prime-1.x');
    helpers
      .run(TestGenerator)
      .on('end', (a) => {
        yoAssert.noFile(['src/app/_app.html']);
        done();
      });
  });

  test('works when package.json with no name is present', (done) => {
    const TestGenerator = createApplicationGenerator('prime-1.x');
    helpers
      .run(TestGenerator)
      .inTmpDir((tempDir) => {
        fs.writeFileSync(path.join(tempDir, 'bower.json'), '{}');
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
