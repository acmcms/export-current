const ae3 = require('ae3');
const Concurrent = ae3.Concurrent;

const UdpCloudService = ae3.Class.create(
	"UdpCloudService",
	ae3.net.udp.UdpService,
	function UdpCloudService(port){
		console.log("ndm.client::UdpCloudService:init: starting udp listening service on port %s.", (port || 4043));
		this.UdpService(port || 4043);
		Object.defineProperties(this, {
			clients : {
				// all for quick access
				value :  new Concurrent.HashMap()
			}
		});
		return this;
	},
	{
		"registerClient" : {
			/**
			 * UdpCloudClient
			 */
			value : Concurrent.wrapSync(function(udpCloudClient){
				console.log("ndm.client::UdpCloudService:registerClient: %s, %s", this, udpCloudClient);
				this.clients.put(udpCloudClient.key, udpCloudClient);
			})
		},
		"removeClient" : {
			value : Concurrent.wrapSync(function(udpCloudClient){
				console.log("ndm.client::UdpCloudService:removeClient: %s, %s", this, udpCloudClient);
				this.clients.remove(udpCloudClient.key);
			})
		},
		"resolvePeer" : {
			value : function(key){
				return this.clients.get(key);
			}
		},
		"toString" : {
			value : function(){
				return "[UdpCloudService, port=" + this.port + "]";
			}
		}
	}
);


module.exports = new UdpCloudService(5043);
