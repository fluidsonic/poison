'use strict';

var poison = require('../lib');
var test = require('tap').test;


test('addHook() fails for paths', function(t) {
	t.plan(6);

	t.throws(poison.addHook.bind(poison, './debug'), 'does not accept relative paths (Unix)');
	t.throws(poison.addHook.bind(poison, '.\\debug'), 'does not accept relative paths (Windows)');
	t.throws(poison.addHook.bind(poison, '/debug'), 'does not accept absolute paths (Unix)');
	t.throws(poison.addHook.bind(poison, 'C:\\debug'), 'does not accept absolute paths (Windows)');
	t.throws(poison.addHook.bind(poison, 'debug/debug'), 'does not accept module paths (Unix)');
	t.throws(poison.addHook.bind(poison, 'debug\\debug'), 'does not accept module paths (Windows)');
});


test('addHook() works as documented', function(t) {
	t.plan(3);

	var hookCallCount = 0;
	var passedModuleName;
	var passedMod;

	poison.addHook('debug', function debugHook(moduleName, mod) {
		++hookCallCount;

		passedModuleName = moduleName;
		passedMod = mod;
	});

	var debug = require('debug');

	t.equal(hookCallCount, 1, 'hook was only called once');
	t.equal(passedModuleName, 'debug', 'parameter "moduleName" is correct');
	t.equal(passedMod.exports, debug, 'parameter "mod" is correct');
});
