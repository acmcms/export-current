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
		onSingleTaskFinished : {
			value : function(single, result){
				this.result.put(single.peer.key, result);
				this.logDetail("peer-reply", single.peerName, this.pending.size() + " left.");
				return true;
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
