
module.exports.create = function(spec){
	
	const args = spec.split(':');

	const fs = args.shift();
	if(!fs){
		throw "Invalid VFS filesystem spec: " + spec;
	}

	const vfs = require('ae3/vfs');
	const dsc = vfs.UNION.relativeFile("settings/system/vfs/type/" + fs + ".json");

	if(!dsc.isExist()){
		throw "Fs '" + fs + "' is unknown!";
	}

	const obj = JSON.parse(dsc.text);

	if(!obj.reference){
		throw "Fs '" + fs + "' has no valid impl reference!";
	}
	
	const drv = require(obj.reference);
	
	return drv.create(args);
};
