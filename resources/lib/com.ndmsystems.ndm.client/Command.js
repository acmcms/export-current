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
			const clients = NdmCloudService.getClients();
			console.sendMessage(
				Format.jsObjectReadable(Object.keys(clients).map(function(key){ return clients[key].toString(); }))
			);
			return true;
		}
	},
	show : {
		args : "<clientAlias>",
		help : "show client detailed status information and settings",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			console.sendMessage(
				Format.jsObjectReadable(client)
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
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const future = client.run(console);
			return !!future;
		}
	},
	next : {
		args : "<clientAlias>",
		help : "print the unix timestamp of next planned ndmc event",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

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
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			console.sendMessage(Math.max(0, client.next() - Date.now()));
			return true;
		}
	},
	print : {
		args : "<clientAlias>",
		help : "print general client description",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			console.sendMessage("client: " + client.toString());
			return true;
		}
	},
	"base/register" : {
		args : "<clientAlias> [<reason>]",
		help : "perform registration",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const base = client.components.base;
			
			const reason = args.shift() || 'manual';
			
			return base.cliBaseRegister(reason);
		}
	},
	"base/versions" : {
		args : "<clientAlias>",
		help : "list firmware versions",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const base = client.components.base;

			return base.cliBaseVersions();
		}
	},
	"base/components" : {
		args : "<clientAlias> <channel>",
		help : "list firmware components",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const base = client.components.base;

			const channel = args.shift() || "draft";

			return base.cliBaseComponents(channel);
		}
	},
	"base/firmware" : {
		args : "<clientAlias> [<channel>]",
		help : "download firmware",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			return console.fail("unsupported");
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
			const client = require('./NdmCloudService').getClient(clientId);
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
	"ndmp/services" : {
		args : "<clientAlias> [<service1> [<service2> ...]]",
		help : "Updates and displays name booking information",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const ndmp = client.components.ndmp;

			return ndmp.cliNdmpServices(args);
		}
	},
	"ndmp/link" : {
		/* ndm.client ndmp/link default ndss.local */
		args : "<clientAlias> <serviceId> [--force-new]",
		help : "Creates a link with NDMP service",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const serviceId = args.shift();
			if(!serviceId){
				return console.fail("ndm.client: Not enough arguments: serviceId argument expected!");
			}
			const forceNew = args.shift();
			if(forceNew && forceNew !== "--force-new"){
				return console.fail("ndm.client: '--force-new' it the only allowed value!");
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
			"<clientAlias> <serviceId>",
			"<clientAlias> [--all]",
		],
		run : function(args){
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments: clientAlias argument expected!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const serviceId = args.shift();
			if(!serviceId){
				return console.fail("ndm.client: Not enough arguments: serviceId argument expected!");
			}

			const NdmCloudService = require('./NdmCloudService');
			if(serviceId === '--all'){
				for(let client of NdmCloudService.getClients()){
					if(!client.components.ndmp.invalidateMatingKeys(true)){
						return console.fail("ndm.client: ndmp unlink is not available!, client: %s", Format.jsObjectReadable(client));
					}
					console.sendMessage("client: " + client.clientId + ", ndmp link data clean");
				}
				return true;
			}

			const result = client.components.ndmp.invalidateMatingKeys(true);
			if(result){
				return true;
			}
			return console.fail("ndm.client: ndmp unlink is not available!");
		}
	},
	"ndns/check" : {
		args : "<clientAlias> [<hostName> [<domainName>]]",
		help : "Check available NDNS names/domains",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const ndns = client.components.ndns;

			const name = args.shift() || undefined;
			const domain = args.shift() || undefined;

			return ndns.cliNdnsCheck(name, domain);
		}
	},
	"ndns/book" : {
		args : "<clientAlias> <hostName> <domainName> [<address4> <access4> <address6> <access6> [<transfer>]]",
		help : "Book NDNS domain name",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const ndns = client.components.ndns;

			const name = args.shift() || undefined;
			const domain = args.shift() || undefined;
			const address4 = args.shift() || undefined;
			const access4 = args.shift() || undefined;
			const address6 = args.shift() || undefined;
			const access6 = args.shift() || undefined;
			const transfer = args.shift() || undefined;

			return ndns.cliNdnsBook(name, domain, address4, access4, address6, access6, transfer);
		}
	},
	"ndns/update" : {
		args : "<clientAlias> [<wanAddress> [<accessMode>]]",
		help : "Updates and displays name booking information",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const ndns = client.components.ndns;
	
			const address4 = args.shift() || undefined;
			const access4 = args.shift() || undefined;
			const address6 = args.shift() || undefined;
			const access6 = args.shift() || undefined;
	
			return ndns.cliNdnsUpdate(address4, access4, address6, access6);
		}
	},
	"ndns/drop" : {
		/** TODO: maybe display as suggestions in ndns/check */
		args : "<clientAlias> <hostName> <domainName>",
		help : "Drop NDNS booking",
		run : function(args) {
			const clientId = args.shift();
			if(!clientId){
				return console.fail("ndm.client: Not enough arguments!");
			}
			const client = require('./NdmCloudService').getClient(clientId);
			if(!client){
				return console.fail("ndm.client: Client is unknown: " + clientId);
			}

			const ndns = client.components.ndns;

			const name = args.shift() || undefined;
			const domain = args.shift() || undefined;

			return ndns.cliNdnsDrop(name, domain);
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
	
	for (var options = {};;) {
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
