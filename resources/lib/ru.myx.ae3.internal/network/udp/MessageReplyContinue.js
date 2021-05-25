const ae3 = require('ae3');

const MessageReplyContinue = module.exports = ae3.Class.create(
	/* name */
	"MessageReplyContinue",
	/* inherit */
	require('./MessageReply'),
	/* constructor */
	function(){
		// this.MessageReply();
		return this;
	},
	/* instance */
	{
		isReplyContinue : {
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
				return "[MessageReplyContinue]";
			}
		}
	}
);
