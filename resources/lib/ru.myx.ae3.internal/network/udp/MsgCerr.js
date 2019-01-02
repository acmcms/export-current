const MsgCerr = module.exports = require('ae3').Class.create(
	/* name */
	"MsgCerr",
	/* inherit */
	require('./Message').ReplyFinal,
	/* constructor */
	function(serial, errorCode){
		// this.MessageReplyFinal();
		this.serial = serial;
		this.errorCode = errorCode;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x36 // '6'.charCodeAt(0)
		},
		isCERR : {
			value : true
		},
		isFAILURE : {
			value : true
		},
		build : {
			value : function(b, o){
				b[o] = this.errorCode & 0xFF;
				return 1;
			}
		},
		toString : {
			value : function(){
				return "[MsgCerr 0x" + (this.errorCode|0).toString(16) + "]";
			}
		}
	},
	/* static */
	{
		"parse" : {
			value : function(b, o, s){
				return new MsgCerr(s, b[o]);
			}
		},
		"toString" : {
			value : function(){
				return "MsgCerr";
			}
		}
	}
);
