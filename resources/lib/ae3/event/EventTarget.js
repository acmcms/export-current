
const EventTarget = module.exports = require("ae3").Class.create(
	"EventTarget",
	undefined,
	function(){
		return this;
	},
	{
		addEventListener : {
			value : function(evtTypeId, consumer, expiration){
			}
		},
		removeEventListener : {
			value : function(evtTypeId, consumer, expiration){
			}
		},
		
		dispatchEvent : {
			value : function(evtTypeId, eventArguments, relatedObject){
			}
		},
	},
	{
	}
);
