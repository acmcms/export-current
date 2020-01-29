const ae3 = require('ae3');

/**
 * https://ndss.ndmsystems.com/documentation#register-callback
 */

const CallbackRegister = module.exports = ae3.Class.create(
	"CallbackRegister",
	require("./../AbstractCallback"),
	function(args){
		this.reason = args[1] || 'callback';
		return this;
	},
	{
		"executeCallback" : {
			value : function(component){
				console.log(">>>>>> ndm.client:callback:cloud/register: reason=%s", this.reason);
				component.client.doRegister(this.reason);
			}
		},
	}
);
