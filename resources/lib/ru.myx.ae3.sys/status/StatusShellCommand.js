module.exports = {
	description : "Status command",
	run : function() {
		var Shell = require('ae3.util/Shell');
		return Shell.executeNativeInline(["cat", "/status/status.txt"]);
	}
};
