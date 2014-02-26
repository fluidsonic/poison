'use strict';

featureTestAndExport();


function digIntoModuleLoading() {
	try {
		var m = require('module');
		if (!m || !m._cache || typeof m._load !== 'function' || !m.prototype || typeof m.prototype.load !== 'function') {
			return null;
		}

		return m;
	}
	catch (e) {
		return null;
	}
}


function digIntoNativeModuleLoading() {
	try {
		var natives = typeof process.binding === 'function' && process.binding('natives');
		if (!natives) {
			return null;
		}

		var nativesContainsNativeModule = natives.hasOwnProperty('native_module');
		if (!nativesContainsNativeModule) {
			natives.native_module = '';
		}

		var n = null;
		try {
			n = require('native_module');
		}
		finally {
			if (!nativesContainsNativeModule) {
				delete natives.native_module;
			}
		}

		if (!n || !n._cache) {
			return null;
		}

		return n;
	}
	catch (e) {
		return null;
	}
}


function featureTestAndExport() {
	var m = digIntoModuleLoading();
	if (m) {
		var n = digIntoNativeModuleLoading();
		if (!n) {
			console.warn('[poison] Access to native module loader not possible.');
		}

		module.exports = require('./poison')(m, n);
	}
	else {
		console.warn('[poison] Access to module loader not possible. Library will do nothing.');

		module.exports = require('./dummy')();
	}
}
