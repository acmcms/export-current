/**
 * NDMC shell command-line interface
 */

var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function help(args) {
			var s = "ndmc command syntax:\r\n";
			for(var k in commands){
				s += "\t ndm.client " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	list : {
		args : "",
		help : "list clients",
		run : function list(args) {
			const NdmCloudService = require('./NdmCloudService');
			console.sendMessage(
				Format.jsObjectReadable(NdmCloudService.getClients())
			);
			return true;
		}
	},
	run : {
		args : "<clientAlias>",
		help : "run pending activity if any",
		run : function run(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			const future = client.run(console);
			return !!future;
		}
	},
	register : {
		args : "<clientAlias> [<reason>]",
		help : "perform registration",
		run : function register(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("Not enough arguments!");
			}
			const reason = args.shift() || 'manual';
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			const future = client.doRegister(reason);
			return !!future;
		}
	},
	next : {
		args : "<clientAlias>",
		help : "print the unix timestamp of next planned ndmc event",
		run : function next(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			console.sendMessage(client.next());
			return true;
		}
	},
	idle : {
		args : "<clientAlias>",
		help : "print amount of milliseconds till text planned ndmc event",
		run : function idle(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			console.sendMessage(Math.max(0, client.next() - Date.now()));
			return true;
		}
	},
	print : {
		args : "<clientAlias>",
		help : "print general client information and settings",
		run : function print(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			console.sendMessage("client: " + client.toString());
			return true;
		}
	},
	setup : {
		// ndm.client setup default ndss.myx.ru 443 997195123879923 0spmyvum9sq8727
		// ndm.client setup local ndss.macmyxpro.local 8443 075771260069315 KWrNhOJV3263192
		args : "<clientAlias> <ndssHost> <ndssHttpsPort> <licenseNumber> <serviceKey>",
		help : "configure NDSS Client",
		run : function setup(args) {
			const clientId = args.shift();
			const ndssHost = args.shift();
			const ndssPort = args.shift();
			const licenseNumber = args.shift();
			const serviceKey = args.shift() || '';
			if(!licenseNumber){
				return console.fail("Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			
			return !!NdmCloudService.updateClient(clientId, ndssHost, ndssPort, licenseNumber, serviceKey);
		}
	},
	drop : {
		args : "<clientAlias> <licenseNumber> <serviceKey>",
		help : "removes NDSS Client",
		run : function drop(args) {
			var clientId = args.shift();
			var licenseNumber = args.shift();
			var serviceKey = args.shift();
			throw "Not yet!";
			return true;
		}
	},
	"ndmp/link" : {
		/* ndm.client ndmp/link default ndss.local */
		args : "[--force-new] <clientAlias> <webShareName>",
		help : "Creates a link with NDMP service",
		run : function ndmpLink(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("Not enough arguments!");
			}
			const webShareName = args.shift();
			if(!webShareName){
				return console.fail("Not enough arguments!");
			}
			const forceNew = args.shift();
			if(forceNew && forceNew !== "--force-new"){
				return console.fail("'--force-new' it the only allowed value!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			if(!client){
				return console.fail("Client is unknown: " + clientId);
			}

			const link = client.ndmpPrepareValidationLink(webShareName, forceNew);
			if(link){
				console.log("ndmp link url is: " + link);
				return true;
			}
			return console.fail("ndmp link is not available!");
		}
	},
	"ndns/update" : {
		args : "<clientAlias> [<wanAddress> [<accessMode>]]",
		help : "Updates and displays name booking information",
		run : function ndnsUpdate(args) {
			var clientId = args.shift();
			var licenseNumber = args.shift();
			var serviceKey = args.shift();
			throw "Not yet!";
			return true;
		}
	},
	"ndns/book" : {
		args : "<clientAlias> <hostName> <domainName>",
		help : "removes NDSS Client",
		run : function runSetup(args) {
			var clientId = args.shift();
			var licenseNumber = args.shift();
			var serviceKey = args.shift();
			throw "Not yet!";
			return true;
		}
	},
	"ndns/check" : {
		args : "<clientAlias> <hostName> [<domainName>]",
		help : "removes NDSS Client",
		run : function runSetup(args) {
			var clientId = args.shift();
			var licenseNumber = args.shift();
			var serviceKey = args.shift();
			throw "Not yet!";
			return true;
		}
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
	var args = arguments;
	if (args.length < 2) {
		commands.help.run(args);
		return false;
	}

	// clone/creat an instance of real Array
	args = Array.prototype.slice.call(args);
	
	/* var selfName = */ args.shift();
	
	for ( var options = {};;) {
		var commandName = args.shift();
		if (commandName.startsWith("--")) {
			options[commandName.substr(2)] = true;
			continue;
		}
		var command = commands[commandName];
		if (!command) {
			return console.fail("unsupported command: %s", commandName);
		}

		return command.run(args, options);
	}
};

exports.description = "NDM.Client tool";
