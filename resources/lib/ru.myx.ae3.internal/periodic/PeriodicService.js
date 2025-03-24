var vfs = require("ae3/vfs");

var vfsData = vfs.ROOT.relativeFolderEnsure("storage/data/periodic");

var vfsPeriodic = vfs.UNION.relativeFolderEnsure("settings/periodic");

const GROUPS = {
	'hourly' : {
		key : 'Hourly',
		vfs : vfsPeriodic.relativeFolderEnsure("hourly"),
		lst : vfsData.relativeFile("lastHourly"),
		due : function hourlyDue(date){ 
			date.setMinutes(0, 0, 0);
			return date;
		},
		run : {}
	},
	'daily' : {
		key : 'Daily',
		vfs : vfsPeriodic.relativeFolderEnsure("daily"),
		lst : vfsData.relativeFile("lastDaily"),
		due : function dailyDue(date){ 
			date.setHours(0, 0, 0, 0);
			return date;
		},
		run : {}
	},
	'weekly' : {
		key : 'Weekly',
		vfs : vfsPeriodic.relativeFolderEnsure("weekly"),
		lst : vfsData.relativeFile("lastWeekly"),
		due : function weeklyDue(date){ 
			var day = date.getDay() || 7;
			if (day !== 1) {
				date.setHours(-24 * (day - 1));
			}
			date.setHours(0, 0, 0, 0);
			return date;
		},
		run : {}
	},
	'monthly' : {
		key : 'Monthly',
		vfs : vfsPeriodic.relativeFolderEnsure("monthly"),
		lst : vfsData.relativeFile("lastMonthly"),
		due : function monthlyDue(date){ 
			date.setDate(1);
			date.setHours(0, 0, 0, 0);
			return date;
		},
		run : {}
	},
	'idle' : {
		key : 'Idle',
		vfs : vfsPeriodic.relativeFolderEnsure("idle"),
		lst : vfsData.relativeFile("lastIdle"),
		due : function idleDue(date){ 
			date.setSeconds(0, 0);
			return date;
		},
		run : {}
	},
};

const GROUP_NAMES = Object.keys(GROUPS);

var Executable = require("ae3/Executable");

var stopped = true;

function periodic() {
	if (stopped) {
		return;
	}
	try {
		for(var groupName of GROUP_NAMES){
			var group = GROUPS[groupName];
			var last = group.lst;
			var prev = last.isExist() && last.isPrimitive() && last.primitiveValue || new Date(0);
			
			var date = group.due(new Date());
			if (prev < date) {
				last.doSetPrimitive(date);
				group.lst = vfsData.relativeFile("last" + group.key);
				runTasks(group.vfs);
			}
		}
	} finally {
		stopped || setTimeout(periodic, 15000);
	}
}

function filterDescriptors(file/* , i, a */) {
	return file.key.endsWith(".json");
}

function getTaskDescriptors(entry) {
	var array = entry.getContentCollection(null);
	return array.filter(filterDescriptors);
}


function runTask(e) {
	var console = this;
	var description = JSON.parse(e);
	if (!description || description.type != "ae3/Executable") {
		return console.fail(vfs.getRelativePath(vfsPeriodic, e)
				+ ": Invalid descriptor!");
	}
	var executable;
	var result;
	try {
		executable = new Executable(description);
		result = executable.run(console, null);
		if (true !== result) {
			console.fail(vfs.getRelativePath(vfsPeriodic, e)
					+ ": non-default exit code: "
					+ Format.jsDescribe(result));
		}
	} catch (error) {
		console.fail(vfs.getRelativePath(vfsPeriodic, e)
				+ ": Error: " + error);
	}
}

function runTasks(entry) {
	var tasks = getTaskDescriptors(entry);
	if (!tasks || tasks.length == 0) {
		return;
	}
	var CollectConsole = require("ae3.util/CollectConsole");
	var console = new CollectConsole();
	
	tasks.forEach(runTask, console);
	
	// TODO: seems to be incomplete to be able to work
	var collected = console.getCollected();
	if (collected?.length) {
		require("java.class/java.lang.System").out
				.println("PERIODIC: console output: \n\t"
						+ Format.jsObject(collected));
	}
}

exports.start = function start() {
	if (!stopped) {
		throw "already started";
	}
	setTimeout(periodic, 10000);
	stopped = false;
};

exports.stop = function stop() {
	if (stopped) {
		throw "already stopped";
	}
	stopped = true;
};


/**
 * TODO: make actual commands, starting with 'groups'
 */

function cmdGroups(args){
	if(args.length){
		return console.fail("extra arguments: " + Format.jsObject(args));
	}
	// var args = arguments;
	for(var groupName of GROUP_NAMES){
		var group = GROUPS[groupName];
		var last = vfsData.relativeFile("last" + group.key);
		var prev = last.isExist() && last.isPrimitive() && last.primitiveValue || new Date(0);
		console.log("\t%s\t%s", groupName, prev?.toISOString?.() || 'never-started' );
	}
	return true;
}

function cmdList(args){
	var filterName = args.shift();
	if(args.length){
		return console.fail("extra arguments: " + Format.jsObject(args));
	}
	// var args = arguments;
	for(var groupName of GROUP_NAMES){
		if(filterName !== null && filterName !== groupName){
			continue;
		}
		console.log("\tgroup: %s", groupName);
		var group = GROUPS[groupName];
		var tasks = getTaskDescriptors(group.vfs);
		for(var e of tasks){
			var description = JSON.parse(e);
			if (!description || description.type != "ae3/Executable") {
				console.error("\t\t%s: invalid descriptor at %s", e.key, vfs.getRelativePath(vfsPeriodic, e));
				continue;
			}
			try {
				var executable = new Executable(description);
				console.log("\t\t%s: %s", e.key, Format.jsObject(executable));
			} catch (error) {
				console.error("\t\t%s: ERROR: %s", e.key, error);
			}
		}
	}
	return true;
}

function cmdRun(args){
	var filterName = args.shift();
	if(!filterName){
		return console.fail("Group name required");
	}
	var taskName = args.shift();
	if(args.length){
		return console.fail("Extra arguments: " + Format.jsObject(args));
	}
	// var args = arguments;
	for(var groupName of GROUP_NAMES){
		if(filterName && filterName !== groupName){
			continue;
		}
		console.log("Group: %s", groupName);
		var group = GROUPS[groupName];
		var tasks = getTaskDescriptors(group.vfs);
		for(var e of tasks){
			if(taskName && !e.key.equals(taskName + '.json')){
				continue;
			}
			console.log("Starting: " + e.key);
			try {
				runTask.call(console, e);
			} catch (error) {
				console.error("Task %s: ERROR: %s", e.key, error);
			}
		}
	}
	return true;
}

const COMMANDS = {
		groups : cmdGroups,
		list : cmdList,
		run : cmdRun,
};

/**
 * console command
 * 
 * @returns {Boolean}
 */
exports.run = function run(){
	if(arguments.length < 2){
		console.sendMessage(
			"'periodic' command syntax:\n" +
			"\tperiodic\n" +
			"\tperiodic groups\n" +
			"\tperiodic list [<group>]\n" +
			"\tperiodic run <group> <task>\n" +
			""
		);
		return false;
	}

	var commandName = arguments[1];
	var command = COMMANDS[commandName];
	if(!command){
		return console.fail("unsupported command: " + commandName);
	}
	
	return command.call(commands, Array.prototype.slice.call(arguments, 2));
};

exports.description = "'periodic' scheduling service";

