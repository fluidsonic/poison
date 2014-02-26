'use strict';

var test = require('tap').test;


test('module loading internals changed', function(t) {
	t.plan(5);

	var Module = require('module');
	var originalRequire = Module.prototype.require;

	Module._hiddenTestLoad = Module._load;
	delete Module._load;

	Module.prototype.require = function(path) {
		return Module._hiddenTestLoad(path, this);
	};

	t.doesNotThrow(require.bind(require, '../lib'), 'does not explode when loading library');

	var poison = require('../lib');
	t.doesNotThrow(poison.addHook.bind(poison, '.'), 'addHook() is a dummy');
	t.doesNotThrow(poison.getModulesByName.bind(poison), 'getModulesByName() is a dummy');
	t.deepEqual(poison.getModulesByName(), [], 'getModulesByName() returns an empty array');
	t.doesNotThrow(poison.removeHook.bind(poison, '.'), 'removeHook() is a dummy');

	Module.load = Module._hiddenTestLoad;
	delete Module._hiddenTestLoad;

	Module.prototype.require = originalRequire;
});
