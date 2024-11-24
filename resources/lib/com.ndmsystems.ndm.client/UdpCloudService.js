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
				console.log(
					"ndm.client::UdpCloudService:registerClient: %s, %s, key: %s", 
					this, 
					udpCloudClient,
					FN_FORMAT_BINARY_AS_HEX(udpCloudClient.key)
				);
				this.clients.put(udpCloudClient.key, udpCloudClient);
			})
		},
		"removeClient" : {
			value : Concurrent.wrapSync(function(udpCloudClient){
				console.log(
					"ndm.client::UdpCloudService:removeClient: %s, %s, key: %s", 
					this, 
					udpCloudClient,
					FN_FORMAT_BINARY_AS_HEX(udpCloudClient.key)
				);
				this.clients.remove(udpCloudClient.key);
			})
		},
		"resolvePeer" : {
			value : function(key){
				console.log(
					"ndm.client::UdpCloudService:resolvePeer: %s, key: %s", 
					this, 
					FN_FORMAT_BINARY_AS_HEX(key)
				);
				console.log(
					"ndm.client::UdpCloudService:resolvePeer: %s, key: %s, keys: %s", 
					this, 
					FN_FORMAT_BINARY_AS_HEX(key),
					Object.keys(this.clients).map(FN_FORMAT_BINARY_AS_HEX).join(":")
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
