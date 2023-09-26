const ae3 = require('ae3');

const Message = module.exports = ae3.Class.create(
	/* name */
	"Message",
	/* inherit */
	undefined,
	/* constructor */
	function(){
		return this;
	},
	/* instance */
	{
		/**
		 * message code byte
		 */
		code : {
			value : null
		},
		/**
		 * do we need to encrypt message payload
		 */
		encrypt : {
			value : false
		},
		/**
		 * override with proper boolean value
		 */
		isRequest : {
			value : undefined
		},
		/**
		 * override with proper boolean value
		 */
		isReply : {
			value : undefined
		},
		/**
		 * build payload in the buffer for this message, return length
		 */
		build : {
			value : function(buffer, offset){
				throw this + ': "build" method must be overriden, returns \'length\'!';
			}
		},
		toString : {
			value : function(){
				return "[UdpMessage, code=0x" + this.code.toString(16) + "]";
			}
		}
	},
	/* static */
	{
		/**
		 * parse payload from the buffer, return message
		 */
		parseBinaryMessage : {
			value : function(buffer, offset){
				throw this + ': "parseBinaryMessage" method must be overriden, returns \'message\'!';
			}
		},
		Request : {
			execute : "once", get : function(){
				return require('./MessageRequest');
			}
		},
		Reply : {
			execute : "once", get : function(){
				return require('./MessageReply');
			}
		},
		ReplyContinue : {
			execute : "once", get : function(){
				return require('./MessageReplyContinue');
			}
		},
		ReplyFinal : {
			execute : "once", get : function(){
				return require('./MessageReplyFinal');
			}
		},
		toString : {
			value : function(){
				return "[UdpMessageClass]";
			}
		}
	}
);
