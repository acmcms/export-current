const vfs = require('ae3').vfs;

module.exports.create = function create(args){
	const path = args.shift();
	if(!path){
		throw new Error("'path' argument is required");
	}
	
	const entry = vfs.getRelative(path, null);
	if(!entry || !entry.isBinary()){
		throw new Error("Can't find zip: " + path);
	}

	const identity = vfs.getAbsolutePath(entry);
	const binary = entry.binaryContent;
	const modified = entry.lastModified;
	
	import ru.myx.ae3.vfs.zip.StorageImplZip;
	return new StorageImplZip(identity, binary, modified);
};