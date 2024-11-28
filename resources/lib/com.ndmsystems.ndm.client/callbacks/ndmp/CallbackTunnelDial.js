const ae3 = require('ae3');

const CallbackTunnelDial = module.exports = ae3.Class.create(
	"CallbackTunnelDial",
	require("./../AbstractCallback"),
	function(args){
		this.intent = args[0];
		this.serviceId = args[1];
		this.tunnelType = args[2];
		this.targetUrl = args[3];
		this.sessionToken = args[4];
		this.handshakeData = args[5];
		this.timestampSeconds = args[6];
		this.ecSignature = args[7];
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
				
				/** TODO: get addr and port from URL **/
				
				ae3.net.tcp.connect(this.targetAddr, this.targetPort, this.connectCallback.bind(this), {
					connectTimeout : 5000,
					reuseTimeout : 5000,
					reuseBuffer : 32,
					optionFastRead : true,
					optionClient : true
				});
			}
		},
	}
);
