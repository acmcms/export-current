

const AbstractEvent = module.exports = require("ae3").Class.create(
	"AbstractEvent",
	undefined,
	function(){
		return this;
	},
	{
		logDevel : {
			value : true
		},
		logDebug : {
			value : false
		},
		logNormal : {
			value : false
		},
		logNotice : {
			value : false
		},
		logAudit : {
			value : false
		},
		logError : {
			value : false
		},
		
		
	},
	{
	}
);
