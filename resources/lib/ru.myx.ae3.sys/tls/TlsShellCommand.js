module.exports = {
	description : "'tls' status command",
	run : function() {
		var Shell = require('ae3.util/Shell');
		return Shell.executeNativeInline(["cat", "/status/tls/status.txt"]);

		/**
		var StatusRegistry = require('java.class/ru.myx.ae3.status.StatusRegistry');
		var rootRegistry = StatusRegistry.ROOT_REGISTRY;
		var tls = rootRegistry.statusProviders.tls;
		var status = tls.status;
		console.sendMessage(status.title + ":\r\n" + Format.jsObjectReadable(status.statusAsMap));
		return true;
		**/
	}
};
