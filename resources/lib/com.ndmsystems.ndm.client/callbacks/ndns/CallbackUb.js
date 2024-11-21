const ae3 = require('ae3');

/**
 * ut\n<seconds>
 */

const CallbackUb = module.exports = ae3.Class.create(
	"CallbackUb",
	require("./../AbstractCallback"),
	function(args){
		this.delayS = args[1] || '5';
		this.reason = args[2] || 'ndns-ub';
		return this;
	},
	{
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackUb:executeCallback: delay=%s, reason=%s", this.delayS, this.reason);
				setTimeout( //
					component.client.doRegister.bind(component.client, this.reason), 
					1000 * (this.delayS|0)
				);
			}
		},
	}
);
