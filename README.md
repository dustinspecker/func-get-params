# func-get-params
[![NPM version](https://badge.fury.io/js/func-get-params.svg)](https://badge.fury.io/js/func-get-params) [![Build Status](https://travis-ci.org/dustinspecker/func-get-params.svg)](https://travis-ci.org/dustinspecker/func-get-params) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/func-get-params.svg)](https://coveralls.io/r/dustinspecker/func-get-params?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/func-get-params/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/func-get-params) [![Dependencies](https://david-dm.org/dustinspecker/func-get-params.svg)](https://david-dm.org/dustinspecker/func-get-params/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/func-get-params/dev-status.svg)](https://david-dm.org/dustinspecker/func-get-params/#info=devDependencies&view=table)

> Retrieve function's parameters in file

## Install
```
npm install --save func-get-params
```

## Usage
### ES2015
```javascript
import fs from 'fs';
import funcGetParams from 'func-get-params';

let coffeeFile, jsFile, tsFile;

// contents of awesome-js-file.js
/**
 * function test(param) {}
 */
jsFile = fs.readFileSync('awesome-js-file.js');

funcGetParams(jsFile, 'test');
// => ['param']


// contents of awesome-coffee-file.coffee
/**
 * test = (param) -> {}
 */
coffeeFile = fs.readFileSync('awesome-coffee-file.coffee');

funcGetParams(coffeeFile, 'test', {language: 'coffee'});
// => ['param']


// contents of awesome-ts-file.ts
/**
 * function test (param: string): string {}
 */
tsFile = fs.readFileSync('awesome-ts-file.ts');

funcGetParams(tsFile, 'test', {language: 'ts'});
// => ['param']

funcGetParams(tsFile, 'test', {language: 'ts', type: true});
// => [{param: 'param', type: 'string'}]
```

### ES5
```javascript
var fs = require('fs')
  , funcGetParams = require('func-get-params')
  , coffeeFile, jsFile, tsFile;

// contents of awesome-js-file.js
/**
 * function test(param) {}
 */
jsFile = fs.readFileSync('awesome-js-file.js');

funcGetParams(jsFile, 'test');
// => ['param']


// contents of awesome-coffee-file.coffee
/**
 * test = (param) -> {}
 */
coffeeFile = fs.readFileSync('awesome-coffee-file.coffee');

funcGetParams(coffeeFile, 'test', {language: 'coffee'});
// => ['param']


// contents of awesome-ts-file.ts
/**
 * function test (param: string): string {}
 */
tsFile = fs.readFileSync('awesome-ts-file.ts');

funcGetParams(tsFile, 'test', {language: 'ts'});
// => ['param']

funcGetParams(tsFile, 'test', {language: 'ts', type: true});
// => [{param: 'param', type: 'string'}]
```

## Options
### language
A string with the language of the file being inspected. Default option is `js` for JavaScript. Other possible options are `coffee` for CoffeeScript and `ts` for TypeScript.

### regex
Custom regex to use. Must include a group.

### type
Only used when using language option with `ts` value. A boolean for whether or not parameter types should be returned. Default value is `false` to not return types. When `false` output will look like `['param1', 'param2']`. When `true` output will look like `[{param: 'param1', type: 'string'}, {param: 'param2', type: int}]`.

## LICENSE
MIT