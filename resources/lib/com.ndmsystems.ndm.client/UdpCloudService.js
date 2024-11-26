const ae3 = require('ae3');
const Concurrent = ae3.Concurrent;
const FN_FORMAT_BINARY_AS_HEX = Format.binaryAsHex;

const UdpCloudService = ae3.Class.create(
	"UdpCloudService",
	ae3.net.udp.UdpService,
	function UdpCloudService(port){
		console.log("ndm.client::UdpCloudService:init: starting udp listening service on port %s.", (port || 4043));
		this.UdpService(port || 4043);
		Object.defineProperties(this, {
			"clients" : {
				// all for quick access
				value : new Concurrent.HashMap()
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
				this.clients.put(udpCloudClient.key, udpCloudClient);
				console.log(
					"ndm.client::UdpCloudService:registerClient: registered %s, %s, key: %s, valid: %s", 
					this, 
					udpCloudClient,
					FN_FORMAT_BINARY_AS_HEX(udpCloudClient.key),
					!!this.clients.get(udpCloudClient.key)
				);
			})
		},
		"removeClient" : {
			value : Concurrent.wrapSync(function(udpCloudClient){
				this.clients.remove(udpCloudClient.key);
				console.log(
					"ndm.client::UdpCloudService:removeClient: deleted %s, %s, key: %s", 
					this, 
					udpCloudClient,
					FN_FORMAT_BINARY_AS_HEX(udpCloudClient.key)
				);
			})
		},
		"resolvePeer" : {
			value : function(key){
				console.log(
					"ndm.client::UdpCloudService:resolvePeer: %s, key: %s", 
					this, 
					FN_FORMAT_BINARY_AS_HEX(key)
				);
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
