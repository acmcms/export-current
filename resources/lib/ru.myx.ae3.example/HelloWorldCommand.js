var library = require("./HelloWorldLibrary");

function runHelloWorldCommand() {
	var message = library.getHelloWorldMessage();
	console.sendMessage(message);
	return true;
}

exports.run = runHelloWorldCommand;
exports.description = "'Hello World' example application.";