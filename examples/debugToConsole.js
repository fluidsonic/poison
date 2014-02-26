'use strict';

var poison = require('../lib');


// redirect all debug logging library calls directly to console.log
function myCustomDebug(name) {
    return console.log.bind(console, name + ':');
}

// apply redirects to new modules loaded by require('debug')
poison.addHook('debug', function(moduleName, mod) {
    mod.exports = myCustomDebug;
});

// apply redirects to modules which were already loaded
poison.getModulesByName('debug').forEach(function(mod) {
    mod.exports = myCustomDebug;
});


var debug = require('debug')('test');
debug('some output');
// outputs 'test: some output'
