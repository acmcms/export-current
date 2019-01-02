
var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "http command syntax:\r\n";
			for(var k in commands){
				s += "\t http " + k + " " + commands[k].args + "\n\t\t\t " + commands[k].help + "\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	check : {
		args : "<url>",
		help : "Check resource using HTTP protocol (silent GET).",
		run : function(args) {
			var url = args.shift();
			if(!url){
				console.error("'url' argument is required!");
				return false;
			}
			var HTTP = require('http');
			var result = HTTP.get.asBinary(url).length();
			console.log("Received: %s (%s bytes) payload", Format.bytesRound(result), result);
			return true;
		}
	},
	get : {
		args : "<url>",
		help : "Get resource using HTTP protocol.",
		run : function(args) {
			var url = args.shift();
			if(!url){
				console.error("'url' argument is required!");
				return false;
			}
			var HTTP = require('http');
			console.sendMessage(HTTP.get.asString(url));
			return true;
		}
	},
	head : {
		args : "<url>",
		help : "Get reply meta-data.",
		run : function(args) {
			var url = args.shift();
			if(!url){
				console.error("'url' argument is required!");
				return false;
			}
			var HTTP = require('http');
			console.sendMessage(Format.jsDescribe(HTTP.get(url).baseValue()));
			return true;
		}
	},
	status : {
		args : "",
		help : "show HTTP status (current state and statistics)",
		run : function runShow(args) {
			var Shell = require('ae3.util/Shell');
			return Shell.executeNativeInline(["cat", "/status/http/status.txt"]);

			/**
			var StatusRegistry = require('java.class/ru.myx.ae3.status.StatusRegistry');
			var rootRegistry = StatusRegistry.ROOT_REGISTRY;
			var http = rootRegistry.statusProviders.http;
			var status = http.status;
			console.sendMessage(status.title + ":\r\n" + Format.jsObjectReadable(status.statusAsMap));
			return true;
			**/
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

exports.description = "http interface command";
