'use strict';

var poison = require('../lib');
var test = require('tap').test;


test('addHook() works for multiple distinct modules with the same name', function(t) {
	t.plan(2);

	var initialModuleCount = poison.getModulesByName('debug').length;

	var hookCallCount = 0;
	poison.addHook('debug', function debugHook() {
		++hookCallCount;
	});

	require('debug');
	require('express');  // we just need another module which depends on a version of 'debug' different from ours

	var finalModuleCount = poison.getModulesByName('debug').length;
	var loadedModuleCount = finalModuleCount - initialModuleCount;

	t.ok(hookCallCount >= 2, 'hook was called at least twice (' + hookCallCount + ' times)');
	t.equal(hookCallCount, loadedModuleCount, 'hook was called once for each newly loaded module (' + hookCallCount + ' of ' + loadedModuleCount + ' times)');
});
