var Discovery = require('java.class/ru.myx.ae3.discovery.Discovery');
var CollectConsole = require("ae3.util/CollectConsole");

var stopped = true;

function periodicDiscovery(){
	if(stopped){
		return;
	}
	setTimeout(periodicDiscovery, 30000);
	var collectConsole = new CollectConsole();
	Discovery.discover( collectConsole );
	var collected = collectConsole.getCollected();
	var errors = collected.some(function check(x){return x.state == "ERROR";});
	errors && console.log("AUTO-DISCOVERY: non default job output: \n\t" + Format.jsObject(collected));
}

exports.start = function start() {
	if (!stopped) {
		throw "already started";
	}
	var collectConsole = new CollectConsole();
	Discovery.discoveryOn(collectConsole);
	var collected = collectConsole.getCollected();
	stopped = false;
	console.warn(collected.length
		? "AUTO-DISCOVERY: while starting: console output: \n\t"
				+ Format.jsObject(collected)
		: "AUTO-DISCOVERY: stopped");
	setTimeout(periodicDiscovery, 1000);
};

exports.stop = function stop() {
	if (stopped) {
		throw "already stopped";
	}
	var collectConsole = new CollectConsole();
	Discovery.discoveryOff(collectConsole);
	stopped = true;
	var collected = collectConsole.getCollected();
	console.warn(collected.length
			? "AUTO-DISCOVERY: while stopping: console output: \n\t"
					+ Format.jsObject(collected)
			: "AUTO-DISCOVERY: started");
};
