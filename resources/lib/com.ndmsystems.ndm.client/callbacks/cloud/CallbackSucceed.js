const ae3 = require('ae3');

/**
 * https://ndss.ndmsystems.com/documentation#cloud-callbacks
 */

const CallbackSucceed = module.exports = ae3.Class.create(
	"CallbackSucceed",
	require("./../AbstractCallback"),
	function(){
		return this;
	},
	{
		"executeCallback" : {
			value : function(component){
				console.log(">>>>>> ndm.client:callback:cloud/succeed");
			}
		},
	}
);
