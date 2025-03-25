const ae3 = require("ae3");

const TaskEvent = (function(){
	try{
		import ru.myx.ae3.internal.tasks.TaskEvent;
		console.log("TaskLogger:TaskEvent: java native implementation will be used.");
		return TaskEvent;
	}catch(e){
	}
	return require("./TaskEvent");
})();

const TaskLogger = module.exports = ae3.Class.create(
	"TaskLogger",
	undefined,
	function(task, mode){
		Object.defineProperties(this, {
			task : {
				value : task
			},
			mode : {
				value : mode
			},
			list : {
				value : []
			}
		});
		return this;
	},
	{
		list : {
			/**
			 * actual events recorded
			 */
			value : null
		},
		task : {
			/**
			 * owner task
			 */
			value : null
		},
		mode : {
			/**
			 * logger mode
			 */
			value : null
		},
		errorCount : {
			value : 0
		},
		alertCount : {
			value : 0
		},
		/** 'warning', hl="true"
		 *
		 * @param origin
		 * @param type
		 * @param peer
		 * @param detail
		 */
		logAlert : {
			value : function(origin, type, hl, peer, detail){
				(this.alertCount && (++ this.alertCount)) || (this.alertCount = 1);
				switch(this.mode){
				case "none":
					return;
				default:
					this.list.push(new TaskEvent(Date.now() - this.task.started, origin, type, hl, peer, detail));
					if(hl !== undefined){
						console.warn("Task: %s %s: %s: %s, hl:%s", origin, type, peer, detail, hl);
					}else{
						console.warn("Task: %s %s: %s: %s", origin, type, peer, detail);
					}
					return;
				}
			}
		},
		logDebug : {
			value : function(origin, type, hl, peer, detail){
				switch(this.mode){
				case "none":
					return;
				case "less":
					return;
				case "full":
					this.list.push(new TaskEvent(Date.now() - this.task.started, origin, type, hl, peer, detail));
					// fall-through
				default:
					if(hl !== undefined){
						console.log("Task: %s %s: %s: %s, hl:%s", origin, type, peer, detail, hl);
					}else{
						console.log("Task: %s %s: %s: %s", origin, type, peer, detail);
					}
					return;
				}
			}
		},
		logDetail : {
			value : function(origin, type, hl, peer, detail){
				switch(this.mode){
				case "none":
					return;
				case "less":
					return;
				case "more":
				case "full":
					this.list.push(new TaskEvent(Date.now() - this.task.started, origin, type, hl, peer, detail));
					// fall-through
				default:
					if(hl !== undefined){
						console.log("Task: %s %s: %s: %s, hl:%s", origin, type, peer, detail, hl);
					}else{
						console.log("Task: %s %s: %s: %s", origin, type, peer, detail);
					}
					return;
				}
			}
		},
		logError : {
			value : function(origin, type, hl, peer, detail){
				(this.errorCount && (++ this.errorCount)) || (this.errorCount = 1);
				switch(this.mode){
				case "none":
					return;
				default:
					this.list.push(new TaskEvent(Date.now() - this.task.started, origin, type, hl, peer, detail));
					if(hl !== undefined){
						console.error("Task: %s %s: %s: %s, hl:%s", origin, type, peer, detail, hl);
					}else{
						console.error("Task: %s %s: %s: %s", origin, type, peer, detail);
					}
					return;
				}
			}
		},
		logEvent : {
			value : function(origin, type, hl, peer, detail){
				switch(this.mode){
				case "none":
					return;
				default:
					this.list.push(new TaskEvent(Date.now() - this.task.started, origin, type, hl, peer, detail));
					if(hl !== undefined){
						console.log("Task: %s %s: %s: %s, hl:%s", origin, type, peer, detail, hl);
					}else{
						console.log("Task: %s %s: %s: %s", origin, type, peer, detail);
					}
					return;
				}
			}
		},
	},
	{
		checkCreateInstance : {
			value : function(){
				switch(this.log){
				case "none":
				case "less":
				case "normal":
				case "more":
				case "full":
					return this.taskLog = new TaskLogger(this, this.log);
				default:
				}
				if(!this.parent){
					return this.taskLog = new TaskLogger(this, "normal");
				}
				switch(this.parent.childrenLog){
				case "none":
				case "less":
				case "normal":
				case "more":
				case "full":
					return this.taskLog = new TaskLogger(this, this.parent.childrenLog);
				default:
				}
				return this.taskLog = this.parent.taskLogger;
			}
		},
		checkCreate : {
			value : function(task){
				return TaskLogger.checkCreateInstance.call(task);
			}
		},
	}
);
