var library = require("./HelloWorldLibrary");

function handleHelloWorld(context) {
	var message = library.getHelloWorldMessage();
	return message;
}

exports.handle = handleHelloWorld;
exports.description = "'Hello World' example web share handler.";