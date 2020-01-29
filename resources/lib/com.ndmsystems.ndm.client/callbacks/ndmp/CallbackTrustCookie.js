const ae3 = require('ae3');

const CallbackTrustCookie = module.exports = ae3.Class.create(
	"CallbackTrustCookie",
	require("./../AbstractCallback"),
	function(args){
		this.group = args[1];
		this.cookie = args[2];
		this.timestamp = args[3];
		this.expiration = args[4];
		this.userData = args[5];
		this.signature = args[6];
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				const keys = component.confirmedMatingKeys;
				if(!keys){
					console.log(">>>>>> ndm.client:callback:ndmp/trustCookie: refused: no service link established %s, %s", this.group, this.cookie);
					return false;
				}
				
				// TODO: check signature
				
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log(">>>>>> ndm.client:callback:ndmp/trustCookie: %s, %s", this.group, this.cookie);
			}
		},
	}
);
