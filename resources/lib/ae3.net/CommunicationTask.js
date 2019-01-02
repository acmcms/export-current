const ae3 = require('ae3');


const CommunicationTask = module.exports = ae3.Class.create(
	/* name */
	"CommunicationTask",
	/* inherit */
	ae3.Concurrent.AbstractTask,
	/* constructor */
	function CommunicationTask(parent){
		this.AbstractTask(parent);
		return this;
	},
	/* instance */
	{
		UdpService : {
			get : require.bind(null, "ae3.net/udp/UdpService")
		},
		offlineReply : {
			value : "off-line"
		},
		timeoutReply : {
			value : "time-out"
		}
	},
	/* static */
	{
		REPLY_OFFLINE : {
			value : "off-line"
		},
		REPLY_TIMEOUT : {
			value : "time-out"
		},
	}
);