'use strict';

var poison = require('../lib');
var test = require('tap').test;


test('getModulesByName() fails for paths', function(t) {
	t.plan(6);

	t.throws(poison.addHook.bind(poison, './debug'), 'does not accept relative paths (Unix)');
	t.throws(poison.addHook.bind(poison, '.\\debug'), 'does not accept relative paths (Windows)');
	t.throws(poison.addHook.bind(poison, '/debug'), 'does not accept absolute paths (Unix)');
	t.throws(poison.addHook.bind(poison, 'C:\\debug'), 'does not accept absolute paths (Windows)');
	t.throws(poison.addHook.bind(poison, 'debug/debug'), 'does not accept module paths (Unix)');
	t.throws(poison.addHook.bind(poison, 'debug\\debug'), 'does not accept module paths (Windows)');
});


test('getModulesByName() returns loaded modules with correct name', function(t) {
	t.plan(3);

	var initialModules = poison.getModulesByName('debug');
	t.equal(initialModules.length, 0, 'initially there are no modules named "debug" loaded');

	var debug = require('debug');

	var finalModules = poison.getModulesByName('debug');
	t.equal(finalModules.length, 1, 'finally there\'s one module named "debug" loaded');
	t.equal(finalModules[0].exports, debug, 'the returned module is the required one');
});
