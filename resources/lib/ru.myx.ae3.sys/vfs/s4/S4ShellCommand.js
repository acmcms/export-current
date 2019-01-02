var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "s4 command syntax:\r\n";
			for(var k in commands){
				s += "\t s4 " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	list : {
		args : "",
		help : "displays a list of S4 instances currently loaded",
		run : function runList(args){
			import ru.myx.ae3.vfs.s4.StorageImplS4;
			// console.log(Format.jsObjectReadable(StorageImplS4.internGetInstances()));
			console.log(Format.jsDescribe(StorageImplS4.internGetInstances()));
			return true;
		},
	},
	check : {
		args : "[--all] [--full] [--fix] [--verbose] <instanceKey>",
		help : "checks s4 storage instance",
		run : function runCheck(args){
			var context = {
				all : false,
				full : false,
				fix : false,
				verbose : false,
				console : console
			};
			var instanceKey;
			for(;;){
				var current = args.shift();
				if(!current){
					break;
				}
				if(current.startsWith('--')){
					current = current.substring(2);
					var pos = current.indexOf('=');
					if(pos == -1){
						context[current] = true;
					}else{
						context[current.substring(0, pos)] = current.substring(pos + 1);
					}
					continue;
				}
				if(instanceKey){
					instanceKey += " " + current;
				}else{
					instanceKey = current;
				}
			}
			if(!instanceKey){
				return console.fail("'instanceKey' argument is required!");
			}
			import ru.myx.ae3.vfs.s4.StorageImplS4;
			var instances = StorageImplS4.internGetInstances();
			var instance = instances[instanceKey];
			if(!instance){
				return console.fail("Instance '" + instanceKey + "' is unknown!");
			}
			
			var checkContext = instance.createCheckContext && instance.createCheckContext(context);
			if(!checkContext){
				return console.fail("Instance '" + instanceKey + "' doesn't support checking!");
			}
			try{
				for(var left = 0; checkContext.next(); ){
					if( (--left) % 100 === 0){
						console.sendProgress();
					}
				}

				console.log("finished, %s items checked, %s errors detected, %s problems fixed.", 
						String(checkContext.checks),
						String(checkContext.errors),
						String(checkContext.fixes)
						);
			}finally{
				checkContext.close();
			}
			return true;
		},
	},
	drivers : {
		args : "",
		help : "displays a list of S4 storage drivers",
		run : function runDrivers(args){
			var DriverTypes = require('./DriverTypes');
			console.sendMessage(Format.jsObjectReadable(DriverTypes.listDrivers()));
			return true;
		},
	},
	status : {
		args : "",
		help : "show S4 status (current state and statistics)",
		run : function runShow(args) {
			var Shell = require('ae3.util/Shell');
			return Shell.executeNativeInline(["cat", "/status/s4/status.txt"]);

			/**
			var StatusRegistry = require('java.class/ru.myx.ae3.status.StatusRegistry');
			var rootRegistry = StatusRegistry.ROOT_REGISTRY;
			var vfs = rootRegistry.statusProviders.vfs;
			var status = vfs.status;
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
	
	var commandName = args.shift();
	var command = commands[commandName];
	if (!command) {
		return console.fail("unsupported command: %s", commandName);
	}
	return command.run(args);
};

exports.description = "'s4' command";