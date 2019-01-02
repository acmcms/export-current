
function runNioCommand() {
	var Shell = require('ae3.util/Shell');
	return Shell.executeNativeInline(["cat", "/status/nio/status.txt"]);
	
	/**
	var StatusRegistry = require('java.class/ru.myx.ae3.status.StatusRegistry');
	var rootRegistry = StatusRegistry.ROOT_REGISTRY;
	var nio = rootRegistry.statusProviders.nio;
	var status = nio.status;
	console.sendMessage(status.title + ":\r\n" + Format.jsObjectReadable(status.statusAsMap));
	return true;
	**/
}

exports.run = runNioCommand;
exports.description = "'nio' status command";