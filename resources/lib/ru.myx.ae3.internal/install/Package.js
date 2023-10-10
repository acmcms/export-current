const ae3 = require('ae3');

const vfs = ae3.vfs;

const Codecs = ae3.Util.Codecs;

const Counter = ae3.Util.Counter;

/**
 * example commands:
 * 
 * time package install ae3.manuals
 * 
 * time package remove ae3.manuals
 * 
 * package list
 * 
 */


var BASE_SRC_URL = "https://myx.co.nz/distro/ae3/";


/**
 * TODO: register statically installed packages
 * 
 * @param name
 * @returns
 */
//



function installPackage(pkgName, repoUrl, pkgUrl, context){
	var vfsDataRoot = vfs.ROOT.relativeFolderEnsure("storage/data/pkg-db");

	var vfsInstalledPackages = vfsDataRoot.relativeFolderEnsure("installed");
	var vfsStorageReferences = vfsDataRoot.relativeFolderEnsure("reference");
	var vfsDestinationTarget = vfs.ROOT.relativeFolderEnsure("private");

	var binary;
	if(pkgUrl){
		console.log('Requesting binary package at ' + pkgUrl);
		binary = require('http').get.asBinary(pkgUrl);
	}else //
	if(repoUrl){
		pkgUrl = repoUrl + pkgName + ".tar.gz";
		console.log('Requesting binary package at ' + pkgUrl);
		try{
			binary = require('http').get.asBinary(pkgUrl);
		}catch(e){
			console.log('Binary package request at ' + pkgUrl + ' failed: ' + Format.jsDescibe(e));
		}
	}
	if(!binary){
		pkgUrl = BASE_SRC_URL + pkgName + ".tar.gz";
		console.log('Requesting binary package at ' + pkgUrl);
		binary = require('http').get.asBinary(pkgUrl);
	}
	console.log('Package received, length: ' + binary.length());
	var contents = Codecs.untargzToMap(binary);
	if(context.verbose){
		console.log('Package unpacked: ' + Format.jsDescribe(contents));
	}
	var packageJson = contents['package.json'];
	if(!packageJson){
		console.error("Package %s installation failed, no 'package.json' bundled.", pkgName);
		return false;
	}
	var packageInfo = JSON.parse(packageJson.toStringUtf8());
	if(packageInfo.name != pkgName){
		console.error("Package %s installation failed, package name doesn't match: %s", pkgName, packageInfo.name);
		return false;
	}
	
	/**
	 * TODO: start transaction
	 */
	//
	var vfsPackageRoot = vfsInstalledPackages.relativeFolder(pkgName);
	if(vfsPackageRoot.isExist() && !context.force){
		console.error("Package %s installation skipped, package is already installed", pkgName);
		return true;
	}

	var requires = packageInfo.requires;
	if(requires){
		var requirement, vfsRequirementRoot;
		for(requirement of Array(requires)){
			if(!context.force){
				vfsRequirementRoot = vfsInstalledPackages.relativeFolder(requirement);
				if(vfsRequirementRoot.isExist()){
					console.info("Skipping required '" + requirement + "' package, already installed!");
					continue;
				}
			}
			if(!installPackage(requirement, repoUrl, null, context)){
				return console.fail("Pre-required package '" + requirement + "' installation failed, can't continue.");
			}
		}
	}
	
	if(!vfsPackageRoot.isContainer() && !vfsPackageRoot.doSetContainer()){
		console.error("Package %s installation failed, can't create package root", pkgName);
		return false;
	}
	var vfsPackageCache = vfsPackageRoot.relativeFolderEnsure("cache");
	var pathName, vfsCached, vfsTarget, vfsReferences, binary, binaryMd5;
	for keys(pathName in contents){
		if(!pathName.startsWith("resources/") && !pathName.startsWith("settings/")){
			if(context.verbose){
				console.log("Package entry skipped: %s", pathName);
			}
			continue;
		}
		vfsCached = vfsPackageCache.relativeFile(pathName);
		vfsReferences = vfsStorageReferences.relativeFolder(pathName);
		vfsTarget = vfsDestinationTarget.relativeFile(pathName);
		
		binary = contents[pathName];
		binaryMd5 = Format.binaryAsHex(binary.messageDigest.digest());
		
		/**
		 * goes first for nice cleanups
		 */
		{
			if(!vfsCached.doSetPrimitive(true)){
				console.error("Package %s installation failed, can't create cache", pkgName);
				return false;
			}
		}
		if(vfsTarget.isFile()){
			if(context.force || binary.messageDigest == vfsTarget.toBinary().binary.messageDigest){
				if(!vfsReferences.isContainer()){
					if(!vfsReferences.doSetContainer()){
						console.error("Package %s installation failed, can't create reference folder", pkgName);
						return false;
					}
				}
				if(!vfsReferences.setContentPublicTreePrimitive(pkgName, true)){
					console.error("Package %s installation failed, can't create reference record", pkgName);
					return false;
				}
				if(context.force && binary.messageDigest != vfsTarget.toBinary().binary.messageDigest){
					vfsTarget.doSetBinary(binary);
				}
			}else{
				if(vfsReferences.isContainerEmpty()){
					console.warn("Package entry skipped: %s, exists outside of package management system", pathName);
					if(!vfsCached.doUnlink()){
						console.error("Package %s installation failed, can't clean cache", pkgName);
						return false;
					}
					continue;
				}
				console.error("Package %s installation failed, not yet", pkgName);
				return false;
			}
		}else//
		if(!vfsTarget.isExist()){
			if(!vfsReferences.isContainerEmpty()){
				console.warn("Package entry skipped: %s, supposed to exist according to a reference", pathName);
				if(!vfsCached.doUnlink()){
					console.error("Package %s installation failed, can't clean cache", pkgName);
					return false;
				}
				if(!context.force){
					continue;
				}
			}
			if(!vfsReferences.isContainer()){
				if(!vfsReferences.doSetContainer()){
					console.error("Package %s installation failed, can't create reference folder", pkgName);
					return false;
				}
			}
			if(!vfsReferences.setContentPublicTreePrimitive(pkgName, true)){
				console.error("Package %s installation failed, can't create reference record", pkgName);
				return false;
			}
			vfsTarget.doSetBinary(binary);
		}else{
			console.error("Package %s installation failed, target exists and not a file: %s", pkgName, String(vfsTarget));
			return false;
		}
	}
	/**
	 * TODO: commit transaction
	 */
	
	context.count.increment();
	console.info("Package %s installed", pkgName);

	return true;
}

function removePackage(pkgName){
	var vfsDataRoot = vfs.ROOT.relativeFolderEnsure("storage/data/pkg-db");

	var vfsInstalledPackages = vfsDataRoot.relativeFolderEnsure("installed");
	var vfsStorageReferences = vfsDataRoot.relativeFolderEnsure("reference");
	var vfsDestinationTarget = vfs.ROOT.relativeFolderEnsure("private");

	var vfsPackageRoot = vfsInstalledPackages.relativeFolder(pkgName);
	if(!vfsPackageRoot || !vfsPackageRoot.isExist()){
		console.error("Package %s removal failed, package is not installed", pkgName);
		return false;
	}
	if(vfsPackageRoot.isContainerEmpty()){
		if(!vfsPackageRoot.doUnlink()){
			console.error("Package %s removal failed, can't unlink empty package folder", pkgName);
			return false;
		}
		console.warn("Package %s removed, empty package folder", pkgName);
		return true;
	}
	var vfsPackageCache = vfsPackageRoot.relativeFolder("cache");
	if(!vfsPackageCache || !vfsPackageCache.isExist()){
		console.error("Package %s removal failed, package cache is not available", pkgName);
		return false;
	}
	
	function f(container, pathPrefix, vfsCached){
		var pathName = pathPrefix + '/' + vfsCached.key;
		var vfsReferences = vfsStorageReferences.relativeFolder(pathName);
		var vfsTarget = vfsDestinationTarget.relativeFile(pathName);
		if(vfsCached.isContainer()){
			vfs.forEach(vfsCached, f.bind(null, vfsCached, pathName));
			if(vfsCached.isContainerEmpty()){
				if(!vfsCached.doUnlink()){
					console.error("Package %s removal failed, can't unlink empty cached folder: %s", pkgName, String(vfsCached));
					return false;
				}
				if(vfsReferences.isContainerEmpty()){
					if(!vfsReferences.doUnlink()){
						console.error("Package %s removal failed, can't unlink empty reference folder: %s", pkgName, String(vfsReferences));
						return false;
					}
					if(!vfsTarget.isMount() && vfsTarget.isContainerEmpty()){
						if(!vfsTarget.doUnlink()){
							console.error("Package %s removal failed, can't unlink empty target: %s", pkgName, String(vfsTarget));
							return false;
						}
					}
				}
			}
			return;
		}
		
		if(!vfsReferences.isContainerEmpty()){
			if(!vfsReferences.setContentUndefined(pkgName)){
				console.error("Package %s removal failed, can't clean reference record: %s", pkgName, String(vfsReferences));
				return false;
			}
			if(vfsReferences.isContainerEmpty()){
				if(!vfsReferences.doUnlink()){
					console.error("Package %s removal failed, can't unlink reference folder: %s", pkgName, String(vfsReferences));
					return false;
				}
				if(!vfsTarget.isFile() || !vfsTarget.doUnlink()){
					console.error("Package %s removal failed, can't unlink target: %s", pkgName, String(vfsTarget));
					return false;
				}
			}
		}
		if(!vfsCached.doUnlink()){
			console.error("Package %s removal failed, can't unlink cached: %s", pkgName, String(vfsCached));
			return false;
		}
		return true;
	}
	
	vfs.forEach(vfsPackageCache, f.bind(null, vfsPackageCache, ""));
	
	if(vfsPackageCache.isContainerEmpty()){
		if(!vfsPackageCache.doUnlink()){
			console.error("Package %s removal failed, can't unlink empty package cache", pkgName);
			return false;
		}
	}

	if(vfsPackageRoot.isContainerEmpty()){
		if(!vfsPackageRoot.doUnlink()){
			console.error("Package %s removal failed, can't unlink empty package folder", pkgName);
			return false;
		}
	}

	return true;
}

var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args) {
			var s = "package command syntax:\r\n";
			for(var k in commands){
				s += "\t package " + k + " " + commands[k].args + "\r\n\t\t\t " + commands[k].help + "\r\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	install : {
		args : "[--force] [--verbose] [--url <url>] <packageNames...>",
		help : "install one or more packages",
		run : function install(args){
			var arg, repo, url, pkg, context = { 
				count : new Counter(),
			};
			for(;args.length;){
				arg = args.shift();
				if(arg === '--force' && !context.force){
					context.force = true;
					continue;
				}
				if(arg === '--verbose' && !context.verbose){
					context.verbose = true;
					continue;
				}
				
				if(arg === '--repo'){
					repo = args.shift();
					continue;
				}
				
				if(arg === '--url'){
					url = args.shift();
					pkg = args.shift();
				}else{
					url = undefined;
					pkg = arg;
				}
				if(!pkg){
					console.error("Package name expected!");
					return false;
				}
				installPackage(pkg, repo, url, context);
				force = false;
			}
			console.log("Packages installed: " + context.count);
			return true;
		}
	},
	remove : {
		args : "<packageNames...>",
		help : "removes one or more packges",
		run : function remove(args){
			args.forEach(removePackage, console);
			return true;
		}
	},
	info : {
		args : "<packageName>",
		help : "displays installed package info",
		run : function run(args){
			var pkgName = args.shift();
			if(!pkgName){
				return console.fail("'pkgName' argument is required!");
			}
			var vfsDataRoot = vfs.ROOT.relativeFolderEnsure("storage/data/pkg-db");
			var vfsInstalledPackages = vfsDataRoot.relativeFolderEnsure("installed");
			var vfsPackageRoot = vfsInstalledPackages.relativeFolder(pkgName);
			if(!vfsPackageRoot.isExist()){
				return console.fail("package '"+ pkgName +"' is not installed!");
			}
			printPackageLineVfs(vfsPackageRoot);
			return true;
		}
	},
	list : {
		args : "",
		help : "lists installed packages",
		run : function list(args){
			if(args.length){
				return console.fail("extra parameters to 'list' command!");
			}
			var vfsDataRoot = vfs.ROOT.relativeFolderEnsure("storage/data/pkg-db");
			var vfsInstalledPackages = vfsDataRoot.relativeFolderEnsure("installed");
	
			var array = vfsInstalledPackages.getContentCollection(null);
			array = array.filter(filterPackages);
			array.forEach(printPackageLineVfs, console);
			return true;
		}
	},
	search : {
		args : "",
		help : "lists all available packages",
		run : function list(args){
			if(!args.length){
				//
			}
			
			console.log('Requesting package list at ' + BASE_SRC_URL);
			var string = require('http').get.asString(BASE_SRC_URL);
			console.log('List received, length: ' + string.length());

			console.log('RESPONSE: ' + string);
			
			return console.fail("Not implemented yet!");
		}
	},
};

function filterPackages(entry) {
	return entry.isContainer();
}

function printPackageLineVfs(entry) {
	console.sendMessage(entry.key);
}


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
	
	var commandName = args.shift();
	var command = commands[commandName];
	if (!command) {
		return console.fail("unsupported command: %s", commandName);
	}
	return command.run(args);
};

exports.description = "Package manager";