poison
======

Allows tinkering with node's module loading system if you really see no other way.

You can intercept `require` calls to named modules and alter it's exports, e.g. to facade `require('debug')` with your own logging facility.

[![Build Status](https://travis-ci.org/fluidsonic/poison.png?branch=master)](https://travis-ci.org/fluidsonic/poison)



Quickstart
----------

```javascript
var poison = require('poison');

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
```



Usage
-----

### addHook(moduleName, hook(moduleName, mod))

Adds a hook function which will be called when a new module with the given name was loaded.

Does **not** work for native node.js modules, e.g. `console` and `util`.

#### Parameters

- `moduleName` - The name of the module to intercept, e.g. `debug` (as passed to `require()`). Paths are not supported.

- `hook(moduleName, mod)` - Function called after a new module matching `moduleName` was loaded.

	- `moduleName` - The name of the hooked module will be passed again so you can use the same hook function for different names.

	- `mod` - The module's `module` object. Feel free to change its `exports` property.


### getModulesByName(moduleName)

Returns an array of all modules which were loaded with the given module name.

Does work for native modules, but you should `require()` them first to make sure they are loaded.

#### Parameters

- `moduleName` - The name of the module to intercept, e.g. `debug` (as passed to `require()`). Paths are not supported.


### removeHook(moduleName, hook)

Removes a hook previously added using `addHook(moduleName, hook)`.

#### Parameters

- `moduleName` - Same module name as passed to `addHook(moduleName, hook)`.

- `hook` - Same function as passed to `addHook(moduleName, hook)`.



Warning
-------

**If you create a project which intercepts foreign modules you should always feature-test these modules first.** Different modules (e.g. private ones) may share the same name. Different versions of the same module may also be loaded.

poison uses node.js internals to intercept module loading which may change with any new release and thus break this library. poison is designed to feature-test these internals and if they change in an unexpected way then all of its methods become no-ops and it will issue a warning on the console.



Limitations
-----------

You can only intercept modules which

- are loaded by name instead of by path (i.e. `debug` but not `./debug`) and
- were loaded **after** the poison module (except native node.js modules like `console` and `util`).

If poison was loaded multiple times, `getModulesByName()` returns all modules loaded after the *first* posion module was loaded.

You should call `require('poison')` as early as possible in your project or you may miss some modules.



Installation
------------

	$ npm install poison



Testing
-------

	$ npm install
	$ npm test



License
-------

MIT
