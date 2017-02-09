# Polymer Redefined In Mobile Environment

## Prime-CLI

[![Build Status](https://travis-ci.org/Polymer/polymer-cli.svg?branch=master)](https://travis-ci.org/Polymer/polymer-cli)
[![Build status](https://ci.appveyor.com/api/projects/status/3xc7rkapu39rw9fs/branch/master?svg=true)](https://ci.appveyor.com/project/justinfagnani/polymer-cli/branch/master)

A command-line tool for Prime projects.

This project is intended to make it easier building cordova project with polymer.

This project is still in alpha so don't expect too much, but most of basic commands is working because it's based on polymer-cli.

## Overview

Prime-CLI includes a number of tools for working with Polymer,Web Components and Cordova:

  * __init__ - Initializes a Prime project from one of several templates
  * __build__	- Builds an application-style project
  * __lint__ - Lints the project
  * __serve__	- Runs a development server
  * __test__ - Runs tests with web-component-tester
  * __platforms__ - Add or remove specific platform
  * __plugin__ - Add or remove cordova plugin

## Installation

Install via npm:

    $ npm install -g prime-cli

Then run via `prime <command>`:

    $ prime help

## Project Structure

Polymer-CLI is somewhat opinionated about project structure.

There are two type of projects:

* Plugin projects
TODO: write this when plugin environment is implemented.

* Application projects

  Application projects are self-contained and intended to be deployed as a standalone application. Application projects contain elements in a `src/` folder and import their dependencies with absolute paths, or relative paths that reference folders inside the project folder.

### Application Styles

Prime-CLI currently supports two styles of applications:

  * Monolithic applications, which have a single entrypoint (usually index.html) and eagerly import all dependencies.

  * "App shell" applications, which have a very lightweight entrypoint, an app-shell with startup and routing logic, and possibly lazy loaded fragments.

### App-shell Structure

App-shell apps are currently the preferred style for Polymer CLI, and most commands are being optimized to support them. App-shell apps usually have client-side routing (see the [app-route](https://github.com/PolymerElements/app-route) element), and lazy load parts of the UI on demand.

Prime-CLI supports this style by understand these different types of files:

  * entrypoint - The first file served by the web server for every valid route (usually index.html). This file should be very small, since it may not cache well and must reference resources with absolute URLs, due to being served from many URLs.
  * shell - The actual app shell, which includes the top-level logic, routing, and so on.
  * fragments - lazy loaded parts of the application, typically views and other elements loaded on-demand.

## Configuration

The project files are specified either as global flags: `--entrypoint`, `--shell` and zero or more `--fragment` flags, or in a `prime.json` configuration file.

### prime.json

You can specify the project files in `prime.json` so that commands like `prime build` work without flags:

```json
{
  "rootDir": "src",
  "outDir": "www",
  "entrypoint": "index.html",
  "shell": "src/my-app/my-app.html",
  "fragments": [
    "src/app-home/app-home.html",
    "src/app-view-1/app-view-1.html",
  ],
  "sources": [
    "src/**/*",
    "images/**/*",
    "bower.json"
  ],
  "includeDependencies": [
    "bower_components/additional-files-to-include-in-build/**/*",
    "bower_components/webcomponentsjs/webcomponents-lite.js"
  ],
  "plugins": {
    "cordova-plugin-facebook4":{
      "version":"",
      "variable":{
        "APP_ID":"123456789",
        "APP_NAME":"myApplication"
      }
    },
    "cordova-plugin-console":{
      "version":"1.0.0"
    }
  },
  "platforms": {
    "android":{
      "version":"6.0"
    }
  }
}
```


## Commands

### help

Displays help on commands and options:

    $ prime help

### init

Initializes a Prime project from one of several templates.

Choose a template from a menu:

    $ prime init

Create a new project from the 'element' template:

    $ prime init application



### install

Installs Bower dependencies, optionally installing multiple variants.

    $ prime install

This performs a Bower install of dependencies listed in `bower.json`, and is
equivalent to `bower install`.

    $ prime install --variants

This performs a Bower install, and also installs any dependency variants
specified in the `"variants"` property of `bower.json`.

### lint

With a `prime.json` file:

    $ prime lint

Specifying a file to lint:

    $ prime lint index.html

### test

Run test with web-component-tester:

    $ prime test

### build

Specify project files as flags:

    $ prime build --entrypoint index.html --shell src/my-app/my-app.html

Use `index.html` as the entrypoint, or read from `prime.json`:

    $ prime build

`build` is opinionated and defaults to a good build for app-shell apps. It writes the built output to `build/bundled` and `build/unbundled` folders. Both outputs have been run though HTML, JS and CSS optimizers, and have a Service Worker generated for them. The bundled folder contains the application files process by Vulcanize, Polymer's HTML bundler, for optimal loading via HTTP/1. The unbundled folder is optimized for HTTP/2 + Push.

While the build command should support most projects, some users will need greater control over their build pipeline. If that's you, check out the [prime-build](https://github.com/muhammadsayuti/prime-build) library. Prime-build can be called and customized programmatically, giving you much greater control than the CLI can provide. 


### serve

Start the development server:

    $ prime serve

Start the development server, and open the default browser:

    $ prime serve -o

By default the server listens to `localhost`. To listen to a different address use the `--hostname` flag. For example:

    $ prime serve -o --hostname 0.0.0.0


### platforms

Add platform into project:

    $ prime platforms add android

Remove platforms from project:

    $ prime platforms remove android


### plugin

Install cordova plugin:

    $ prime plugin add cordova-plugin-name

Install cordova plugin with variable:

    $ prime plugin add cordova-plugin-name --variable VARIABLE_NAME=value

Install multiple plugins:

    $ prime plugin add cordova-plugin-name-1 cordova-plugin-name-2


## Templates and Generators

Prime-CLI initializes new projects with the `init` command, and includes
a few built-in templates.

New templates can be distributed and installed via npm. Yeoman generators
prefixed with `generator-prime-init` will show up in the `prime init`
menu.

## Compiling from Source

    $ npm run build

You can compile and run the CLI from source by cloning the repo from Github and then running `npm run build`. But make sure you have already run `npm install` before building.

## Supported node.js versions

Prime CLI targets the current LTS version (4.x) of Node.js and later.
