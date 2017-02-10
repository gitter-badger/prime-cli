'use strict';

const assert = require('chai').assert;
const path = require('path');

const loadServiceWorkerConfig = require('../../../lib/build/load-config').loadServiceWorkerConfig;

suite('load-config', () => {
  suite('loadServiceWorkerConfig()', () => {
    test('should parse the given js file', (done) => {
      const configFile = path.resolve(__dirname, '../', 'fixtures', 'service-worker-config.js');
      loadServiceWorkerConfig(configFile).then((config) => {
        assert.ok(config);
        assert.deepEqual(config.staticFileGlobs, ['*']);
        done();
      })
    });
  });
});