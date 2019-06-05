const ae3 = require('ae3');

const CallbackTrustCookie = module.exports = ae3.Class.create(
	"CallbackTrustCookie",
	require("./../AbstractCallback"),
	function CallbackTrustCookie(args){
		this.group = args[1];
		this.cookie = args[2];
		this.timestamp = args[3];
		this.expiration = args[4];
		this.userData = args[5];
		this.signature = args[6];
		return this;
	},
	{
		"executeCallback" : {
			value : function(client){
				console.log(">>>>>> ndm.client:callback:ndmp/trustCookie: %s, %s", this.group, this.cookie);
			}
		},
	}
);
