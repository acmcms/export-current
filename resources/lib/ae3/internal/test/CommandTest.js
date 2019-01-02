var vfs = require("ae3/vfs");

var Settings = require("ae3.util/Settings");

const getSettings = Settings.SettingsBuilder.builderCachedLazy()//
	.setInputFolderPath("settings/tests")//
	.setDescriptorReducer(function(settings, description){
		if (description.type != "ae3.Test") {
			return settings;
		}
		/**
		 * 'order of appearance'
		 */
		var name = description.name;
		var file = description.file;
		var java = description.java;
		/**
		 * 
		 */
		/**
		 * actually name is mandatory
		 */
		if (name) {
			var test = settings[name] || (settings[name] = {
				name : name
			});
			test.file = file;
			test.java = java;
			test.fn = file 
				? function testJsFile(){
					var source = vfs.UNION.relativeBinary(file);
					if(!source){
						throw new Error("Not found or not a file: " + file);
					}
					var fn = new Function(source.toStringUtf8());
					fn.call(this);
				} 
				: java
					? function testJava(){
						var Class = require('java.class/' + java);
						Class.main(null);
					} 
					: function testError(){
						throw new Error("Invalid test description!");
					};
		}
		return settings;
	})//
	.buildGetter()
;

/**
 * 'test' shell command-line interface
 */

var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "test command syntax:\r\n";
			for(var k in commands){
				s += "\t test " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	list : {
		args : "",
		help : "lists tests",
		run : function list(args) {
			var settings = getSettings();
			for each(var test in settings){
				console.sendMessage("\t'test run " + test.name + "'");
			}
			return true;
		}
	},
	run : {
		args : "<testId> [... <testId>]",
		help : "runs a test",
		run : function run(args) {
			var testId = args[0];
			if(!testId){
				return console.fail("Check arguments!");
			}
			for(var i = 0;;){
				var settings = getSettings();
				var test = settings[testId];
				if(!test){
					return console.fail("Test not found: " + testId);
				}
				test.fn();
				if(++i < args.length){
					testId = args[i];
					continue;
				}
				return true;
			}
		}
	},
};

/**
 * console command
 * 
 * @returns {Boolean}
 */
exports.run = function run() {
	var args = arguments;
	if (args.length < 2) {
		commands.help.run(args);
		return false;
	}
	
	args = Array.prototype.slice.call(args);
	/* var selfName = */ args.shift();

	{
		var commandName = args.shift();
		var command = commands[commandName];
		if (!command) {
			return console.fail("unsupported command: %s", commandName);
		}

		return command.run(args);
	}
};

exports.description = "ae3 testing tool";
