/* global describe, it */
'use strict';
import {expect} from 'chai';
import funcGetParams from '../lib/';

describe('func-get-params', () => {
  it(`should throw an Error when opts.language isn't 'js', 'coffee', or 'ts'`, () => {
    function testFunction() {
      funcGetParams('fileContents', 'function', {language: 'english'});
    }

    expect(testFunction).to.throw(Error, /Expected opts.language to be 'js', 'coffee', or 'ts'/);
  });

  it(`should throw a TypeError when contents isn't a string`, () => {
    function testFunction() {
      funcGetParams();
    }

    expect(testFunction).to.throw(TypeError, /Expected contents to be a string/);
  });

  it('should throw an Error when contents is an empty string', () => {
    function testFunction() {
      funcGetParams('');
    }

    expect(testFunction).to.throw(Error, /Expected contents to be non-empty string/);
  });

  it(`should throw a TypeError when functionName isn't a string`, () => {
    function testFunction() {
      funcGetParams('fileContents');
    }

    expect(testFunction).to.throw(TypeError, /Expected functionName to be a string/);
  });

  it('should throw an Error when functionName is an empty string', () => {
    function testFunction() {
      funcGetParams('fileContents', '');
    }

    expect(testFunction).to.throw(Error, /Expected functionName to be non-empty string/);
  });

  it('should throw an Error when functionName has whitespace', () => {
    function testFunctionSpace() {
      funcGetParams('fileContents', ' ');
    }

    function testFunctionTab() {
      funcGetParams('fileContents', '  ');
    }

    function testFunctionNewline() {
      funcGetParams('fileContents', '\n');
    }

    expect(testFunctionSpace).to.throw(Error, /Expected functionName to not contain whitespace/);
    expect(testFunctionTab).to.throw(Error, /Expected functionName to not contain whitespace/);
    expect(testFunctionNewline).to.throw(Error, /Expected functionName to not contain whitespace/);
  });

  it(`should throw an error when functionName isn't in fileContents`, () => {
    function testFunction1() {
      funcGetParams('fileContents', 'functionName');
    }

    function testFunction2() {
      funcGetParams('fileContents', 'funcName');
    }

    expect(testFunction1).to.throw(Error, /Expected function functionName to be in fileContents/);
    expect(testFunction2).to.throw(Error, /Expected function funcName to be in fileContents/);
  });

  describe('JavaScript', () => {
    it('should return 0 params', () => {
      let fileContents = 'function config() {}';
      expect(funcGetParams(fileContents, 'config')).to.eql([]);
    });

    it('should return 1 param', () => {
      let fileContents = 'function config(x) {}';
      expect(funcGetParams(fileContents, 'config')).to.eql(['x']);
    });

    it('should return 2 params', () => {
      let fileContents = 'function config(x, y) {}';
      expect(funcGetParams(fileContents, 'config')).to.eql(['x', 'y']);
    });

    it('should find params from custom regex', () => {
      let fileContents = 'var config = function (x, y) {}'
        , regex = 'var config = function \\(([\\s\\S]*?)\\) {}';

      expect(funcGetParams(fileContents, 'config', {regex})).to.eql(['x', 'y']);
    });
  });

  describe('CoffeeScript', () => {
    it('should return 0 params from missing () function', () => {
      let fileContents = 'config = ->';
      expect(funcGetParams(fileContents, 'config', {language: 'coffee'})).to.eql([]);
    });

    it('should return 0 params from empty () function', () => {
      let fileContents = 'config = () ->';
      expect(funcGetParams(fileContents, 'config', {language: 'coffee'})).to.eql([]);
    });

    it('should return 1 param', () => {
      let fileContents = 'config = (x) ->';
      expect(funcGetParams(fileContents, 'config', {language: 'coffee'})).to.eql(['x']);
    });

    it('should return 1 param', () => {
      let fileContents = 'config = (x, y) ->';
      expect(funcGetParams(fileContents, 'config', {language: 'coffee'})).to.eql(['x', 'y']);
    });
  });

  describe('TypeScipt', () => {
    it('should return 0 params', () => {
      let fileContents = 'function config() {}';
      expect(funcGetParams(fileContents, 'config', {language: 'ts'})).to.eql([]);
    });

    it('should return 1 param', () => {
      let fileContents = 'function config(x) {}';
      expect(funcGetParams(fileContents, 'config', {language: 'ts'})).to.eql(['x']);
    });

    it('should return 1 param with type', () => {
      let fileContents = 'function config(x: int) {}';
      expect(funcGetParams(fileContents, 'config', {language: 'ts', type: true})).to.eql([{param: 'x', type: 'int'}]);
    });
  });
});
