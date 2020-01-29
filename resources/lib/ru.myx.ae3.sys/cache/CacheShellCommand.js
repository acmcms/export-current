module.exports = {
	description : "'cache' status command",
	run : function() {
		var Shell = require('ae3.util/Shell');
		return Shell.executeNativeInline(["cat", "/status/cache/status.txt"]);
		
		/**
		var StatusRegistry = require('java.class/ru.myx.ae3.status.StatusRegistry');
		var rootRegistry = StatusRegistry.ROOT_REGISTRY;
		var cache = rootRegistry.statusProviders.cache;
		var status = cache.status;
		console.sendMessage(status.title + ":\r\n" + Format.jsObjectReadable(status.statusAsMap));
		return true;
		**/
	}
};
