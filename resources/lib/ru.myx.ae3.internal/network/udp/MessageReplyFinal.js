const ae3 = require('ae3');

const MessageReplyFinal = module.exports = ae3.Class.create(
	/* name */
	"MessageReplyFinal",
	/* inherit */
	require('./MessageReply'),
	/* constructor */
	function(){
		// this.MessageReply();
		return this;
	},
	/* instance */
	{
		isReplyFinal : {
			value : true
		},
		isRequest : {
			value : false
		},
		isReply : {
			value : true
		},
		toString : {
			value : function(){
				return "[MessageReplyFinal]";
			}
		}
	}
);
