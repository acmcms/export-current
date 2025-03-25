const MSG_Q_MEET = module.exports = require("ae3").Class.create(
	/* name */
	"MSG_Q_MEET",
	/* inherit */
	require('./../Message').Request,
	/* constructor */
	function(){
		// this.MessageRequest();
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x39 // '9'.charCodeAt(0)
		},
		serial : {
			value : 0x00FFFFF0
		},
		isUHP_FROM_SERVER : {
			value : true
		},
		isUHP : {
			value : true
		},
		isMEET : {
			value : true
		},
		build : {
			value : function(){
				return 0;
			}
		},
		toString : {
			value : function(){
				return "[MEET]";
			}
		}
	},
	/* static */
	{
		"parseBinaryMessage" : {
			value : function(){
				return new MSG_Q_MEET();
			}
		},
		"toString" : {
			value : function(){
				return "MSG_Q_MEET";
			}
		}
	}
);
