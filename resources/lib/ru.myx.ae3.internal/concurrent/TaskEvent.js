/**
 * 
 */

/** try native implementation first */
try{
	const TaskEvent = require("java.class/ru.myx.ae3.internal.tasks.TaskEvent");
	console.log("TaskLogger:TaskEvent: java native implementation will be used.");
	return module.exports = TaskEvent;
}catch(e){
	console.log("TaskLogger:TaskEvent: javascript implementation will be used.");
}

const ae3 = require("ae3");

const TaskEvent = module.exports = ae3.Class.create(
	"TaskEvent",
	undefined,
	function(elapsed, origin, type, variant, peer, detail){
		this.elapsed = elapsed;
		this.origin = String(origin);
		this.type = type;
		this.hl = variant;
		this.peer = String(peer);
		this.detail = String(detail);
	},
	{
		toString : {
			value : function(){
				return [this.origin, " ", this.type, " ", this.hl, ": ", this.peer, ": ", this.detail].join("");
			}
		}
	}
);
