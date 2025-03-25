const ae3 = require("ae3");

const MessageRequest = module.exports = ae3.Class.create(
	/* name */
	"MessageRequest",
	/* inherit */
	require('./Message'),
	/* constructor */
	function(){
		// this.Message();
		return this;
	},
	/* instance */
	{
		isRequest : {
			value : true
		},
		isReply : {
			value : false
		},
		toString : {
			value : function(){
				return "[MessageRequest]";
			}
		}
	}
);
