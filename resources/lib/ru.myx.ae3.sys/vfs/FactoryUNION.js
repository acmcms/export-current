const vfs = require("ae3").vfs;

function mapEntryForPath(x){
	if("string" === typeof x){
		const entry = vfs.getRelative(x, null);
		if(!entry){
			throw new Error("Can't map to entry: " + x);
		}
		return entry;
	}
	return x;
}

module.exports.create = function create(args){
	if(!args || args.length < 2){
		throw new Error("more than one 'path' argument required");
	}
	import ru.myx.ae3.vfs.filesystem.StorageImplUnion;
	return new StorageImplUnion(args.map(mapEntryForPath));
};