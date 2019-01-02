
function runStatusCommand() {
	var Shell = require('ae3.util/Shell');
	return Shell.executeNativeInline(["cat", "/status/status.txt"]);
}

exports.run = runStatusCommand;
exports.description = "Status command";