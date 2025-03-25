const ae3 = require("ae3");
const Concurrent = ae3.Concurrent;

const TaskUdpMultiple = require('./TaskUdpMultiple');

const TaskUdpMultipleCountReplies = module.exports = ae3.Class.create(
	/* name */
	"TaskUdpMultipleCountReplies",
	/* inherit */
	TaskUdpMultiple,
	/* constructor */
	function(parent, peers, message, onTaskFinished){
		return this.TaskUdpMultiple(parent, peers, message, onTaskFinished);
	},
	/* instance */
	{
		failureCount : {
			value : 0
		},
		successCount : {
			value : 0
		},
		continueCount : {
			value : 0
		},
		unknownCount : {
			value : 0
		},
		isStopOnContinue : {
			value : false
		},
		onSingleTaskFinished : {
			value : function(single, result){
				if(!result){
					++ this.unknownCount;
					// this.logError("no-reply", single.peerName, "No final reply");
					return null;
				}
				if(result === this.offlineReply){
					++ this.unknownCount;
					// this.logError("off-line", single.peerName, "Peer is off-line");
					return null;
				}
				if(result === this.timeoutReply){
					++ this.unknownCount;
					// this.logError("time-out", single.peerName, "Wait timed-out");
					return null;
				}
				if(result.isFAILURE){
					++ this.failureCount;
					// this.logError("failure", single.peerName, result);
					return null;
				}
				if(result.isReplyContinue && !this.isStopOnContinue){
					++ this.continueCount;
					// this.logEvent("continue", single.peerName, result);
					return true;
				}
				if(result.isSUCCESS){
					++ this.successCount;
					// this.logEvent("success", single.peerName, result);
					return null;
				}
				{
					++ this.unknownCount;
					this.logEvent("unknown", single.peerName, "Unknown reply: " + result);
					return null;
				}
			}
		},
		toString : {
			value : function(/* locals: */ p){
				p = this.pending;
				if(p){
					return "[TaskUdpMultipleCountReplies, message=" + this.message + ", pending=" + p.size() + "]";
				}
				return "[TaskUdpMultipleCountReplies, message=" + this.message //
					+ ", done, success+failure+unknown=" //
					+ this.successCount + "+" + this.failureCount + "+" + this.unknownCount // 
				+ "]";
			}
		}
	},
	/* static */
	{
		
	}
);
