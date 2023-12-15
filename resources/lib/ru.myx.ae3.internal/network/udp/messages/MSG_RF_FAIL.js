const MSG_RF_FAIL = module.exports = require('ae3').Class.create(
	/* name */
	"MSG_RF_FAIL",
	/* inherit */
	require('./../Message').ReplyFinal,
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
			value : ___ECMA_IMPL_DEBUG___ 
				? function(){
					return "[FAIL serial:" + this.serial + "]";
				}
				: function(){
					return "[FAIL]";
				}
		}
	},
	/* static */
	{
		"parseBinaryMessage" : {
			value : function(b, o, s){
				return new MSG_RF_FAIL(s);
			}
		},
		"toString" : {
			value : function(){
				return "MSG_RF_FAIL";
			}
		}
	}
);
