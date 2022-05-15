const ae3 = require('ae3');

const CallbackAuthenticateLink = module.exports = ae3.Class.create(
	"CallbackAuthenticateLink",
	require("./../AbstractCallback"),
	function(args){
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				console.log(">>>>>> ndm.client:callback:ndmp/authenticateLink: prepare: not implemented");
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log(">>>>>> ndm.client:callback:ndmp/authenticateLink: execute: not implemented");
			}
		},
	}
);
