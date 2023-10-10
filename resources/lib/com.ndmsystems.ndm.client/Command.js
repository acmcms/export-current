const ae3 = require("ae3");

/**
 * NDMC shell command-line interface
 */

var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function(args) {
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
		run : function(args) {
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
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
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
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
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
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
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
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
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
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			console.sendMessage("client: " + client.toString());
			return true;
		}
	},
	setup : {
		// ndm.client setup default ndss.myx.nz 443 997195123879923 0spmyvum9sq8727
		// ndm.client setup local ndss.macmyxpro.local 8443 075771260069315 KWrNhOJV3263192
		args : "<clientAlias> <ndssHost> <ndssHttpsPort> <licenseNumber> <serviceKey>",
		help : "configure NDSS Client",
		run : function(args) {
			const clientId = args.shift();
			const ndssHost = args.shift();
			const ndssPort = args.shift();
			const licenseNumber = args.shift();
			const serviceKey = args.shift() || '';
			if(!licenseNumber){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			
			return !!NdmCloudService.updateClient(clientId, ndssHost, ndssPort, licenseNumber, serviceKey);
		}
	},
	drop : {
		args : "<clientAlias> <licenseNumber> <serviceKey>",
		help : "removes NDSS Client",
		run : function(args) {
			var clientId = args.shift();
			var licenseNumber = args.shift();
			var serviceKey = args.shift();
			throw "Not yet!";
			return true;
		}
	},
	"ndmp/link" : {
		/* ndm.client ndmp/link default ndss.local */
		args : "<clientAlias> [--force-new]",
		help : "Creates a link with NDMP service",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const forceNew = args.shift();
			if(forceNew && forceNew !== "--force-new"){
				return console.fail("ndm.client: '--force-new' it the only allowed value!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const link = client.components.ndmp.prepareMatingLink(forceNew);
			if(link){
				console.log("ndm.client: ndmp link url is: " + link);
				return true;
			}
			return console.fail("ndm.client: ndmp link is not available!");
		}
	},
	"ndmp/unlink" : {
		/* ndm.client ndmp/link default ndss.local */
		args : [
			"--all",
			"<clientAlias>",
		],
		run : function(args){
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}

			const NdmCloudService = require('./NdmCloudService');
			if(clientId === '--all'){
				for(let client of NdmCloudService.getClients()){
					if(!client.components.ndmp.invalidateMatingKeys(true)){
						return console.fail("ndm.client: ndmp unlink is not available!, client: %s", Format.jsObjectReadable(client));
					}
					console.sendMessage("client: " + client.clientId + ", ndmp link data clean");
				}
				return true;
			}
			
			const client = NdmCloudService.getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const result = client.components.ndmp.invalidateMatingKeys(true);
			if(result){
				return true;
			}
			return console.fail("ndm.client: ndmp unlink is not available!");
		}
	},
	"ndmp/status" : {
		/* ndm.client ndmp/status default */
		args : "<clientAlias>",
		help : "Displays NDMP mating status",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const NdmCloudService = require('./NdmCloudService');
			const client = NdmCloudService.getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const keys = client.components.ndmp.confirmedMatingKeys;
			if(keys){
				const Secp256r1 = ae3.crypto.EllipticCurveSecp256r1;
				console.log("ndm.client: ndmp mating client key: %s", Secp256r1.formatPublicKeyAsHexCompressed(keys.client));
				console.log("ndm.client: ndmp mating server key: %s", Secp256r1.formatPublicKeyAsHexCompressed(keys.server));
				return true;
			}
			return console.fail("ndm.client: ndmp service is not linked!");
		}
	},
	"ndns/update" : {
		args : "<clientAlias> [<wanAddress> [<accessMode>]]",
		help : "Updates and displays name booking information",
		run : function(args) {
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
		run : function(args) {
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
		run : function(args) {
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
			return console.fail("ndm.client: unsupported command: %s", commandName);
		}

		return command.run(args, options);
	}
};

exports.description = "NDM.Client tool";
