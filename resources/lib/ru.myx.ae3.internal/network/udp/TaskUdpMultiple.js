const ae3 = require('ae3');
const Concurrent = ae3.Concurrent;
const Util = ae3.Util;

/**
 * Multiple target UDP communiction exchange. One request, none or several replies from none or several target peers.
 * 
 */
const TaskUdpMultiple = module.exports = ae3.Class.create(
	/* name */
	"TaskUdpMultiple",
	/* inherit */
	ae3.net.CommunicationTask,
	/* constructor */
	/**
	 * if callback(task, result) function specified it will be called after task is 
	 * complete with 'result' argument is an array of final reply of offLine, 
	 * timedOut constants of each peer.
	 * 
	 * callback returns true to continue with multiple task (and peer, if 'single-task-progress')
	 * callback returns null/undefined to continue with multiple task (but stop peer, if 'single-task-progress')
	 * callback returns false to finish with multiple task (and all peers)
	 * 
	 *  
	 * if 'mode' is one of:<br/>
	 * -- undefined, 'task-finished' - onChildTaskFinished(task, result)
	 * 
	 * -- 'task-progress' - onChildTaskProgress(task, childTask, result)
	 * 
	 * -- 'single-task-progress' - onChildTaskProgress(task, childTask, currentResult)
	 * 
	 * Otherwise message.onFinalReplies (then: parent.onChildTaskFinished(task, result) 
	 * function will be used the same way.
	 */
	/**
	 * @param peers - array of target peers of any UdpService
	 * @param message - the message to send, message.xxx
	 * @param callback - optional, function(task, result)
	 * @param mode - mode: undefined, "task-finished", "task-progress"
	 * @returns {@G}. NULL when nothing pending
	 */
	function TaskUdpMultiple(parent, peers, message, callback, mode){
		this.CommunicationTask(parent);
		this.expire = Date.now() + (message.queryTTL || this.defaultQueryTtl);
		this.message = message;

		if('function' === typeof callback){
			if(undefined === mode || "task-finished" === mode){
				this.onTaskFinishedCallback = callback;
			}else//
			if("task-progress" === mode){
				this.onSingleTaskFinishedCallback = callback;
			}else{
				throw "TaskUdpMultiple: InvalidMode: " + mode;
			}
		}else//
		if(callback){
			throw 'TaskUdpMultiple: callback supposed to be a function or false!';
		}else{
			// continue without setting 'onTaskFinished' property
		}

		const pending = this.pending = new Concurrent.HashMap();
		
		var peer, c = 0, single, m;
		for(peer of peers){
			m = message.serial ? message : Object.create(message);
			
			if(null !== (single = new this.TaskUdpSingle(
					this,
					peer,
					m, 
					null, 
					callbackImpl.bind(this)
				))){
				/** this.pending may be null-ed async-ly */
				pending.put(peer.key, single);
			}
			++ c;
		}

		if(c === 0){
			this.logFatal("invalid", "*", "no task, empty list of targets");
			return null;
		}
		
		if(null === this.pending){
			setTimeout(this.onTaskFinished.bind(this), 0);
			console.log("UDP::TaskUdpMultiple: %s: count: %s, null pending", this, c);
			return this;
		}
		if(pending.isEmpty()){
			this.pending = null;
			setTimeout(this.onTaskFinished.bind(this), 0);
			console.log("UDP::TaskUdpMultiple: %s: count: %s, nothing pending", this, c);
			return this;
		}
		{
			// assignment in arguments
			setTimeout( (this.timer = timerImpl.bind(this)) , 1000);
			console.log("UDP::TaskUdpMultiple: %s: count: %s, waiting for replies", this, c);
			return this;
		}
	},
	/* instance */
	{
		TaskUdpSingle : {
			value : require('./TaskUdpSingle')
		},
		/** 
		 * default query TTL (when not specified by: message.queryTTL)
		 */
		defaultQueryTtl : {
			value : 5200
		},
		/** 
		 * all peer final replies.
		 * return false to indicate last reply wanted, default implementation returns 'true';
		 * 
		 * override this method to route results or to stop when particular condition met.
		 */
		onSingleTaskFinished : {
			value : function(single, result, /* locals: */ callback){
				if('function' === typeof (callback = this.onSingleTaskFinishedCallback)){
					return callback(this, single, result);
				}
				if(this.parent && 'function' === typeof (callback = this.parent.onChildTaskProgress)){
					return callback.call(this.parent, this, single, result);
				}
				// this.logDebug("peer-done", single.peer, this.pending.size() + " left.");
				return null;
			}
		},
		/** used by default onSingleTaskFinished implementation */
		onSingleTaskFinishedCallback : {
			value : null
		},
		/**
		 * resultReply is NULL or this.timedOut or this.offLine
		 * 
		 * default implementation of onTaskFinished
		 * 
		 */
		onTaskFinished : {
			value : function(/* locals */callback){
				if('function' === typeof (callback = this.onTaskFinishedCallback)){
					return callback(this, this.result);
				}
				if('function' === typeof (callback = this.onSingleTaskFinishedCallback)){
					return callback(this, null, null);
				}
				if('function' === typeof (callback = this.message.onFinalReplies)){
					return callback.call(this.message, this, this.result);
				}
				if(this.parent){
					if('function' === typeof (callback = this.parent.onChildTaskFinished)){
						return callback.call(this.parent, this, this.result);
					}
					if('function' === typeof (callback = this.parent.onChildTaskFinished)){
						return callback.call(this.parent, this, null, this.result);
					}
				}
				// this.logDebug("multiple-done", "all done");
				return false;
			}
		},
		/** used by default onTaskFinished implementation */
		onTaskFinishedCallback : {
			value : null
		},
		/**
		 * cancel
		 */
		cancel : {
			value : Concurrent.wrapSync(function(/* locals: */ p){
				p = this.pending;
				if(p === null){
					return;
				}
				this.pending = null;
				this.AbstractTask.cancelAllAsync(p.values());
			})
		},
		toString : {
			value : function(/* locals: */ p){
				p = this.pending;
				if(p){
					return "[TaskUdpMultiple " + this.message + " / pending=" + p.size() + "]";
				}
				return "[TaskUdpMultiple " + this.message + " / done]";
			}
		}
	},
	/* static */
	{
		CountReplies : {
			execute : "once", get : function(){
				return require("./TaskUdpMultipleCountReplies");
			}
		},
		FirstPositive : {
			execute : "once", get : function(){
				return require("./TaskUdpMultipleFirstPositive");
			}
		},
		MapReplies : {
			execute : "once", get : function(){
				return require("./TaskUdpMultipleMapReplies");
			}
		},
		sendOnce : {
			value : function(peers, message){
				var c = 0, peer;
				for(peer of peers){
					if(peer.sendSingle( message.serial ? message : Object.create(message) )){
						++c;
					} 
				}
				
				console.log("UDP::TaskUdpMultiple:sendOnce: done, %s messages sent, peers: %s, message: %s", c, peers.length, message);
				return c;
			}
		}
	}
);



const callbackLast = Concurrent.wrapSync(function(singleTask){
	if(this.pending === null){
		// console.log("UDP::TaskUdpMultiple:callbackLast: %s: already done, singleTask: %s, reply: %s", this, singleTask, reply);
		return false;
	}
	
	this.pending.remove(singleTask.peer.key);
	
	if(this.timer !== undefined && this.pending.isEmpty()){
		this.pending = null;
		this.logDebug("complete", "*", "last: all replies collected");
		setTimeout(this.onTaskFinished.bind(this), 0);
	}

	return false;
});



const callbackStop = Concurrent.wrapSync(function(/* locals: */ p){
	if( (p = this.pending) === null){
		// console.log("UDP::TaskUdpMultiple:callbackStop: %s: already done");
		return false;
	}

	this.pending = null;
	this.AbstractTask.cancelAllAsync(p.values());
	this.logDebug("complete", "*", "stop: needed replies collected");

	// not to be executed while constructor is runnig
	if(this.timer !== undefined){
		setTimeout(this.onTaskFinished.bind(this), 0);
	}
	return false;
});



const callbackImpl = /* deadlock, need something like Concurrent.wrapSerialSyncThis() Concurrent.wrapSync( */function callbackImpl(singleTask, reply){
	if(this.pending === null){
		//// console.log("UDP::TaskUdpMultiple:callback: %s: already done, peer: %s, reply: %s", this, singleTask.peerName, reply);
		return;
	}
	
	if(null === reply || "string" === typeof reply){
		if(null === singleTask || false === this.onSingleTaskFinished(singleTask, reply)){
			//// console.log("UDP::TaskUdpMultiple:callback: %s: peer: %s, reply: %s, last reply.", this, singleTask.peerName, reply);
			return callbackStop.call(this);
		}
		return callbackLast.call(this, singleTask);
	}
	
	switch(this.onSingleTaskFinished(singleTask, reply)){
	case true:
		singleTask.expire < this.expire && (singleTask.expire = this.expire);
		//// console.log('UDP::TaskUdpMultiple:callback: %s: peer: %s, reply: %s, continue await.', this, singleTask.peerName, reply);
		return true;
	case false:
		//// console.log('UDP::TaskUdpMultiple:callback: %s: peer: %s, reply: %s, last reply.', this, singleTask.peerName, reply);
		return callbackStop.call(this);
	default:
		//// console.log('UDP::TaskUdpMultiple:callback: %s: peer: %s, reply: %s', this, singleTask.peerName, reply);
		return callbackLast.call(this, singleTask);
	}
}/* ) */;


const timerImpl = Concurrent.wrapSync(function(/* locals: */p, deadLine){
	if( (p = this.pending) === null){
		// console.log('UDP::TaskUdpMultiple:timer: %s: already done', this);
		return;
	}
	deadLine = this.expire - Date.now() - 100;
	if(deadLine > 0){
		//// console.log('UDP::TaskUdpMultiple:time: %s: repeat', this);
		setTimeout(this.timer, deadLine > 1100 ? 1100 : deadLine);
		// this.logDebug("continue", "*", "timer re-set");
		return;
	}

	this.logFatal("reply-timeout", "*", this.timeoutReply);
	this.pending = null;
	this.AbstractTask.cancelAllAsync(p.values());
	setTimeout(this.onTaskFinished.bind(this), 0);
});

