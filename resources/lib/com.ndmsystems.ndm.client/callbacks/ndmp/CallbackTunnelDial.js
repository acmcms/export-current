const ae3 = require('ae3');

const CallbackTunnelDial = module.exports = ae3.Class.create(
	"CallbackTunnelDial",
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
				console.log("ndm.client::CallbackTunnelDial:prepareCallback: refused: no service link established %s, %s", this.group, this.cookie);
				return false;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackTunnelDial:executeCallback: %s, %s", this.group, this.cookie);
			}
		},
	}
);
