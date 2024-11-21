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
				console.log("ndm.client::CallbackAuthenticateLink:prepareCallback: not implemented");
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackAuthenticateLink:executeCallback: not implemented");
			}
		},
	}
);
