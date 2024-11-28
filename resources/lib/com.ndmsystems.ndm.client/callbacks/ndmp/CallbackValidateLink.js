const ae3 = require('ae3');

const CallbackValidateLink = module.exports = ae3.Class.create(
	"CallbackValidateLink",
	require("./../AbstractCallback"),
	function(args){
		this.intent = args[0];
		this.serviceId = args[1];
		this.deviceEcPublic = args[2];
		this.serviceEcPublic = args[3];
		this.timestampSeconds = args[4];
		this.ecSignature = args[5];
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				const pair = component.preparedMatingKeys;
				if(!pair){
					console.log("ndm.client::CallbackValidateLink:prepareCallback: refused: no mating keys prepared");
					return false;
				}
				
				// TODO: compare 
				
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackValidateLink:executeCallback: %s + %s", this.deviceEcPublic, this.serviceEcPublic);
				
				component.confirmMating(this.deviceEcPublic, this.serviceEcPublic);
			}
		},
	}
);
