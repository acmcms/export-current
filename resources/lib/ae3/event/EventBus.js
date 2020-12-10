
const EventBus = module.exports = require("ae3").Class.create(
	"EventBus",
	undefined,
	function(){
		return this;
	},
	{
		/**
		 * evtTypeId - eg. "NBNF2"
		 * consumer - function(e){}
		 * expiration - now/delete (0), never (-1), unixtime millis from now (eg. 60000)
		 */
		updateSubscription : {
			value : function(evtTypeId, consumer, expiration){
			}
		},
		
		emitEvent : {
			value : function(evtTypeId, eventArguments, relatedObject){
			}
		},
	},
	{
	}
);
