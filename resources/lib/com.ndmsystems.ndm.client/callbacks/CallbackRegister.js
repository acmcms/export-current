
function CallbackRegister(args){
	this.reason = args[1] || 'callback';
	return this;
}

CallbackRegister.prototype = Object.create(require("./AbstractCallback").prototype, {
	"CallbackRegister" : {
		value : CallbackRegister
	},
	"executeCallback" : {
		value : function(client){
			console.log(">>>>>> ndm.client:callback:register: reason=%s", this.reason);
			client.doRegister(this.reason);
		}
	},
	"toString" : {
		value : function(){
			return "[CallbackRegister]";
		}
	}
});


Object.defineProperties(CallbackRegister, {
	"toString" : {
		value : function(){
			return "[CallbackRegisterClass]";
		}
	}
});

module.exports = CallbackRegister;