const ae3 = require('ae3');

const CallbackRegister = module.exports = ae3.Class.create(
	"CallbackRegister",
	require("./../AbstractCallback"),
	function CallbackRegister(args){
		this.reason = args[1] || 'callback';
		return this;
	},
	{
		"executeCallback" : {
			value : function(client){
				console.log(">>>>>> ndm.client:callback:cloud/register: reason=%s", this.reason);
				client.doRegister(this.reason);
			}
		},
	}
);
