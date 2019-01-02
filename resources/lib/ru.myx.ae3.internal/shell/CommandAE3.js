var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "ae3 command syntax:\r\n";
			for(var k in commands){
				s += "\t ae3 " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	auth : {
		args : "help",
		help : "manages client authentication information, use 'ae3 auth help' to find out more",
		run : function auth(args) {
			var AE3 = require('ru.myx.ae3.web.iface/AE3');
			return AE3.authConsoleCommand.apply(AE3, ['ae3 auth'].concat(args));
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

exports.description = "AE3 tool";
