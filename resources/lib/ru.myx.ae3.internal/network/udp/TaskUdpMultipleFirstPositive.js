const ae3 = require("ae3");
const Concurrent = ae3.Concurrent;

const TaskUdpMultipleFirstPositive = module.exports = ae3.Class.create(
	/* name */
	"TaskUdpMultipleFirstPositive",
	/* inherit */
	require('./TaskUdpMultiple'),
	/* constructor */
	function(parent, peers, message, onTaskFinished){
		return this.TaskUdpMultiple(parent, peers, message, onTaskFinished);
	},
	/* instance */
	{
		/**
		 * first positive task result
		 */
		result : {
			value : null
		},
		/**
		 * first positive result peer
		 */
		resultPeer : {
			value : undefined
		},
		isStopOnContinue : {
			value : false
		},
		onSingleTaskFinished : {
			value : function(single, result){
				if(null !== this.result){
					return false;
				}
				if(!result || !single){
					return null;
				}
				if(result.isFAILURE){
					this.logDetail("failure", single.peerName, "failure reply");
					return null;
				}
				if(result.isReplyFinal || this.isStopOnContinue){
					this.result = result;
					this.resultPeer ||= single.peer;
					this.logDetail("complete", single.peerName, "positive reply");
					return false;
				}
				if(result.isReplyContinue){
					this.logDetail("continue", single.peerName, "continue reply");
					return true;
				}
				{
					this.logDetail("unknown", single.peerName, "unclassified reply");
					return null;
				}
			}
		},
		toString : {
			value : function(/* locals: */ p){
				p = this.pending;
				if(p){
					return "[TaskUdpMultipleFirstPositive, message=" + this.message + ", pending=" + p.size() + "]";
				}
				return "[TaskUdpMultipleFirstPositive, message=" + this.message + ", done, map=" + this.result + "]";
			}
		}
	},
	/* static */
	{
		
	}
);
