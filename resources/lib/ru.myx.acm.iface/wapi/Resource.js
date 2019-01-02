var vfs = require('ae3/vfs');

var VFS_RESOURCE_PATH = "resources/lib/ru.myx.acm.iface/resource";

var vfsResource = vfs.UNION.relativeFolder(VFS_RESOURCE_PATH);

if(!vfsResource || !vfsResource.isExist()){
	throw "does not exist: union/" + VFS_RESOURCE_PATH;
}

function runResource(context){
	const query = context.query;
	const rest = query.resourceIdentifier.substr(1);
	if(!rest){
		return {
			layout : "message",
			cone : 404,
			content : "This is web-'resource' access folder, no index.",
		};
	}
	if(rest === 'documentation.xml'){
		const ACM = require('ru.myx.acm.iface/ACM');
		const pass = query.parameters.pass;
		if(pass){
			var stats = ACM.getSettings().docs;
			if(pass !== stats.pass){
				throw context.share.layoutAccessDeniedUnmaskable(query, "Access denied: invalid access key!");
			}
			context.client = "stats-bot";
		}else{
			context.share.authRequireAccount(context, 'admin');
		}
	}
	return vfsResource.relative(rest, null);
}

module.exports = runResource;
