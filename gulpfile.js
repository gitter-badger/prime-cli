/**
 * @license
 * Copyright (c) 2016 The Prime Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://nerdiex.github.io/Prime/AUTHORS.txt
 * The complete set of contributors may be found at http://nerdiex.github.io/Prime/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
'use strict';

const depcheck = require('depcheck');
const eslint = require('gulp-eslint');
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const typescript = require('gulp-typescript');
const mocha = require('gulp-mocha');
const tslint = require('gulp-tslint');
const prime = require('prime-build');
const cordovaLib = require('cordova-lib');
const cordova = cordovaLib.raw;
const mergeStream = require('merge-stream');

const tsProject = typescript.createProject('tsconfig.json');
function clean(done) {
    
}
gulp.task('clean',function(done){
  fs.remove(path.join(__dirname, 'lib'),done);
});

function build(){
    let tsReporter = typescript.reporter.defaultReporter();
    return mergeStream(
        tsProject.src().pipe(tsProject(tsReporter)),
        gulp.src(['src/**/*', '!src/**/*.ts'])
      ).pipe(gulp.dest('lib'));  
};
gulp.task('build',gulp.series('clean',build));
gulp.task('tslint', gulp.series(() => {
  return gulp.src('src/**/*.ts')
    .pipe(tslint({
      configuration: 'tslint.json',
      formatter: 'verbose',
    }))
    .pipe(tslint.report())
}));
gulp.task('test', gulp.series('build',() =>
  gulp.src('test/unit/**/*_test.js', {read: false})
      .pipe(mocha({
        ui: 'tdd',
        reporter: 'spec',
      }))
));
gulp.task('depcheck', function(){
  depcheck(__dirname, {
      // "@types/*" dependencies are type declarations that are automatically
      // loaded by TypeScript during build. depcheck can't detect this
      // so we ignore them here.
      ignoreMatches: ['@types/*', 'vinyl']
    })
    .then((result) => {
      let invalidFiles = Object.keys(result.invalidFiles) || [];
      let invalidJsFiles = invalidFiles.filter((f) => f.endsWith('.js'));
      if (invalidJsFiles.length > 0) {
        throw new Error(`Invalid files: ${invalidJsFiles}`);
      }
      if (result.dependencies.length) {
        throw new Error(`Unused dependencies: ${result.dependencies}`);
      }
  })
});
gulp.task('default',build);