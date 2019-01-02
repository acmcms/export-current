const MsgFail = module.exports = require('ae3').Class.create(
	/* name */
	"MsgFail",
	/* inherit */
	require('./Message').ReplyFinal,
	/* constructor */
	function(serial){
		// this.MessageReplyFinal();
		this.serial = serial;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x66 // 'f'.charCodeAt(0)
		},
		isFAIL : {
			value : true
		},
		isFAILURE : {
			value : true
		},
		build : {
			value : function(){
				return 0;
			}
		},
		toString : {
			value : function(){
				return "[MsgFail]";
			}
		}
	},
	/* static */
	{
		"parse" : {
			value : function(b, o, s){
				return new MsgFail(s);
			}
		},
		"toString" : {
			value : function(){
				return "MsgFail";
			}
		}
	}
);
