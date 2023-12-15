const MSG_RF_CACK = module.exports = require('ae3').Class.create(
	/* name */
	"MSG_RF_CACK",
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
			value : ___ECMA_IMPL_DEBUG___ 
				? function(){
					return "[CACK serial:" + this.serial + "]";
				}
				: function(){
					return "[CACK]";
				}
		}
	},
	/* static */
	{
		"parseBinaryMessage" : {
			value : function(b, o, s){
				return new MSG_RF_CACK(s);
			}
		},
		"toString" : {
			value : function(){
				return "MSG_RF_CACK";
			}
		}
	}
);
