const ae3 = require('ae3');
const Concurrent = ae3.Concurrent;

const UdpCloudService = ae3.Class.create(
	"UdpCloudService",
	ae3.net.udp.UdpService,
	function UdpCloudService(port){
		console.log('>>>>>> ndm.client:service: starting udp listening service on port ' + (port || 4043) + '.');
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
			value : Concurrent.wrapSync(function(ucc){
				console.log(">>>>>> ndm.client:service %s, registerClient: %s", this, ucc);
				this.clients.put(ucc.key, ucc);
			})
		},
		"removeClient" : {
			value : Concurrent.wrapSync(function(ucc){
				console.log(">>>>>> ndm.client:service %s, removeClient: %s", this, udpCloudClient);
				this.clients.remove(ucc.key);
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
