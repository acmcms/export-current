const ae3 = require('ae3');


/**
 * Single target UDP communiction exchange. One request, none or several replies.
 * 
 */
const TaskUdpSingle = module.exports = ae3.Class.create(
	/* name */
	"TaskUdpSingle",
	/* inherit */
	ae3.net.CommunicationTask,
	/* constructor */
	/**
	 * if callback(task, result) function specified it will be called after task is 
	 * complete with 'result' argument is final reply of offLine, timedOut constants.
	 * 
	 * callback returns true to continue
	 * callback returns !true to stop
	 * 
	 * Otherwise message.onFinalReply (then: parent.onChildTaskFinished(task, result) 
	 * function will be used the same way.
	 */
	function(parent, peer, message, dontSend, callback, mode){
		if('function' === typeof callback){
			if(undefined === mode || "task-finished" === mode){
				this.onTaskFinishedCallback = callback;
			}else//
			if("task-progress" === mode){
				this.onTaskProgressCallback = callback;
			}else{
				throw "TaskUdpMultiple: InvalidMode: " + mode;
			}
		}else//
		if(callback){
			throw 'TaskUdpSingle: callback supposed to be a function or false!';
		}else{
			// continue without setting 'onTaskFinished' property
		}

		// 2 - no reply seen, 1 - reply seen, 0 - all done
		this.left = 2;

		this.CommunicationTask(parent);
		this.expire = Date.now() + (message.queryTTL || this.defaultQueryTtl);
		this.peer = peer;
		this.message = message;
		if(dontSend !== true){
			if(!peer.sendSingle(message)){
				delete this.left;
				if(false !== this.onTaskProgress(this.offlineReply)){
					this.onTaskFinished(this.offlineReply);
				}
				if(dontSend === null){
					return null;
				}
				return this;
			}
			this.logDetail("request", this.peerName, message);
		}

		/** serial may be set by peer.sendSingle at last */
		if(!(this.serial = message.serial)){
			throw 'TaskUdpSingle: serial should be known!';
		}

		peer.serialTxqQueue(this.serial, this);

		this.timer = TIMER_IMPL.bind(this);
		setTimeout(this.timer, ( this.retryDelay = (message.retryDelay || this.defaultRetryDelay) ));
		return this;
	},
	/* instance */
	{
		"serial" : {
			/**
			 * the task serial
			 */
			value : null
		},
		"left" : {
			/**
			 * 2 - active, no reply seen
			 * 1 - active, reply seen
			 * 0 - all done
			 */
			value : 0
		},
		"peerName" : {
			execute : "once", get : function(){
				return this.peer.name || this.peer.hostId || this.peer.keyHex || this.peer;
			}
		},
		/** 
		 * default query TTL (when not specified by: message.queryTTL)
		 */
		"defaultQueryTtl" : {
			value : 5000
		},
		"defaultRetryDelay" : {
			value : 600
		},
		"cancel" : {
			/**
			 * cancel
			 */
			value : ae3.Concurrent.wrapSync(function(){
				delete this.left;
			})
		},
		/**
		 * default implementation of onTaskFinished will put final reply in this property of task instance.
		 */
		"result" : {
			value : undefined
		},
		/** 
		 * all replies, return 'true' to continue, default implementation returns 'true' unless reply isReplyFinal;
		 * 
		 * internal, called from synchronized context, do not override yet.
		 */
		"onTaskProgress" : {
			value : function(result, /* locals: */ callback){
				if('function' === typeof (callback = this.onTaskProgressCallback)){
					return callback(this, result);
				}
				if(this.parent && 'function' === typeof (callback = this.parent.onChildTaskProgress)){
					return callback.call(this.parent, this, result);
				}
				if(!result){
					this.logError("no-reply", this.peerName, "No final reply");
					return null;
				}
				if(result.isReplyFinal){
					if(result.isFAILURE){
						this.logError("reply-final", this.peerName, result);
						return null;
					}
					this.logEvent("reply-final", this.peerName, result);
					return null;
				}
				if(result === this.offlineReply){
					this.logError("off-line", this.peerName, "Peer is off-line");
					return null;
				}
				if(result === this.timeoutReply){
					this.logError("time-out", this.peerName, "Wait timed-out");
					return null;
				}
				if(result.isFAILURE){
					this.logError("reply-fail", this.peerName, result);
					return true;
				}
				this.logEvent("reply", this.peerName, result);
				return true;
			}
		},
		/** used by default onEach implementation */
		"onTaskProgressCallback" : {
			value : null
		},
		/**
		 * resultReply is NULL or this.timedOut or this.offLine
		 * 
		 * default implementation of onTaskFinished, welcome to override.
		 * does: `this.result = reply` by default.
		 * 
		 */
		"onTaskFinished" : {
			value : function(result, /* locals: */ callback){
				if('function' === typeof (callback = this.onTaskFinishedCallback)){
					return callback(this, result);
				}
				if('function' === typeof (callback = this.onTaskProgressCallback)){
					return callback(this, null);
				}
				if('function' === typeof (callback = this.message.onFinalReplies)){
					return callback.call(this.message, this, result);
				}
				if(this.parent){
					if('function' === typeof (callback = this.parent.onChildTaskFinished)){
						return callback.call(this.parent, this, result);
					}
					if('function' === typeof (callback = this.parent.onChildTaskProgress)){
						return callback.call(this.parent, this, null);
					}
				}
				this.result ||= result;
				this.logDetail("task-finished", this.peerName, "Single task finished");
				return false;
			}
		},
		/** used by default onTaskFinished implementation */
		"onTaskFinishedCallback" : {
			value : null
		},
		"onDestroy" : {
			/**
			 * when timed out
			 */
			value : ae3.Concurrent.wrapSync(function(){
				if(0 === this.left){
					// console.log('>>> >>> %s: onDestroy: done.', this);
					return;
				}
				this.logDebug("on-destroy", "local", "unfinished task closed");
				delete this.left;
				setTimeout(this.onTaskFinished.bind(this, this.timeoutReply), 0);
			})
		},
		"onReceive" : {
			/**
			 * parse payload from the buffer, return message
			 */
			value : ae3.Concurrent.wrapSync(function(message){
				if(0 === this.left){
					// console.log('>>> >>> %s: onReceive, ignored, reply: %s', this, message);
					return;
				}
				// console.log('>>> >>> %s: onReceive, reply: %s', this, message);
				switch(this.onTaskProgress(message)){
				case true:
					// reply received means that send really succeed
					1 === this.left || (this.left = 1);
					return true;
				case false:
					delete this.left;
					return false;
				default:
					delete this.left;
					setTimeout(this.onTaskFinished.bind(this, message), 0);
					return false;
				}
			})
		},
		"toString" : {
			value : function(){
				return "[TaskUdpSingle " + Format.jsObject(this.peerName) + " / " + STAGE_MAP[this.left] + "]";
				return "[TaskUdpSingle " + Format.jsObject(this.peerName) + " " + this.message + " / " + STAGE_MAP[this.left] + "]";
			}
		}
	},
	/* static */
	{
		"DEFAULT_QUERY_TTL" : {
			value : 5000
		},
		"DEFAULT_RETRY_DELAY" : {
			value : 600
		},
		"sendOnce" : {
			value : function(peer, message){
				if(peer.sendSingle( message.serial ? message : Object.create(message) )){
					console.log('>>>>>> TaskUdpSingle: sendOnce, done, 1 messages sent, peers: 1, message: %s', message);
					return 1;
				} 
				
				console.log('>>>>>> TaskUdpSingle: sendOnce, done, 0 messages sent, peers: 1, message: %s', message);
				return 0;
			}
		}
	}
);


const STAGE_MAP = {
	"0" : "finished",
	"1" : "waiting",
	"2" : "started"
};

const FINISH_FN_CALL = function(result){
	if(false !== this.onTaskProgress(result)){
		this.onTaskFinished(result);
	}
};

const TIMER_IMPL = ae3.Concurrent.wrapSync(function(/* locals: */deadLine){
	if(!this.left){
		// console.log('>>> >>> %s: timer, already done', this);
		return;
	}
	deadLine = this.expire - Date.now() - 100;
	if(deadLine > 0){
		// reply seen, no need to re-send
		if(1 === this.left){
			// console.log('>>> >>> %s: timer, repeat', this);
			setTimeout(this.timer, deadLine + 100);
			return true;
		}
		if(this.peer.sendSingle(this.message)){
			this.logDetail("timer-repeat", this.peerName, this.message);
			// console.log('>>> >>> %s: timer, repeat', this);
			setTimeout(this.timer, ( this.retryDelay += (this.message.retryDelayGrow||0) ));
			return true;
		}
	}
	this.logDetail("expired", "timer", "task timeout expired");
	delete this.left;
	setTimeout(FINISH_FN_CALL.bind(this, this.timeoutReply), 0);
	return;
});
