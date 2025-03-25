var lib = require('ru.myx.ae3.web.iface/Ae3WebService');

var vfs = require("ae3/vfs");

var VFS_RESOURCE_PATH = "resources/lib/ru.myx.ae3.web.iface/resource";

var vfsResource = vfs.UNION.relativeFolder(VFS_RESOURCE_PATH);

if(!vfsResource?.isExist()){
	throw "does not exist: union/" + VFS_RESOURCE_PATH;
}

function runResource(context){
	const query = context.query;
	const rest = query.resourceIdentifier.substr(1);
	if(!rest){
		return {
			layout : "message",
			content : "This is web-'resource' access folder, no index.",
		};
	}
	return vfsResource.relative(rest, null);
}

module.exports = runResource;
