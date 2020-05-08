const ae3 = require('ae3');
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
					this.logDetail("failure", single.peerName, "got failure reply");
					return null;
				}
				if(result.isReplyContinue && !this.isStopOnContinue){
					this.logDetail("continue", single.peerName, "got continue reply");
					return true;
				}
				this.result = result;
				this.resultPeer || (this.resultPeer = single.peer);
				this.logDetail("complete", single.peerName, "got positive reply");
				return false;
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
