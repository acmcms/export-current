/**
 * 
 */

import java.net.NetworkInterface;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketAddress;

const BaseNetHelper = (function(){
	try{
		import ru.myx.ae3.internal.net.BaseNetHelper;
		return BaseNetHelper;
	}catch(e){
		return "";
	}
})();

const Net = module.exports = Object.create(Object.create(null, {
	/***************************************************************************
	 * CONSTANTS
	 */
	HOST_NAME : {
		get : BaseNetHelper.getLocalHostName ?? function(){
			return InetAddress.localHost.hostName;
		},
		enumerable : true
	},
	SHIFT_PORT : {
		get : function(){
			import ru.myx.ae3.transfer.nio.NioPack;
			return this.SHIFT_PORT = NioPack.SHIFT_PORT;
		},
		enumerable : true
	},
	

	/***************************************************************************
	 * classes
	 */
	dns : {
		get : function(){
			return this.dns = require('ae3.net/dns');
		},
		enumerable : true
	},
	tcp : {
		get : function(){
			return this.tcp = require('ae3.net/tcp');
		},
		enumerable : true
	},
	ssl : {
		get : function(){
			return this.ssl = require('ae3.net/ssl');
		},
		enumerable : true
	},
	udp : {
		get : function(){
			return this.udp = require('ae3.net/udp');
		},
		enumerable : true
	},
	mac : {
		get : function(){
			return this.mac = require('ae3.net/mac');
		},
		enumerable : true
	},
	imei : {
		get : function(){
			return this.imei = require('ae3.net/imei');
		},
		enumerable : true
	},

	/***************************************************************************
	 * Objects
	 */

	CommunicationTask : {
		get : function(){
			return require('ae3.net/CommunicationTask');
		},
		enumerable : true
	},
	
	/***************************************************************************
	 * Methods
	 */

	listAddresses : {
		/**
		 * 
		 * @returns map of addresses by interfaces
		 */
		value : function(){
			var result = {};
			var ifaces = NetworkInterface.getNetworkInterfaces();
			while(ifaces.hasMoreElements()) {
				var iface = ifaces.nextElement();
				var key = iface.getName();
				var addresses = [];
				var map = {
					name : key,
					up : iface.isUp(),
					multicast : iface.supportsMulticast(),
					ppp : iface.isPointToPoint(),
					loopback : iface.isLoopback(),
					virtual : iface.isVirtual(),
					mtu : iface.getMTU(),
					displayName : iface.getDisplayName(),
					addresses : addresses,
				};
				var addrs = iface.getInetAddresses();
				while(addrs.hasMoreElements()) {
					addresses.push(addrs.nextElement().getHostAddress() );
				}
				result[key] = map;
			}
			return result;
		}
	},
	loopbackAddress : {
		get : InetAddress.getLoopbackAddress ?? (function(){
			return InetAddress.loopbackAddress;
		})
	},
	localAddress : {
		get : function(){
			return InetAddress.localHost.hostAddress;
		}
	},
	
	inetAddress : {
		value : BaseNetHelper.inetAddress ?? (function(addr){
			if (!addr) {
				return InetAddress.loopbackAddress;
			} 
			if ('string' === typeof addr) {
				return Net.dns.resolveOne(addr);
			}
			{
				/**
				 * well proceed with using the 'addr' argument in hope that it
				 * is the actual InetAddress object
				 * 
				 * TODO: add instanceof ?
				 */
				return addr; 
			}
		})
	},
	inetAddressFromBuffer : {
		value : BaseNetHelper.inetAddressFromBuffer ?? (function(buffer, offset, length){
			switch(length){
			case 4:
			case 16:
				return Net.inetAddress( Format.binaryAsInetAddress(buffer, offset, length) );
			default:
				throw new Error("inetAddressFromBuffer: incorrect address length: " + length);
			}
		})
	},
	isValidIPv4 : {
		value : BaseNetHelper.isValidIPv4
	},
	isSocketAddress : {
		value : function(obj){
			return obj instanceof SocketAddress;
		}
	},
	socketAddress : {
		value : function(specOrPort, addr){
			if(addr === undefined && arguments.length === 1){
				if('string' === typeof specOrPort){
					var pos = specOrPort.lastIndexOf(':');
					if(pos === -1){
						throw ("Spec has no port: " + specOrPort);
					}
					var addr = specOrPort.substring(0, pos);
					var check = specOrPort.substring(pos + 1);
					var port = Number(check || 0);
					if(!port || port != check || (port & 0xFFFF) != port){
						throw ("Spec port is invalid: " + specOrPort);
					}
					return new InetSocketAddress(addr, port);
				}
				if(specOrPort instanceof SocketAddress){
					return specOrPort;
				}
				if(specOrPort.port && (specOrPort.ip || specOrPort.host)){
					return new InetSocketAddress(specOrPort.ip || specOrPort.host, specOrPort.port);
				}
				throw ("SocketAddress 'spec' is incomplete or not supported: " + Format.jsObject(specOrPort));
			}
			return '*' === addr 
				? new InetSocketAddress(specOrPort) 
				: addr
					? new InetSocketAddress(addr, specOrPort)
					: new InetSocketAddress(InetAddress.loopbackAddress, specOrPort);
		}
	},
	socketAddressArray : {
		value : function(spec){
			if('string' === typeof spec){
				var pos = spec.lastIndexOf(':');
				if(pos === -1){
					throw ("Spec has no port: " + spec);
				}
				var check = spec.substring(pos+1);
				var port = Number(check || 0);
				if(!port || port != check || (port & 0xFFFF) != port){
					throw ("Spec port is invalid: " + spec);
				}
				
				var addr = Net.dns.resolveAll(spec.substring(0, pos));
				
				return addr.map(function(addr){
					return new InetSocketAddress(addr, port);
				}, this);
			}
			if(spec instanceof SocketAddress){
				return [ spec ];
			}
			if(spec.port && (spec.host || spec.ip)){
				var ports = spec.port;
				ports && (Array.isArray(ports) || (ports = [ ports ]));
				ports = ports.reduce(function(result, check){
					var port = Number(check || 0);
					if(port && port == check && (port & 0xFFFF) == port){
						result.push(port);
					}
					return result;
				}, []);
				if(ports.length == 0){
					return null;
				}

				var addrs = spec.host || spec.ip;
				addrs && (Array.isArray(addrs) || (addrs = [ addrs ]));
				addrs = addrs.reduce((function(result, spec){
					var shift;
					var pos = spec.lastIndexOf(':');
					if(pos === -1){
						shift = 0;
					}else{
						var check = spec.substring(pos+1);
						shift = Number(check || 0);
						if(shift != check || (shift & 0xFFFF) != shift){
							throw ("Spec port shift is invalid: " + spec);
						}
						spec = spec.substring(0, pos);
					}
					
					var addr;
					try{
						addr = Net.dns.resolveAll(spec);
					}catch(e){ 
						return result;
					}
					addr.forEach(function(addr){
						ports.forEach(function(port){
							result.push( new InetSocketAddress( addr, shift === 0 ? port : (shift + (port % 1000)) ) );
						});
					});
					return result;
				}).bind(this), []);
				if(addrs.length == 0){
					return null;
				}
				
				return addrs;
			}
			if(Array.isArray(spec)){
				return spec.reduce((function(result, spec, t){
					t = this.socketAddressArray(spec);
					t?.forEach(result.push, result);
					return result;
				}).bind(Net), []);
			}
			throw "Unsupported socket address spec: " + Format.jsDescribe(spec);
		}
	},
	
	"socketAddressFromBuffer" : {
		/**
		 * Accepts only 6 (4+2) and 18 (16+2) length argument
		**/
		value : BaseNetHelper.socketAddressFromBuffer ?? (function(buffer, offset, length){
			switch(length){
			case 6:
				return new InetSocketAddress(//
					Net.inetAddress( 
						Format.binaryAsInetAddress4(buffer, offset), 
						((buffer[offset+4] & 0xFF) << 8) | (buffer[offset+5] & 0xFF) //
					) //
				);
			case 18:
				return new InetSocketAddress(//
					Net.inetAddress( //
						Format.binaryAsInetAddress6(buffer, offset), //
						((buffer[offset+16] & 0xFF) << 8) | (buffer[offset+17] & 0xFF) //
					) //
				);
			default:
				throw new Error("socketAddressFromBuffer: incorrect address length: " + length);
			}
		})
	},
	
	"toString" : {
		value : function(){
			return "[Object ae3.net API]";
		}
	}
}));