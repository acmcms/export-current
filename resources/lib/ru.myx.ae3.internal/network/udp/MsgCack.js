const MsgCack = module.exports = require('ae3').Class.create(
	/* name */
	"MsgCack",
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
		"code" : {
			value : 0x37 // '7'.charCodeAt(0)
		},
		"isCACK" : {
			value : true
		},
		"isSUCCESS" : {
			value : true
		},
		"build" : {
			value : function(){
				return 0;
			}
		},
		"toString" : {
			value : function(){
				return "[MsgCack]";
			}
		}
	},
	/* static */
	{
		"parseBinaryMessage" : {
			value : function(b, o, s){
				return new MsgCack(s);
			}
		},
		"toString" : {
			value : function(){
				return "MsgCack";
			}
		}
	}
);
