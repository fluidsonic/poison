'use strict';

var poison = require('../lib');
var test = require('tap').test;


test('removeHook() works as documented', function(t) {
	t.plan(1);

	var hookCallCount = 0;

	function debugHook() {
		++hookCallCount;
	}

	poison.addHook('debug', debugHook);
	poison.removeHook('debug', debugHook);

	require('debug');

	t.equal(hookCallCount, 0, 'hook was not called after removal');
});
