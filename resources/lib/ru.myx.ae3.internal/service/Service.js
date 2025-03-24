var ae3 = require('ae3');
var vfs = ae3.vfs;

var Settings = ae3.Util.Settings;

var started = {};
var starting = {};
var stopping = {};
var state = {};

const getSettings = Settings.SettingsBuilder.builderCachedLazy()//
	.setInputFolderPath("settings/service")//
	.setDescriptorReducer(function(settings, description){
		if (description.type != "ae3.Service") {
			return settings;
		}
		/**
		 * 'order of appearance'
		 */
		var name = description.name;
		var requires = description.requires;
		var reference = description.reference;
		var augments = description.augments;
		/**
		 * 
		 */
		/**
		 * actually name is mandatory
		 */
		if (name) {
			var service = settings[name] || (settings[name] = {
				name : name
			});
			service.reference = reference;
			service.requires = requires
				? Array(requires)
				: [];
		}
		if (augments) {
			Array(augments).forEach(function(serviceName) {
				var service = settings[serviceName] || (settings[serviceName] = {
					name : serviceName
				});
				(service.augmentedBy || (service.augmentedBy = {}))[name] = true;
			});
		}
		return settings;
	})//
	.buildGetter()
;

function startService(name, startedList) {
	if (started[name]) {
		return console.fail("already started: %s!", name);
	}
	if (starting[name]) {
		return console.fail("already starting: %s!", name);
	}
	console.sendMessage("starting: %s... ", name);
	var settings = getSettings();
	var description = settings[name];
	if (!description) {
		return console.fail("error starting '%s': Not found!", name);
	}

	var startedLocalList = startedList || [];

	try {
		/**
		 * to prevent recursive dependencies from crashing the system
		 */
		starting[name] = true;
		/**
		 * 
		 */
		state[name] = "starting";
		var requires = description.requires;
		if (requires) {
			(!Array.isArray(requires) && (requires = [ requires ]) || requires)
					.forEach(function(n) {
						if (!started[n] && !starting[n]) {
							if (!startService(n, startedLocalList)) {
								throw "Failed to start required service: " + n;
							}
						}
					});
		}

		var reference = description.reference;
		if (reference) {
			console.log("ae3.service: starting service, type: require, reference: %s", reference);
			var service = require(reference);
			service.start();
		}
		started[name] = true;
		state[name] = "started";
		startedLocalList.push(name);
	} finally {
		/**
		 * clean-up.
		 */
		delete starting[name];
		/**
		 * 
		 */
	}

	if (!startedList) {
		startedLocalList.forEach(function(name) {
			var description = settings[name];
			var augmentedBy = description.augmentedBy;
			augmentedBy && Object.keys(augmentedBy).forEach(function(n) {
				if (!started[n] && !starting[n]) {
					if (!startService(n, startedList)) {
						throw "Failed to start augment service: " + n;
					}
				}
			});
		});
	}
	console.sendMessage("started: %s", name);
	return true;
}

function stopService(name) {
	if (!started[name]) {
		return console.fail("haven't been started: %s!", name);
	}
	if (stopping[name]) {
		return console.sendMessage("already stopping: %s!", name);
	}

	console.sendMessage("stopping: %s... ", name);

	var settings = getSettings();
	var description = settings[name];
	if (!description) {
		return console.fail("Not found!");
	}
	try {
		/**
		 * to prevent recursive dependencies from crashing the system
		 */
		stopping[name] = true;
		/**
		 * 
		 */
		state[name] = "stopping";
		var requiredBy = description.requiredBy;
		requiredBy && Object.keys(requiredBy).forEach(function(n) {
			if (started[n] && !stopping[n]) {
				if (!stopService(n)) {
					throw "Failed to start dependant service: " + n;
				}
			}
		});
		var reference = description.reference;
		if (reference) {
			console.log("ae3.service: stopping service, type: require, reference: %s", reference);
			var service = require(reference);
			service.stop?.();
		}
		delete started[name];
		state[name] = "stopped";
	} finally {
		/**
		 * clean-up.
		 */
		delete stopping[name];
		/**
		 * 
		 */
	}
	console.sendMessage("stopped.");
	return true;
}

function printDescriptionServiceLine(initial, description) {
	if (description && description.name) {
		var key = description.name;
		console.sendMessage(key + "\t" + (state[key] || "untouched"));
	}
	return initial;
}

/**
 * settings passed as 'this' value.
 * 
 * @param name
 * @returns
 */
function mapNameToDescription(name) {
	return this[name];
}

/**
 * console should be this
 */
exports.stopService = stopService;

/**
 * console should be this
 */
exports.startService = startService;

var commands = {
	start : function start(args) {
		args.forEach(startService);
		return true;
	},
	stop : function stop(args) {
		args.forEach(stopService);
		return true;
	},
	settings : function settings(args) {
		if (args.length) {
			return console.fail("extra parameters to the command!");
		}
		var settings = getSettings();
		console.sendMessage(Format.jsObjectReadable(settings));
		return true;
	},
	active : function active(args) {
		if (args.length) {
			return console.fail("extra parameters to the command!");
		}
		var settings = getSettings();
		Object
			.keys(started)
			.map(mapNameToDescription, settings)
			.reduce(printDescriptionServiceLine, settings);
		return true;
	},
	list : function list(args) {
		if (args.length) {
			return console.fail("extra parameters to the command!");
		}
		var settings = getSettings();
		Object
			.keys(settings)
			.map(mapNameToDescription, settings)
			.reduce(printDescriptionServiceLine, settings);
		return true;
	}
};

/**
 * console command
 * 
 * @param console
 * @param args
 * @returns {Boolean}
 */
exports.run = function run() {
	if (arguments.length < 2) {
		console.sendMessage("service command syntax:\r\n"
				+ "\tservice list\r\n" + "\tservice active\r\n"
				+ "\tservice start <service_name>\r\n"
				+ "\tservice stop <service_name>\r\n" + "");
		return false;
	}
	// clone/create as a normal array
	var argv = Array.from(arguments);
	/* var selfName = */argv.shift();
	var commandName = argv.shift();
	var command = commands[commandName];
	if (!command) {
		return console.fail("unsupported command: " + commandName);
	}

	return command.call(commands, argv);
	// return command.apply(null, argv);
};

exports.description = "Service management tool";

exports.start = function(serviceName) {
	return startService(serviceName);
};