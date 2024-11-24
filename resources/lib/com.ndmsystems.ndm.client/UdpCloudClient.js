const ae3 = require('ae3');

const UdpCloudService = require('./UdpCloudService');

const UdpCloudClient = module.exports = ae3.Class.create(
	"UdpCloudClient",
	UdpCloudService.RemoteServicePrincipal,
	function UdpCloudClient(client, key, secret, serial){
		this.RemoteServicePrincipal(key, undefined, secret, serial);
		Object.defineProperties(this, {
			client : {
				value : client
			},
			targetSpec : {
				value : 'udp.' + client.ndssHost + ':4044'
			}
		});
		this.registerHandler(UdpCloudService.MSG_Q_CALL, require("./handlers/HandlerCall").bind(this));
		this.registerHandler(UdpCloudService.MSG_Q_RRST, require("./handlers/HandlerRrst").bind(this));
		console.log("ndm.client::UdpCloudClient:init: created %s", this);
		return this;
	},
	{
		"localSocketAddress" : {
			value : UdpCloudService.sock.localSocketAddress
		},
		"iface" : {
			value : UdpCloudService
		},
		"sendUdp" : {
			value : UdpCloudService.sendUdp
		},
		"start" : {
			value : function(){
				UdpCloudService.registerClient(this);
				this.RemoteServicePrincipal.prototype.start.call(this);
				console.log("ndm.client::UdpCloudClient:start: started %s", this);
			}
		},
		"destroy" : {
			value : function(){
				UdpCloudService.removeClient(this);
				this.RemoteServicePrincipal.prototype.destroy.call(this);
				console.log("ndm.client::UdpCloudClient:destroy: destroyed %s", this);
			}
		},
		"toString" : {
			value : function(){
				return [ "[UdpCloudClient, ", this.client, ", target=", this.targetSpec, ", service: ", UdpCloudService.port, ", key: ", this.keyHex, "]" ].join("");
				return [ "[UdpCloudClient, ", this.client, ", target=", this.targetSpec, ", ", UdpCloudService, "]" ].join("");
				return "[UdpCloudClient, " + this.client + ", target=" + this.targetSpec + ", " + UdpCloudService + "]";
			}
		}
	}
);
