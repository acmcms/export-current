/**
 * CollectConsole is the virtual shell console what collects messages and allows 
 * to access all messages later.
 * 
 * TODO: merge console out and ctx.output and change ConsoleCollector accordingly
 */

// var Collector = Object.create(require('java.class/ru.myx.ae3.console.ConsoleCollector'));
var Collector = require('java.class/ru.myx.ae3.console.ConsoleCollector');

module.exports = Collector;
return;

/**
 * 
 * 
 * Following is not ready yet
 * 
 * 
 * 
 */

function CollectorObject(){
	this.c = new Collector();
	return this;
}

const PROTOTYPE = CollectorObject.prototype = {
	layout : 'string'
};

Object.defineProperty(PROTOTYPE, "fail", {
	value : function fail(){
		this.sendMessage.apply(this, arguments);
		return false;
	}
});

/**<code>
Collector.prototype.fail = Collector.fail = function fail(){
	console.log("rq-collector: Collectr: %s, it's prototype: %s", Collector, Collector.prototype);
	this.sendMessage.apply(this, arguments);
	return false;
};
</code>*/

module.exports = CollectorObject;