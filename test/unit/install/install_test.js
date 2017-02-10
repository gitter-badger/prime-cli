
'use strict';

const assert = require('chai').assert;

const polymerInstall = require('../../../lib/install/install');

suite('install', () => {

  suite('_mergeJson', () => {

    test('overwrites primitives and arrays', () => {
      const from = {
        'a': 'bar',
        'b': 2,
        'c': false,
        'd': 'not null',
        'e': ['non-empty'],
        'g': 'no collision',
      };
      const to = {
        'a': 'foo',
        'b': 1,
        'c': true,
        'd': null,
        'e': [],
        'f': 'not overwritten',
      };
      const merged = polymerInstall._mergeJson(from, to);
      assert.deepEqual(merged, {
        'a': 'bar',
        'b': 2,
        'c': false,
        'd': 'not null',
        'e': ['non-empty'],
        'f': 'not overwritten',
        'g': 'no collision',
      });
    });

    test('merges nested objects', () => {
      const from = {
        'a': {
          'b': {
            'c': 'bar',
          },
        },
      };
      const to = {
        'a': {
          'b': {
            'c': 'foo',
            'd': 'baz',
          },
          'e': 'qux',
        },
      };
      const merged = polymerInstall._mergeJson(from, to);
      assert.deepEqual(merged, {
        'a': {
          'b': {
            'c': 'bar',
            'd': 'baz',
          },
          'e': 'qux',
        },
      });
    });
  });

});
