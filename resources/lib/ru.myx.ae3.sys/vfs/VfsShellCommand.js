const ae3 = require("ae3");

const vfs = ae3.vfs;

var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "vfs command syntax:\r\n";
			for(var k in commands){
				s += "\t vfs " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	mounts : {
		args : "",
		help : "show VFS mount points for actual storages",
		run : function runMounts(args) {
			var ImplementStorage = require('java.class/ru.myx.ae3.vfs.ImplementStorage');
			var mounts = ImplementStorage.internGetAllMountPoints();
			console.sendMessage(Format.jsObjectReadable(mounts));
			return true;
		}
	},
	mount : {
		args : "<path> <fsType> [<fsArgs>... ]",
		help : "make VFS mount",
		run : function runMount(args) {
			var path = args.shift();
			if(!path){
				return console.fail("'path' argument is required");
			}
			var fsType = args.shift();
			if(!fsType){
				return console.fail("'fsType' argument is required");
			}
			
			var target = vfs.getRelative(path, null);
			if(!target?.isExist()){
				return console.fail("target vfs folder doesn't exist!");
			}
			if(!target.isContainer()){
				return console.fail("target vfs entry is not a container!");
			}
			
			var FilesystemTypes = require('./FilesystemTypes');
			var type = FilesystemTypes.getFilesystemType(fsType);
			if(!type){
				return console.fail("'fsType' argument of '"+fsType+"' denotes an unknown filesystem type");
			}
			
			var storage = FilesystemTypes.createFilesystem(fsType, args);
			if(!storage){
				throw new Error("No storage object created!");
			}

			return vfs.mount(
				target.parent, 
				target.key, 
				vfs.createRoot( storage ).toContainer()
			);
		}
	},
	unmount : {
		args : "<path>",
		help : "destroy VFS mount",
		run : function runUnmount(args) {
			const path = args.shift();
			if(!path){
				return console.fail("'path' argument is required");
			}

			const target = vfs.getRelative(path, null);
			if(!target?.isContainer()){
				if(!target?.isExist()){
					return console.fail("target vfs folder doesn't exist!");
				}
				return console.fail("target vfs entry is not a container!");
			}
			
			return vfs.unmount(target);
		}
	},
	types : {
		args : "",
		help : "list VFS filesystem types",
		run : function runTypes(args) {
			console.sendMessage(Format.jsObjectReadable(require("./FilesystemTypes").listFilesystemTypes()));
			return true;
		}
	},
	check : {
		args : "[<path>] [--all] [--fix] [--purge]",
		help : "check vfs files in given or current directory",
		run : function runCheck(args) {
			/**
			 * TODO: make 'find'-like java class to check each entry contents accessibility 
			 */
			return true;
		}
	},
	status : {
		args : "",
		help : "show VFS status (current state and statistics)",
		run : function runShow(args) {
			var Shell = require('ae3.util/Shell');
			return Shell.executeNativeInline(["cat", "/status/vfs/status.txt"]);

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

module.exports = {
	description : "'vfs' command",
	run : function() {
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
	}
};
