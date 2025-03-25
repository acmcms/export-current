const ae3 = require("ae3");

const CallbackTrustCookie = module.exports = ae3.Class.create(
	"CallbackTrustCookie",
	require("./../AbstractCallback"),
	function(args){
		this.intent = args[0];
		this.serviceId = args[1];
		this.accessRole = args[2];
		this.cookieText = args[3];
		this.expiresAtSeconds = args[4];
		this.userData = args[5];
		this.timestampSeconds = args[6];
		this.ecSignature = args[7];
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				const keys = component.confirmedMatingKeys;
				if(!keys){
					console.log("ndm.client::CallbackTrustCookie:prepareCallback: refused: no service link established %s", this.serviceId);
					return false;
				}
				
				// TODO: check signature
				
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackTrustCookie:executeCallback: %s, %s", this.accessRole, this.cookieText);
			}
		},
	}
);
