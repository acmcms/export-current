

const EventType = module.exports = require("ae3").Class.create(
	"EventType",
	undefined,
	function(){
		return this;
	},
	{
		/** true/false - logged when logging level is 'devel' or higher */
		logDevel : {
			value : true
		},
		/** true/false - logged when logging level is 'debug' or higher */
		logDebug : {
			value : false
		},
		/** true/false - logged when logging level is 'normal' or higher */
		logNormal : {
			value : false
		},
		/** true/false - logged when logging level is 'notice' or higher */
		logNotice : {
			value : false
		},
		/** true/false - logged when logging level is 'audit' or higher */
		logAudit : {
			value : false
		},
		/** true/false - logged when logging level is 'error' or higher */
		logError : {
			value : false
		},
		
		/** argument list names */
		argumentNamesArray : {
			value : undefined
		},
	},
	{
	}
);
