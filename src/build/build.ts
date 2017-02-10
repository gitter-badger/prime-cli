
import * as path from 'path';
import * as logging from 'plylog';
import {dest} from 'vinyl-fs';
import mergeStream = require('merge-stream');
import {PrimeProject, addServiceWorker, SWConfig} from 'prime-build';

import {OptimizeOptions, getOptimizeStreams} from './optimize-streams';
import {ProjectConfig, ProjectBuildOptions} from 'prime-project-config';
import {PrefetchTransform} from './prefetch';
import {waitFor, pipeStreams} from './streams';
import {loadServiceWorkerConfig} from './load-config';
const logger = logging.getLogger('cli.build.build');
export const mainBuildDirectoryName = 'build';

/**
 * Generate a single build based on the given `options` ProjectBuildOptions.
 * Note that this function is only concerned with that single build, and does
 * not care about the collection of builds defined on the config.
 *
 * TODO(fks) 01-26-2017: Generate multiple builds with a single primeProject
 * instance. Currently blocked because splitHtml() & rejoinHtml() cannot be run
 * on multiple streams in parallel. See:
 * https://github.com/Polymer/polymer-build/issues/113
 */
export async function build(
    options: ProjectBuildOptions, config: ProjectConfig): Promise<void> {
  const buildName = options.name || 'default';
    const optimizeOptions:
        OptimizeOptions = {css: options.css, js: options.js, html: options.html};
    const buildDirectory = config.outDir;
    // change current directory to rootDir to
    // make sure we don't copy the parent folder to outDir
    // when the user use another folder as rootDir
    if (config.rootDir) process.chdir(config.rootDir);
    const project = new PrimeProject(config);

    // If no name is provided, write directly to the build/ directory.
    // If a build name is provided, write to that subdirectory.
    logger.debug(`"${buildDirectory}": Building with options:`, options);
    const sourcesStream = pipeStreams([
      project.sources(),
      project.splitHtml(),
      getOptimizeStreams(optimizeOptions),
      project.rejoinHtml()
    ]);

    const depsStream = pipeStreams([
      project.dependencies(),
      project.splitHtml(),
      getOptimizeStreams(optimizeOptions),
      project.rejoinHtml()
    ]);

    let buildStream: NodeJS.ReadableStream = mergeStream(sourcesStream, depsStream);
    if (options.bundle) {
      buildStream = buildStream.pipe(project.bundler);
    }

    if (options.insertPrefetchLinks) {
      buildStream = buildStream.pipe(new PrefetchTransform(project));
    }

    buildStream.once('data', () => {
      let name = options.name || 'default';
      logger.info(`(${name}) Building...`);
    });

    // Finish the build stream by piping it into the final build directory.
    buildStream = buildStream.pipe(dest(buildDirectory));
    
    // If a service worker was requested, parse the service worker config file
    // while the build is in progress. Loading the config file during the build
    // saves the user ~300ms vs. loading it afterwards.
    const swPrecacheConfigPath = path.join(
        config.rootDir, options.swPrecacheConfig || 'sw-precache-config.js');
    let swConfig: SWConfig|null = null;
    logger.info('swPrecacheConfigPath', swPrecacheConfigPath);

    if (options.addServiceWorker) {
      swConfig = await loadServiceWorkerConfig(swPrecacheConfigPath);
    }

    // There is nothing left to do, so wait for the build stream to complete.
    await waitFor(buildStream);

    // addServiceWorker() reads from the file system, so we need to wait for
    // the build stream to finish writing to disk before calling it.
    if (options.addServiceWorker) {
      logger.debug(`Generating service worker...`);
      if (swConfig) {
        logger.debug(`Service worker config found`, swConfig);
      } else {
        logger.debug(
              `No service worker configuration found at ` +
              `${swPrecacheConfigPath}, continuing with defaults`);
      }
      addServiceWorker({
        buildRoot: buildDirectory,
        project: project,
        swPrecacheConfig: swConfig || undefined,
        bundled: options.bundle,
      });
    }
    logger.info(`(${buildName}) Build complete!`);
}