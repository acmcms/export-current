const ae3 = require("ae3");

const MessageReply = module.exports = ae3.Class.create(
	/* name */
	"MessageReply",
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
			value : false
		},
		isReply : {
			value : true
		},
		toString : {
			value : function(){
				return "[MessageReply]";
			}
		}
	}
);
