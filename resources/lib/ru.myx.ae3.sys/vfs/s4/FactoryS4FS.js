
module.exports.create = function create(args){
	const vfs = require("ae3").vfs;
	const storageTypeName = args.shift();
	if(!storageTypeName){
		throw new Error("'storageType' argument required!");
	}
	import ru.myx.ae3.vfs.s4.common.S4StoreType;
	const storageType = S4StoreType.forName(storageTypeName);
	if(!storageType){
		throw new Error("'storageType' " + storageTypeName + " in unknown!");
	}
	
	const driverTypeName = args.shift();
	if(!driverTypeName){
		throw new Error("'driverType' argument required!");
	}
	
	const DriverTypes = require('./DriverTypes');
	const driver = DriverTypes.createDriver(driverTypeName, args);
	if(!driver){
		throw new Error("Failed to create driver instance for " + driverTypeName);
	}
	
	import ru.myx.ae3.vfs.s4.lcl.S4LocalDriver;
	import ru.myx.ae3.vfs.s4.StorageImplS4;
	
	return new StorageImplS4( new S4LocalDriver( driver, storageType ) );
};