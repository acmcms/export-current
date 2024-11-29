const ae3 = require('ae3');

/**
 * https://ndss.ndmsystems.com/documentation#cloud-callbacks
 */

const CallbackReject = module.exports = ae3.Class.create(
	"CallbackReject",
	require("./../AbstractCallback"),
	function(){
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackReject:executeCallback: rejected/refused (as desined)");
				return 0x03;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackReject:executeCallback: rejected? (should not be here, actually)");
			}
		},
	}
);
