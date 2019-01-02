import ru.myx.ae3.transfer.nio.UdpSocket;
import ru.myx.ae3.concurrent.FunctionWrapSyncThis;


const LAZY_PROTOTYPE = Object.create(Object.prototype, {
	UdpService : {
		get : new FunctionWrapSyncThis(function(){
			const result = require('ae3.net/udp/UdpService');
			Object.defineProperty(this, "UdpService", {
				value : result
			});
			return result;
		})
	},
});

module.exports = Object.create(LAZY_PROTOTYPE, {
	/**
	 * classes
	 */
	"UdpSocket" : {
		enumerable : true,
		value : UdpSocket
	},
	/**
	 * returns boolean true
	 * fails with exception
	 */
	"send" : {
		enumerable : true,
		value : function(message, to, from){
			const socket = this.socket(from);
			socket.send(message, to.port || to, to.port && to.address || null);
			socket.close();
			return true;
		}
	},
	/**
	 * returns UdpSocket
	 * 
	 * fails with exception
	 */
	"open" : {
		enumerable : true,
		value : function(message, to, from, callbackFn/*(udpSocket, message)*/){
			var socket = this.listen(from, callbackFn);
			socket.send(message, to.port || to, to.port && to.address || null);
			return socket;
		}
	},
	/**
	 * returns UdpSocket
	 */
	"listen" : {
		enumerable : true,
		value : function(on, callbackFn/*(udpSocket, message)*/){
			if(!callbackFn){
				throw "callbackFn is required for 'udp.listen' method!";
			}
			const socket = this.socket(on);
			/**
			 * TODO: fix setter not working when UdpSocket in BaseObject 8-(
			 */
			// socket.callback = callbackFn;
			socket.setCallback(callbackFn);
			return socket;
		}
	},
	/**
	 * returns UdpSocket
	 */
	"socket" : {
		enumerable : true,
		value : function(on /*(udpSocket, message)*/){
			return new UdpSocket(on 
				? 'number' === on ? on : (on.port || on)
				: 0
			);
		}
	},
	"toString" : {
		value : function(){
			return "[Object ae3.net.udp API]";
		}
	}
});