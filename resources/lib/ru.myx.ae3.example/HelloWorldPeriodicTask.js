var library = require("./HelloWorldLibrary");

function getMessage() {
	return library.getHelloWorldMessage() + "\n(remove 'hello-world' service if you want to get rid of this message)";
}

exports.run = function task(){
	var message = getMessage();
	console.sendMessage(message);
	return true;
};

exports.description = "'Hello World' example periodic task.";