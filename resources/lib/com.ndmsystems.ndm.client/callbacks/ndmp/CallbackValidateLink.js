const ae3 = require('ae3');

const CallbackValidateLink = module.exports = ae3.Class.create(
	"CallbackValidateLink",
	require("./../AbstractCallback"),
	function CallbackValidateLink(args){
		this.deviceEcPublic = args[1];
		this.serviceEcPublic = args[2];
		return this;
	},
	{
		"executeCallback" : {
			value : function(client){
				console.log(">>>>>> ndm.client:callback:ndmp/validateLink: %s + %s", this.deviceEcPublic, this.serviceEcPublic);
			}
		},
	}
);
