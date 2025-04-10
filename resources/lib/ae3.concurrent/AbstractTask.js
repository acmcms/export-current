const ae3 = require("ae3");

/**
 * The Task is the local temporary memory record that is waiting for asynchronous
 * reply. The Task is called at least once when it times out: task.cancel().
 * 
 * @returns {@G}
 */


const AbstractTask = module.exports = ae3.Class.create(
	/* name */
	"AbstractTask",
	/* inherit */
	undefined,
	/* constructor */
	function AbstractTask(parent){
		if(parent){
			this.parent = parent;
		}
		this.started = Date.now();
		return this;
	},
	/* instance */
	{
		cancel : {
			value : function(){
				console.log("Async::AbstractTask: " + this + ", cancel");
			}
		},
		parent : {
			/**
			 * parent task, if any
			 */
			value : null
		},
		started : {
			/**
			 * the date task started
			 */
			value : null
		},

		
		
		log : {
			/**
			 * Logging mode:
			 * 
			 * default - use parent
			 * full - all events
			 * more - more than normal
			 * normal - normal, default mode
			 * less - less than normal
			 * none - no events logged
			 */
			value : "default"
		},
		taskLog : {
			value : null
		},
		errorCount : {
			get : function(){
				return this.taskLog?.errorCount ?? 0;
			}
		},
		warningCount : {
			get : function(){
				return this.taskLog?.alertCount ?? 0;
			}
		},
		/** redirection logger (task or ) */
		taskLogger : (
			function(){
				try{
					import ru.myx.ae3.internal.tasks.TaskLog;
					if("function" === typeof TaskLog.checkCreate){
						console.log("Async::AbstractTask:taskLogger: java native implementation will be used.");

						/** native implementation will cache 'taskLogger' instance in 'taskLog' field of this **/
						return {
							get : TaskLog.checkCreate
						};
					}
				}catch(e){
					// ignore exception, fall-through
				}
				
				/** base implementation will create 'taskLogger' instance, so using 'once' **/
				return {
					execute : "once", 
					get : require("ru.myx.ae3.internal/concurrent/TaskLogger").checkCreateInstance
				};
			}
		)(),
		/**
		 * 
		 */
		logAlert : {
			value : function(eventType, eventPeer, eventDetail){
				return this.taskLogger.logAlert(this, eventType, true, eventPeer, eventDetail);
			}
		},
		/**
		 * 
		 */
		logError : {
			value : function(eventType, eventPeer, eventDetail){
				return this.taskLogger.logError(this, eventType, "error", eventPeer, eventDetail);
			}
		},
		/**
		 * 
		 */
		logDebug : {
			value : function(eventType, eventPeer, eventDetail){
				return this.taskLogger.logDebug(this, eventType, "disabled", eventPeer, eventDetail);
			}
		},
		/**
		 * `Detail` is almost like `Event` but contains deducable redundant information for better verbosity
		 */
		logDetail : {
			value : function(eventType, eventPeer, eventDetail){
				return this.taskLogger.logDetail(this, eventType, "local", eventPeer, eventDetail);
			}
		},
		/**
		 * 
		 */
		logEvent : {
			value : function(eventType, eventPeer, eventDetail){
				return this.taskLogger.logEvent(this, eventType, undefined, eventPeer, eventDetail);
			}
		},
		/**
		 * 
		 */
		logFatal : {
			value : function(eventType, eventPeer, eventDetail){
				return this.taskLogger.logError(this, eventType, "alert", eventPeer, eventDetail);
			}
		},
		/**
		 * 
		 */
		logFinal : {
			value : function(eventType, eventPeer, eventDetail){
				return this.taskLogger.logEvent(this, eventType, "false", eventPeer, eventDetail);
			}
		},
		/**
		 * 
		 */
		makeTaskLogLayout : {
			value : function(optional, /* locals: */taskLog){
				if( !(taskLog = this.taskLog) ){
					return undefined;
				}
				if(optional && !taskLog.errorCount && !taskLog.alertCount){
					return undefined;
				}
				taskLog = taskLog.list;
				if(!taskLog || 0 === taskLog.length){
					return undefined;
				}
				return {
					layout : "data-list",
					columns : [
						{
							id : "type",
							title : "Type"
						},
						{
							id : "peer",
							title : "Peer"
						},
						{
							id : "detail",
							title : "Detail"
						},
						{
							id : "elapsed",
							title : "Time",
							variant : "period",
							scale : 1
						}
					],
					rows : taskLog
				};
			}
		},

		/** redirection logger */
		exportLogger : {
			get : function(){
				return this.parent?.exportLogger;
			}
		},
		logExport : {
			value : function(eventType, eventColumns){
				if("function" === typeof this.exportLogger){
					return this.exportLogger(eventType, eventColumns);
				}
			}
		},
		
		toString : {
			value : function(){
				return "[AbstractTask]";
			}
		}
	},
	/* static */
	{
		UI_TASK_LOG_DETAIL_NAME : {
			value : "loggingDetail"
		},
		UI_TASK_LOG_DETAIL_FIELD : {
			value : {
				"name" : "loggingDetail",
				"id" : "loggingDetail",
				"title" : "Logging Detail",
				"type" : "select",
				"variant" : "select",
				"default" : "normal",
				"value" : "normal",
				"options" : [
					{
						title : "none - No Detail",
						value : "none"
					},
					{
						title : "less - Less Detail",
						value : "less"
					},
					{
						title : "norm - Normal Detail",
						value : "normal"
					},
					{
						title : "more - More Detail",
						value : "more"
					},
					{
						title : "full - Full Detail",
						value : "full"
					},
				]
			}
		},
		TaskParent : {
			value : {
				LoggingDetailNone : {
					childrenLog : "none"
				},
				LoggingDetailLess : {
					childrenLog : "less"
				},
				LoggingDetailMore : {
					childrenLog : "more"
				},
				LoggingDetailFull : {
					childrenLog : "full"
				},
			}
		},
		fakeTaskForQueryParameters : {
			value : function(parameters){
				switch(parameters.loggingDetail){
				case "none":
					return AbstractTask.TaskParent.LoggingDetailNone;
				case "less":
					return AbstractTask.TaskParent.LoggingDetailLess;
				case "normal":
					return null;
				case "more":
					return AbstractTask.TaskParent.LoggingDetailMore;
				case "full":
					return AbstractTask.TaskParent.LoggingDetailFull;
				}
				return AbstractTask.TaskParent.LoggingDetailLess;
			}
		},
		/**
		 * <code>
			for(var task of tasks){
				task.cancel();
			}
		 * </code>
		 */
		cancelAll : {
			value : function(tasks, task){
				for(task of tasks){
					task?.cancel?.();
				}
			}
		},
		cancelAllAsync : {
			value : function(tasks){
				setTimeout(AbstractTask.cancelAll, 0, tasks);
				// ae3.Concurrent.wrapAsync?
				// for(var task of tasks){
				//	task.cancel();
				// }
			}
		}
	}
);



