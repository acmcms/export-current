const ae3 = require('ae3');

const CallbackValidateLink = module.exports = ae3.Class.create(
	"CallbackValidateLink",
	require("./../AbstractCallback"),
	function(args){
		this.deviceEcPublic = args[1];
		this.serviceEcPublic = args[2];
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				const pair = component.preparedMatingKeys;
				if(!pair){
					console.log(">>>>>> ndm.client:callback:ndmp/validateLink: refused: no mating keys prepared");
					return false;
				}
				
				// TODO: compare 
				
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log(">>>>>> ndm.client:callback:ndmp/validateLink: %s + %s", this.deviceEcPublic, this.serviceEcPublic);
				
				component.confirmMating(this.deviceEcPublic, this.serviceEcPublic);
			}
		},
	}
);
