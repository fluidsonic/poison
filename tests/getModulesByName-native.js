'use strict';

var poison = require('../lib');
var test = require('tap').test;

var nativeModuleNames = [
	'assert',
	'buffer',
	'child_process',
	'cluster',
	'console',
	'constants',
	'crypto',
	'dgram',
	'dns',
	'domain',
	'events',
	'freelist',
	'fs',
	'http',
	'https',
	'module',
	'net',
	'os',
	'path',
	'punycode',
	'querystring',
	'readline',
	'repl',
	'smalloc',
	'stream',
	'string_decoder',
	'sys',
	'timers',
	'tls',
	'tty',
	'url',
	'util',
	'vm',
	'zlib'
];


test('getModulesByName() works for all public native modules', function(t) {
	t.plan(nativeModuleNames.length);

	nativeModuleNames.forEach(function(moduleName) {
		require(moduleName);

		var modules = poison.getModulesByName(moduleName);
		t.equal(modules.length, 1, 'returns one module for "' + moduleName + '"');
	});
});
