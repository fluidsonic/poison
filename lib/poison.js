'use strict';

var assert = require('assert');


module.exports = function exports(Module, NativeModule) {
	var _hooks = {};

	hijackModuleLoader();

	return {
		addHook: function addHook(moduleName, hook) {
			assert(isNamedModuleId(moduleName), 'Only named modules can be hooked, not paths: ' + moduleName);
			assert(typeof hook === 'function', 'A function must be passed as hook.');

			this.removeHook(moduleName, hook);

			var hooks = (_hooks[moduleName] || (_hooks[moduleName] = []));
			hooks.push(hook);
		},

		getModulesByName: function getModulesByName(moduleName) {
			assert(isNamedModuleId(moduleName), 'Only named modules can be hooked, not paths: ' + moduleName);

			var modules = [];

			Object.keys(Module._cache).forEach(function(modulePath) {
				var mod = Module._cache[modulePath];
				if (mod.request === moduleName) {
					modules.push(mod);
				}
			});

			if (NativeModule && NativeModule._cache[moduleName]) {
				modules.push(NativeModule._cache[moduleName]);
			}

			return modules;
		},

		removeHook: function removeHook(moduleName, hook) {
			assert(isNamedModuleId(moduleName), 'Only named modules can be hooked, not paths: ' + moduleName);

			var hooks = _hooks[moduleName];
			if (!hooks) {
				return;
			}

			var index = hooks.indexOf(hook);
			if (index < 0) {
				return;
			}

			if (hooks.length === 1) {
				delete _hooks[moduleName];
				return;
			}

			hooks.splice(index, 1);
		}
	};



	function hijackModuleLoader() {
		var originalLoad = Module._load;
		var originalPrototypeLoad = Module.prototype.load;
		var requestStack = [];

		Module._load = function poisoned_Module__load(request) {
			requestStack.push(request);
			try {
				return originalLoad.apply(this, arguments);
			}
			finally {
				requestStack.pop();
			}
		};

		Module.prototype.load = function poisoned_Module_prototype_load() {
			var mod = this;

			var request = requestStack[requestStack.length - 1];
			mod.request = request;

			originalPrototypeLoad.apply(mod, arguments);

			if (!isNamedModuleId(request)) {
				return;
			}

			var hooks = _hooks[request];
			if (!hooks) {
				return;
			}

			hooks.forEach(function(hook) {
				hook(request, mod);
			});
		};
	}


	function isNamedModuleId(moduleId) {
		return (typeof moduleId === 'string' && !moduleId.match(/^\.|^[a-zA-Z]:|[/\\]/));
	}
};
