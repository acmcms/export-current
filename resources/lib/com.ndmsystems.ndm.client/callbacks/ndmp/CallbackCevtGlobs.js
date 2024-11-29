const ae3 = require('ae3');

const CallbackCevtGlobs = module.exports = ae3.Class.create(
	"CallbackCevtGlobs",
	require("./../AbstractCallback"),
	function(args){
		this.intent = args[0];
		this.serviceId = args[1];
		this.eventsDelete = args[2];
		this.eventsUpsert = args[3];
		this.timestampSeconds = args[4];
		this.ecSignature = args[5];
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				const keys = component.confirmedMatingKeys;
				if(!keys){
					console.log("ndm.client::CallbackCevtGlobs:prepareCallback: refused: no service link established %s", this.serviceId);
					return false;
				}

				// TODO: check signature

				console.log("ndm.client::CallbackCevtGlobs:prepareCallback: not implemented");
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackCevtGlobs:executeCallback: not implemented");
			}
		},
	}
);
