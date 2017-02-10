
'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const helpers = require('yeoman-test');

const createGithubGenerator
  = require('../../../lib/init/github').createGithubGenerator;

/**
 * This small helper function wraps createGithubGenerator() so that we may add a
 * callback to access the github generator before it is run by Yeoman. Yeoman
 * doesn't give us this option otherwise (it takes a generator constructor and
 * creates the generator itself, internally).
 */
function createTestGenerator(generatorOptions, generatorWillRun) {
  return function TestGenerator(args, options) {
    const GithubGenerator = createGithubGenerator(generatorOptions);
    const githubGenerator = new GithubGenerator(args, options);
    generatorWillRun(githubGenerator);
    return githubGenerator;
  }
}

suite('init/github', () => {

  suite('createGithubGenerator()', () => {

    const semverMatchingRelease = {
      tarball_url: 'MATCHING_RELEASE_TARBALL_URL',
      tag_name: 'MATCHING_RELEASE_TAG_NAME',
    };

    test('returns a generator that untars the latest release when no semver range is given', (done) => {
      let getSemverReleaseStub;
      let extractReleaseTarballStub;

      const TestGenerator = createTestGenerator({
        owner: 'Polymer',
        repo: 'shop',
      }, function setupGeneratorStubs(generator) {
        getSemverReleaseStub = sinon
            .stub(generator._github, 'getSemverRelease')
            .returns(Promise.resolve(semverMatchingRelease));
        extractReleaseTarballStub = sinon
            .stub(generator._github, 'extractReleaseTarball')
            .returns(Promise.resolve());
      });

      helpers.run(TestGenerator)
        .on('end', (a) => {
          assert.isOk(getSemverReleaseStub.calledWith('*'));
          assert.isOk(extractReleaseTarballStub.calledWith(semverMatchingRelease.tarball_url));
          done();
        });
    });

    test('returns a generator that untars the latest matching release when a semver range is given', (done) => {
      const testSemverRange = '^v123.456.789';
      let getSemverReleaseStub;
      let extractReleaseTarballStub;

      const TestGenerator = createTestGenerator({
        owner: 'Polymer',
        repo: 'shop',
        semverRange: testSemverRange,
      }, function setupGeneratorStubs(generator) {
        getSemverReleaseStub = sinon
            .stub(generator._github, 'getSemverRelease')
            .returns(Promise.resolve(semverMatchingRelease));
        extractReleaseTarballStub = sinon
            .stub(generator._github, 'extractReleaseTarball')
            .returns(Promise.resolve());
      });

      helpers.run(TestGenerator)
        .on('end', (a) => {
          assert.isOk(getSemverReleaseStub.calledWith(testSemverRange));
          assert.isOk(extractReleaseTarballStub.calledWith(semverMatchingRelease.tarball_url));
          done();
        });
    });

  });

});
