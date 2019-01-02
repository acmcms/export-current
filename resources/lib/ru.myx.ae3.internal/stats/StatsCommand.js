/**
 * 'ae3.stats' shell command-line interface
 */

var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "stats command syntax:\r\n";
			for(var k in commands){
				s += "\t stats " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	list : {
		args : "",
		help : "list sensor groups",
		run : function runList(args) {
			var Stats = require('./Stats');
			var descriptors = Stats.getGroupDescriptors();
			console.sendMessage(Format.jsObjectReadable(descriptors));
			return true;
		}
	},
	show : {
		args : [ "all", "group <groupName>"],
		help : "show stats",
		run : function runShow(args) {
			var mode = args.shift();
			if(!mode){
				return console.fail("Not enough arguments!");
			}
			var Stats = require('./Stats');
			var descriptors = Stats.getGroupDescriptors();
			switch(mode){
			case 'all':{
				var group, key, result = {};
				for(key of Object.keys(descriptors).sort()){
					group = Stats.getGroup(key);
					if(group){
						result[key] = group.readValues({});
					}
				}
				console.sendMessage(Format.jsObjectReadable(result));
				return true;
			}
			case 'group':{
				var name = args.shift();
				if(!name){
					return console.fail("Group name expected!");
				}
				var group;
				{
					group = Stats.getGroup(name);
					if(group){
						console.sendMessage(Format.jsObjectReadable(group.readValues({})));
					}
				}
				return true;
			}
			default:{
				return console.fail("Invalid mode: " + mode);
			}
			}
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

exports.description = "ae3.stats tool";
