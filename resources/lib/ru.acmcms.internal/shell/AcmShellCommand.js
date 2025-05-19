const vfs = require("ae3/vfs");

const ServerManager = require('java.class/ru.myx.ae1.handle.Handle');


/**
 * FIXME: UNFINISHED, need to nest new shell but under specified server's context
 */


var commands = {
	domains : function(){
		const result = ServerManager.knownDomainNames();
		console.sendMessage(Format.jsDescribe(result));
		return true;
	},
	servers : function(){
		const result = ServerManager.knownServerNames();
		console.sendMessage(Format.jsDescribe(result));
		return true;
	},
	shell : function(args) {
		if (!args.length) {
			return console.fail("'domainId/fqdn' argument is required");
		}
		var domainId = args.shift();
		var server = ServerManager.getServer(domainId);
		if (!server) {
			return console.fail("server is unknown, 'domainId/fqdn' argument is: " + domainId);
		}
		if (!args.length) {
			return console.fail("'expression' argument is required");
		}
		
		var Shell = require('ae3.util/Shell');
		Shell.exec();
		var expression = args.shift(); // args.join(' ');
		var implementation = 'new Function("return (' + Format.jsString(expression) + ') )';
		function f(){
			(new Function("server", "return " + expression + ";"))(server);
		}
		var result = server.getRootContext().javaCallV(null, "serverCalc", f, false);
		console.sendMessage(Format.jsDescribe(result));
		return true;
	},
	calc : function(args) {
		if (!args.length) {
			return console.fail("'domainId/fqdn' argument is required");
		}
		var domainId = args.shift();
		var server = ServerManager.getServer(domainId);
		if (!server) {
			return console.fail("server is unknown, 'domainId/fqdn' argument is: " + domainId);
		}
		if (!args.length) {
			return console.fail("'expression' argument is required");
		}
		var expression = args.shift(); // args.join(' ');
		var implementation = 'new Function("return ("' + Format.jsString(expression) + '")" )';
		function f(){
			(new Function("server", "return " + expression + ";"))(server);
		}
		var result = server.getRootContext().javaCallV(null, "serverCalc", f, false);
		console.sendMessage(Format.jsDescribe(result));
		return true;
	},
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
		console.sendMessage("acm command syntax:\r\n"
				+ "\tacm domains\r\n"
				+ "\tacm servers\r\n"
				+ "\tacm shell <domainId/fqdn>\r\n"
				+ "\tacm calc <domainId/fqdn>\r\n"
				+ "");
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
};

exports.description = "'acmcms' management tool";
