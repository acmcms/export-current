module.exports.create = function create(args){
	const name = args.shift();
	if(!name){
		throw new Error("'name' argument is required for ramfs storage");
	}
	import ru.myx.ae3.vfs.ram.size.StorageImplMemorySize;
	return new StorageImplMemorySize(name);
};