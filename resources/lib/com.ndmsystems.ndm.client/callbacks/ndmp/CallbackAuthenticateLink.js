const ae3 = require('ae3');

const CallbackAuthenticateLink = module.exports = ae3.Class.create(
	"CallbackAuthenticateLink",
	require("./../AbstractCallback"),
	function(args){
		this.intent = args[0];
		this.serviceId = args[1];
		this.loginName = args[2];
		this.passwordHash = args[3];
		this.serviceEcPublic = args[4];
		this.timestampSeconds = args[5];
		this.ecSignature = args[6];
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
