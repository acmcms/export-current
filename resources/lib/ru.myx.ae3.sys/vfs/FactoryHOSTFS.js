module.exports.create = function create(args){
	const path = args.shift();
	if(!path){
		throw new Error("'path' argument is required");
	}
	
	import java.io.File;
	const file = new File(path);
	if(!file.exists()){
		throw new Error(file + " does not exist!");
	}
	
	const rdOnly = args.shift();
	
	import ru.myx.ae3.vfs.filesystem.StorageImplFilesystem;
	return new StorageImplFilesystem(file, rdOnly);
};