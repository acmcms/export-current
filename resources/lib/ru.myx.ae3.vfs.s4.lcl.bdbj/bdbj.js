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

function internParseInstanceFn(args){
	const name = args.shift();
	if(!name){
		return "instance name argument is expected!";
	}
	const instance = Driver.internGetInstances()[name];
	if(!instance){
		return "instance '"+name+"' is unknown!";
	}
	return instance;
}

/**
 * internParseOptionsFn
 *
 * Only options provided in `options` map are supported. The type of provided options is respected.
 **/
const PARSE_OPTIONS_BOOLEAN_VALUES = {
	"disable":0,"no" :0,"off":0,"false":0,"0":0,
	"enable" :1,"yes":1,"on" :1,"true" :1,"1":1
};
function internParseOptionsFn(args, options, extraArguments){
	var value, option, pos;
	for(;;){
		value = args.shift();
		if(value === undefined){
			if(option){
				return "option value is expected!";
			}
			return options;
		}
		if(option){
			switch(typeof options[option]){
			case "number":
				if(Number.isNaN(Number(value))){
					return "invalid number format: " + value;
				}
				options[option] = Number(value);
				break;
			case "boolean":
				if("number" !== typeof PARSE_OPTIONS_BOOLEAN_VALUES[value]){
					return "invalid boolean format: " + value;
				}
				options[option] = !! PARSE_OPTIONS_BOOLEAN_VALUES[value];
				break;
c			case "string":
				options[option] = value;
				break;
			default:
				options[option] = value;
				break;
			}
			option = null;
			continue;
		}
		if(value.startsWith("--")){
			option = value.substr(2);
			pos = option.indexOf(':');
			if(pos === -1){
				pos = option.indexOf('=');
			}else//
			if(option.indexOf('=') !== -1){
				pos = Math.min(pos, option.indexOf('='));
			}
			
			if(pos === -1){
				if(undefined !== options[option] || options["allow-any-option"]){
					continue;
				}
				return "unsupported option: " + value;
			}

			value = option.substring(pos + 1);
			option = option.substring(0, pos);

			if(undefined === options[option] && !options["allow-any-option"]){
				return "unsupported option: " + option;
			}

			switch(typeof options[option]){
			case "number":
				if(Number.isNaN(Number(value))){
					return "invalid number format: " + value;
				}
				options[option] = Number(value);
				option = undefined
				continue;
			case "boolean":
				if("number" !== typeof PARSE_OPTIONS_BOOLEAN_VALUES[value]){
					return "invalid boolean format: " + value;
				}
				options[option] = !! PARSE_OPTIONS_BOOLEAN_VALUES[value];
				option = undefined
				continue;
c			case "string":
				options[option] = value;
				option = undefined
				continue;
			default:
				options[option] = value;
				option = undefined
				continue;
			}
		}
		if(extraArguments){
			args.unshift(value);
			return options;
		}
		return "invalid option: " + value;
	}
}


var commands = {
	clean : {
		args : "<instance>",
		help : "runs a cleaner on specified instance",
		run : function runClean(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
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
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
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
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
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
			const instances = Driver.internGetInstances();
			console.sendMessage(Object.keys(instances).join('\n'));
			return true;
		}
	},
	location : {
		args : "<instance>",
		help : "prints host filesystem location for database files of specified instance",
		run : function stop(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
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
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			const result = {
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
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
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
		args : "<instance> [--short/--full]",
		help : "show info related to an instance of bdbj storage",
		run : function runShow(args) {
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			var doShort, doFull;
			if(args[0] === "--short"){
				args.shift();
				doShort = 1;
			}else//
			if(args[0] === "--full"){
				args.shift();
				doFull = 1;
			}
			
			if(args[0]){
				return console.fail("unexpected extra arguments: %s", Format.jsStringFragment(args[0]));
			}
			
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			var size = instance.storageCalculate();
			var stats = instance.internStorageStats();
			var info = {};
			
			if(doShort){
				Object.assign(info, {
					sizeFormatted : Format.bytesCompact(size),
					cleanerBacklog : stats.cleanerBacklog,
				});
			}else//
			if(!doFull){
				Object.assign(info, {
					name : name,
					sizeFormatted : Format.bytesCompact(size),
					totalLogSizeFormatted : Format.bytesCompact(stats.totalLogSize),
					cleanerBacklog : stats.cleanerBacklog,
					path : instance.storageLocation,
				});
			}else{
				Object.assign(info, {
					name : name,
					size : size,
					sizeFormatted : Format.bytesCompact(size),
					totalLogSize : stats.totalLogSize,
					totalLogSizeFormatted : Format.bytesCompact(stats.totalLogSize),
					cleanerBacklog : stats.cleanerBacklog,
					path : instance.storageLocation,
				});
			}
			
			if(!doShort && instance.taskDelayExpunge){
				if(doShort){
					info.delayExpunge = Format.periodCompact(instance.taskDelayExpunge.lastTTL);
				}else//
				if(!doFull){
					info.delayExpunge = {
						lastDate : instance.taskDelayExpunge.lastDate === -1
							? 'Enabled, waiting to start'
							: new Date(instance.taskDelayExpunge.lastDate).toISOString(),
						lastTTL : Format.periodCompact(instance.taskDelayExpunge.lastTTL),
						lastAvail : Format.decimalCompact(instance.taskDelayExpunge.lastAvail * 100) + '%',
					};
				}else{
					info.delayExpunge = {
						queuePath : instance.taskDelayExpunge.queueLocation,
						lastDate : instance.taskDelayExpunge.lastDate === -1
							? 'Enabled, waiting to start'
							: new Date(instance.taskDelayExpunge.lastDate).toISOString(),
						lastTTL : Format.periodCompact(instance.taskDelayExpunge.lastTTL),
						lastAvail : Format.decimalCompact(instance.taskDelayExpunge.lastAvail * 100) + '%',
						lastQueued : Format.decimalCompact(instance.taskDelayExpunge.lastQueued),
						lastCleaned : Format.decimalCompact(instance.taskDelayExpunge.lastCleaned),
						lastOthers : Format.decimalCompact(instance.taskDelayExpunge.lastIgnored),
					};
				}
			}
			
			console.sendMessage(Format.jsObjectReadable(info));
			return true;
		}
	},
	stats : {
		args : "<instance> [--all-plain]",
		help : "prints stats for specified instance",
		run : function stop(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			const stats = instance.internStorageStats();
			if('--all-plain' === args.shift()){
				console.sendMessage(stats.toStringVerbose());
				return true;
			}
			const map = {};
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
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			instance.internStorageSync();
			console.sendMessage("quick sync completed.");
			return true;
		}
	},
	read : {
		args : "<instance> <table> [--delete --force-delete] [--limit 10] [--prefix/--exact/--start/ <type>:<expr>] [--stop <type>:<expr>]",
		help : "show contents of the table of an instance of bdbj storage",
		run : function runRead(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			const tableName = args.shift();
			if(!tableName){
				return console.fail("table name argument is expected!");
			}
			const options = internParseOptionsFn(args, {
				"delete" : null,
				"limit" : 10,
				"exact" : null,
				"prefix" : null,
				"start" : null,
				"stop" : null
			});
			if("string" === typeof options){
				return console.fail(options);
			}

			const result = instance.internStorageTableRangeOperation( //
				options.delete === "--force-delete" ? "delete" : "select",
				tableName, 
				options.limit, 
				options.exact, 
				options.prefix, 
				options.start, 
				options.stop //
			);
			console.sendMessage(Format.jsObjectReadable(result));
			return true;
		}
	},
	readItemsByItemGuid : {
		args : "<instance> [--key:guid/azimuth/azimuth+luid/luid+guid] <guid/azimuth/...> [...<guid/azimuth/...>]",
		help : "read 'item' record by Guid (externalized value) or another key types. Default key type is 'guid'.",
		run : function readItemsByGuid(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			
			const options = internParseOptionsFn(args, {
				key : "guid",
				limit : 10
			}, true);
			if("string" === typeof options){
				return console.fail(options);
			}
			
			var nextGuid, list, collected = [];
			for(;nextGuid = args.shift();){
				list = instance.internStorageTableRangeOperation( //
					"select", "guid", options.limit, null, options.key + ":" + nextGuid, null, null //
				);
				collected.push.apply(collected, list);
			}
			const result = collected.reduce((function (instance, list, result, x){
				list = instance.internStorageTableRangeOperation( //
					"select", "item", 1, "key0_luid6:" + x.key1_luid6, null, null, null //
				);
				result.push.apply(result, list);
				return result;
			}).bind(null, instance, undefined), []);
			console.sendMessage(Format.jsObjectReadable(result));
			return true;
		}
	},
	readTreeByItemGuid : {
		args : "<instance> [--key guid/azimuth/azimuth+luid/luid+guid] <guid/azimuth/...> [...<guid/azimuth/...>]",
		help : "read 'item' record by Guid (externalized value) or another key types. Default key type is 'guid'.",
		run : function readItemsByGuid(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			
			const options = internParseOptionsFn(args, {
				key : "guid",
				limit : 10
			}, true);
			if("string" === typeof options){
				return console.fail(options);
			}
			
			var nextGuid, list, collected = [];
			for(;nextGuid = args.shift();){
				list = instance.internStorageTableRangeOperation( //
					"select", "guid", options.limit, null, options.key + ":" + nextGuid, null, null //
				);
				collected.push.apply(collected, list);
			}
			const result = collected.reduce((function (instance, list, result, x){
				list = instance.internStorageTableRangeOperation( //
					"select", "tree", options.limit, null, "key0_luid6:" + x.key1_luid6, null, null //
				);
				result.push.apply(result, list);
				return result;
			}).bind(null, instance, undefined), []);
			console.sendMessage(Format.jsObjectReadable(result));
			return true;
		}
	},
	"delete" : {
		args : "<instance> <table> [--delete --force-delete] [--limit 1] [--exact/--prefix/--start <type>:<expr>] [--stop <type>:<expr>]",
		help : "deletes contents of the table of an instance of bdbj storage",
		run : function runDelete(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			const tableName = args.shift();
			if(!tableName){
				return console.fail("table name argument is expected!");
			}
			const options = internParseOptionsFn(args, {
				"delete" : null,
				"limit" : 1,
				"exact" : null,
				"prefix" : null,
				"start" : null,
				"stop" : null
			});
			if("string" === typeof options){
				return console.fail(options);
			}

			const result = instance.internStorageTableRangeOperation( //
				options.delete === "--force-delete" ? "delete" : "select",
				tableName, 
				options.limit, 
				options.exact,
				options.prefix,
				options.start,
				options.stop //
			);
			console.sendMessage(Format.jsObjectReadable(result));
			return true;
		}
	},
	store : {
		args : "<instance> <table> <map_expr>",
		help : "stores a record, example: bdbj store lcl item --map '{key0_luid6:1,val0_schedule2:32767,val1_guidX:Guid(null)}'",
		run : function runStore(args){
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			const tableName = args.shift();
			if(!tableName){
				return console.fail("table name argument is expected!");
			}
			const options = internParseOptionsFn(args, {
				map : null
			});
			if("string" === typeof options){
				return console.fail(options);
			}
			const object = options.map || undefined;
			const result = instance.internStorageTableStore(tableName, object);
			console.sendMessage(Format.jsObjectReadable(result));
			return true;
		}
	},
	tables : {
		args : "<instance>",
		help : "show list of tables of an instance of bdbj storage",
		run : function runTables(args) {
			const name = args.shift();
			if(!name){
				return console.fail("instance name argument is expected!");
			}
			const instance = Driver.internGetInstances()[name];
			if(!instance){
				return console.fail("instance '%s' is unknown!", name);
			}
			const list = instance.internStorageTables();
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
