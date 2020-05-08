const ae3 = require('ae3');
const Concurrent = ae3.Concurrent;

const TaskUdpMultiple = require('./TaskUdpMultiple');

const TaskUdpMultipleMapReplies = module.exports = ae3.Class.create(
	/* name */
	"TaskUdpMultipleMapReplies",
	/* inherit */
	TaskUdpMultiple,
	/* constructor */
	function(parent, peers, message, onTaskFinished){
		this.result = new Concurrent.HashMap();
		return this.TaskUdpMultiple(parent, peers, message, onTaskFinished);
	},
	/* instance */
	{
		isStopOnContinue : {
			value : false
		},
		onSingleTaskFinished : {
			value : function(single, result){
				if(!result || !single){
					return null;
				}
				this.result.put(single.peerName || single.peer.key, result);
				if(result.isReplyContinue && !this.isStopOnContinue){
					this.logDetail("peer-continue", single.peerName, this.pending.size() + " left.");
					return true;
				}
				{
					this.logDetail("peer-reply", single.peerName, this.pending.size() + " left.");
					return null;
				}
			}
		},
		toString : {
			value : function(/* locals: */ p){
				p = this.pending;
				if(p){
					return "[TaskUdpMultipleMapReplies, message=" + this.message + ", pending=" + p.size() + "]";
				}
				return "[TaskUdpMultipleMapReplies, message=" + this.message + ", done, map=" + this.result + "]";
			}
		}
	},
	/* static */
	{
		
	}
);
