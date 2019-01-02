
function CallbackSucceed(){
	return this;
}

CallbackSucceed.prototype = Object.create(require("./AbstractCallback").prototype, {
	"CallbackSucceed" : {
		value : CallbackSucceed
	},
	"executeCallback" : {
		value : function(client){
			console.log(">>>>>> ndm.client:callback:succeed");
		}
	},
	"toString" : {
		value : function(){
			return "[CallbackSucceed]";
		}
	}
});


Object.defineProperties(CallbackSucceed, {
	"toString" : {
		value : function(){
			return "[CallbackSucceedClass]";
		}
	}
});

module.exports = CallbackSucceed;