
function AbstractCallback(args){
	return this;
}

AbstractCallback.prototype = Object.create(Object.prototype, {
	"AbstractCallback" : {
		value : AbstractCallback
	},
	"executeCallback" : {
		value : function(client){
			throw new Error("Should be overriden!");
		}
	},
	"toString" : {
		value : function(){
			return "[AbstractCallback]";
		}
	}
});


Object.defineProperties(AbstractCallback, {
	"toString" : {
		value : function(){
			return "[AbstractCallbackClass]";
		}
	}
});

module.exports = AbstractCallback;