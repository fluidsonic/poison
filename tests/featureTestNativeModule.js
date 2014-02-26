'use strict';

var test = require('tap').test;


test('native module loading internals changed', function(t) {
	t.plan(4);

	Object.freeze(process.binding('natives'));

	t.doesNotThrow(require.bind(require, '../lib'), 'does not explode when loading library');

	var poison = require('../lib');
	t.throws(poison.addHook.bind(poison, '.'), 'addHook() is not a dummy');
	t.throws(poison.getModulesByName.bind(poison, '.'), 'getModulesByName() is not a dummy');
	t.throws(poison.removeHook.bind(poison, '.'), 'removeHook() is not a dummy');
});
