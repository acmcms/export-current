const Driver = require('java.class/ru.myx.ae3.vfs.s4.lcl.bdbj.BdbjLocalS4');

function checkGuidDatabase(instance, fix){
	
}

function checkIndexDatabase(instance, fix){
	
}

function checkItemDatabase(instance, fix){
	
}

function checkQueueDatabase(instance, fix){
	
}

function checkTailDatabase(instance, fix){
	
}

function checkTreeDatabase(instance, fix){
	
}

function checkUsageDatabase(instance, fix){
	
}



var commands = {
	clean : {
		args : "<instance>",
		help : "runs a cleaner on specified instance",
		run : function runClean(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			console.sendMessage(Format.jsObjectReadable({
				name : name,
				clean : instance.internStorageClean(),
			}));
			return true;
		}
	},
	compress : {
		args : "<instance>",
		help : "runs a compressor loop on specified instance",
		run : function runCompress(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			instance.internStorageCompress();
			console.sendMessage("compress completed.");
			return true;
		}
	},
	force : {
		args : "<instance>",
		help : "forces checkpoint on specified instance",
		run : function stop(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			instance.internStorageForce();
			console.sendMessage("checkpoint forced.");
			return true;
		}
	},
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "bdbj command syntax:\n";
			for(var k in commands){
				s += "\t bdbj " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	list : {
		args : "",
		help : "provides an instance list",
		run : function list(args){
			if(args.length){
				return console.fail("extra parameters to 'list' command!");
			}
			var instances = Driver.internGetInstances();
			console.sendMessage(Object.keys(instances).join('\n'));
			return true;
		}
	},
	location : {
		args : "<instance>",
		help : "prints host filesystem location for database files of specified instance",
		run : function stop(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			console.sendMessage(instance.storageLocation);
			return true;
		}
	},
	records : {
		args : "<instance>",
		help : "show record count in every table of an instance of bdbj storage",
		run : function runShow(args) {
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			var result = {
				name : name,
				counts : {},
			};
			for(var tableName in instance.internStorageTables()){
				console.sendProgress("Scanning table: " + tableName + "...")
				result.counts[tableName] = instance.internStorageTableRecordCount(tableName);
			}
			console.sendMessage(Format.jsObjectReadable(result));
			return true;
		}
	},
	repair : {
		args : "<instance> [all|guid|item|queue|tail|tree|index|usage]",
		help : "check/repair an instance of bdbj storage",
		run : function runRepair(args) {
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			
			
			
			/**
			 * Scan / Repair 'Guid' table
			 */
			{
				var iterator = instance.createRepairGuidIterator();
			}
			var size = instance.storageCalculate();
			var stats = instance.internStorageStats();
			console.sendMessage(Format.jsObjectReadable({
				name : name,
				size : size,
				totalLogSize : stats.totalLogSize,
				cleanerBacklog : stats.cleanerBacklog,
				path : instance.storageLocation,
			}));
			return true;
		}
	},
	show : {
		args : "<instance>",
		help : "show info related to an instance of bdbj storage",
		run : function runShow(args) {
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			var size = instance.storageCalculate();
			var stats = instance.internStorageStats();
			var info = {
				name : name,
				size : size,
				sizeFormatted : Format.bytesCompact(size),
				totalLogSize : stats.totalLogSize,
				totalLogSizeFormatted : Format.bytesCompact(stats.totalLogSize),
				cleanerBacklog : stats.cleanerBacklog,
				path : instance.storageLocation,
			};
			if(instance.taskDelayExpunge){
				info.delayExpunge = {
					lastDate : instance.taskDelayExpunge.lastDate === -1
						? 'Enabled, waiting to start'
						: new Date(instance.taskDelayExpunge.lastDate).toISOString(),
					lastTTL : Format.periodCompact(instance.taskDelayExpunge.lastTTL),
					lastAvail : Format.decimalCompact(instance.taskDelayExpunge.lastAvail * 100) + '%'
				};
			}
			console.sendMessage(Format.jsObjectReadable(info));
			return true;
		}
	},
	stats : {
		args : "<instance> [--all-plain]",
		help : "prints stats for specified instance",
		run : function stop(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			var stats = instance.internStorageStats();
			if('--all-plain' === args.shift()){
				console.sendMessage(stats.toStringVerbose());
				return true;
			}
			var map = {};
			for(var key of [
			                     'totalLogSize',
			                     'fileDeletionBacklog',
			                     'cleanerBacklog',
			                     ]){
				map[key] = stats[key];
			}
			console.sendMessage(Format.jsObjectReadable(map));
			return true;
		}
	},
	sync : {
		args : "<instance>",
		help : "forces a quick checkpoint on specified instance",
		run : function stop(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			instance.internStorageSync();
			console.sendMessage("quick sync completed.");
			return true;
		}
	},
	read : {
		args : "<instance> <table> [--limit 10] [--start <type>:<expr>]",
		help : "show contents of the table of an instance of bdbj storage",
		run : function runRead(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			var tableName = args.shift();
			if(!tableName){
				return console.fail("table name argument is expected!");
			}
			var value, option, options = {
				limit : 10,
				start : null
			};
			for(;;){
				value = args.shift();
				if(value === undefined){
					if(option){
						return console.fail("option value is expected!");
					}
					break;
				}
				if(option){
					options[option] = value;
					option = null;
					continue;
				}
				if(value.startsWith('--')){
					option = value.substr(2);
					continue;
				}
				return console.fail("invalid option: " + value);
			}
			var list = instance.internStorageTableRead(tableName, Number(options.limit || 0), options.start || undefined);
			console.sendMessage(Format.jsObjectReadable(list));
			return true;
		}
	},
	store : {
		args : "<instance> <table> <map_expr>",
		help : "stores a record, example: bdbj store lcl item --map '{key00_luid6:1,val00_schedule2:32767,val01_guidX:Guid(null)}'",
		run : function runStore(args){
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			var tableName = args.shift();
			if(!tableName){
				return console.fail("table name argument is expected!");
			}
			var value, option, options = {
				map : null
			};
			for(;;){
				value = args.shift();
				if(value === undefined){
					if(option){
						return console.fail("option value is expected!");
					}
					break;
				}
				if(option){
					options[option] = value;
					option = null;
					continue;
				}
				if(value.startsWith('--')){
					option = value.substr(2);
					continue;
				}
				return console.fail("invalid option: " + value);
			}
			var object = options.map || undefined;
			var list = instance.internStorageTableStore(tableName, object);
			console.sendMessage(Format.jsObjectReadable(list));
			return true;
		}
	},
	tables : {
		args : "<instance>",
		help : "show list of tables of an instance of bdbj storage",
		run : function runTables(args) {
			var name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var instances = Driver.internGetInstances();
			var instance = instances[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			var list = instance.internStorageTables();
			console.sendMessage(Format.jsObjectReadable({
				name : name,
				tables : list,
			}));
			return true;
		}
	},
};


/**
 * s4 driver
 * 
 * @param args
 * @returns {Boolean}
 */
exports.create = function create(args){
	var driver = new Driver();
	if(args && args.length && (args = args[0])){
		if('string' === typeof args){
			args = require('querystring').parse(args);
		}
		console.log('BDBJE: using extra options specified: ' + Format.jsDescribe(args));
		String(args['delay-expunge'] || 'false') !== 'false' && driver.setDelayExpungeOption(true);
		if(String(args['fail-start'] || 'false') !== 'false'){
			throw "BDBJE start failed: remove the 'fail-start' mount option.";
		}
	}
	return driver;
};

/**
 * console command
 * 
 * @returns {Boolean}
 */
exports.run = function run(){
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
