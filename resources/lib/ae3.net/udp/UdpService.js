/**
 * UdpService is listening on a specific UDP port and allowing for Principal 
 * objects to register in be able to send and receive messages.
 * 
 * These messages have specific format and specific protocols in place. For 
 * raw UDP functionality check the 'ae3.net.udp.listen'
 * 
 */


const ae3 = require('ae3');
const Concurrent = ae3.Concurrent;

const UdpService = module.exports = ae3.Class.create(
	/* name */
	"UdpService",
	/* inherit */
	undefined,
	/* constructor */
	function UdpService(port){
		
		import ru.myx.ae3.know.WhirlpoolDigest;
	
		/**
		 * to be stopped on 'destroy'
		 */
		this.receiveCallback = Concurrent.wrapBuffered(
			require("ru.myx.ae3.internal/network/udp/BufferedRxParser").bind(this, new ArrayBuffer(1500), new WhirlpoolDigest()), 
			{
				maxBuffer : 128,
			}
		);
	
		Object.defineProperty(this, "sock", {
			value : ae3.net.udp.listen(port || 0, this.receiveCallback)
		});
		Object.defineProperties(this, {
			/* commandByKey : {
				value : this.commandByKey.concat()
			}, */
			port : {
				value : this.sock.port
			},
			sendUdp : {
				value : this.sock.send.bind(this.sock)
			},
		});
		
		return this;
	},
	/* instance */
	{
		Message : {
			value : require('ru.myx.ae3.internal/network/udp/Message')
		},
		Principal : {
			value : require('ru.myx.ae3.internal/network/udp/Principal'),
		},
		// Punching Target Record
		RemoteServicePrincipal: {
			value : require('ru.myx.ae3.internal/network/udp/RemoteServicePrincipal'),
		},
		// Punching Receiver Record
		TraversalClient: {
			value : require('ru.myx.ae3.internal/network/udp/TraversalClient'),
		},
		
		TaskUdpSingle : {
			value : require('ru.myx.ae3.internal/network/udp/TaskUdpSingle')
		},
		TaskUdpMultiple : {
			value : require('ru.myx.ae3.internal/network/udp/TaskUdpMultiple')
		},

		commandByKey : {
			value : []
		},
		
		/**
		 * format properties
		 */
		sock : {
			value : 'the UdpSocket object'
		},
		port : {
			value : 'the port number'
		},
		/**
		 * sends actual payload
		 */
		sendUdp : {
			/**
			 * constructor will replace this method with bint function
			 */
			value : function sendUdp(payload, addr){
				return this.sock.send(payload, addr)
			}
		},
		description : {
			get : function(){
				return String(this.sock);
			}
		},
		/**
		 * methods
		 */
		destroy : {
			value : Concurrent.wrapSync(function(){
				this.sock && this.sock.close();
				const receiveCallback = this.receiveCallback;
				receiveCallback && (this.receiveCallback = null, receiveCallback.destroy && receiveCallback.destroy());
			})
		},
		/**
		 * 
		 */
		toString : {
			value : function(){
				return "[UdpService, port=" + this.port + "]";
			}
		}
	},
	/* static */
	{
		"Message" : {
			value : require('ru.myx.ae3.internal/network/udp/Message')
		},
		"MessageRequest" : {
			value : require('ru.myx.ae3.internal/network/udp/MessageRequest')
		},
		"MessageReply" : {
			value : require('ru.myx.ae3.internal/network/udp/MessageReply')
		},
		"MessageReplyFinal" : {
			value : require('ru.myx.ae3.internal/network/udp/MessageReplyFinal')
		},
		"MessageReplyContinue" : {
			value : require('ru.myx.ae3.internal/network/udp/MessageReplyContinue')
		},
		"TaskUdpSingle" : {
			value : require('ru.myx.ae3.internal/network/udp/TaskUdpSingle')
		},
		"TaskUdpMultiple" : {
			value : require('ru.myx.ae3.internal/network/udp/TaskUdpMultiple')
		},
		"TaskParent" : {
			execute : "once", get : function(){
				return Concurrent.AbstractTask.TaskParent;
			}
		},
		"registerMessageClass" : {
			value : function(serviceClass, messageClass){
				const prototype = serviceClass.prototype;
				const commandByKey = serviceClass.commandByKey || (
					prototype.commandByKey = serviceClass.commandByKey = prototype.commandByKey.concat()
				);
				if('boolean' !== typeof messageClass.prototype.isRequest){
					throw new Error("isRequest must be overriden with boolean value: " + messageClass);
				}
				if('boolean' !== typeof messageClass.prototype.isReply){
					throw new Error("isReply must be overriden with boolean value: " + messageClass);
				}
				const c = messageClass.prototype.code;
				if('number' !== typeof c){
					throw new Error("'code' must be overriden with numeric value: " + messageClass);
				}
				if((c^0) !== c){
					throw new Error("'code' must be overriden with integer value: " + messageClass + ", code: " + c);
				}
				if(c < 0){
					throw new Error("'code' must be overriden with positive integer value: " + messageClass + ", code: " + c);
				}
				if(c > 255){
					throw new Error("'code' must be overriden with integer value in [0..255] range: " + messageClass + ", code: " + c);
				}
				if(commandByKey[c]){
					throw new Error("Duplicate UDP Command Code: " + c);
				}
				const C = messageClass.toString();
				if(prototype[C]){
					throw new Error("Duplicate Message Class Name: " + C + ", code=" + c);
				}
				Object.defineProperty(prototype, C, {
					value : (commandByKey[c] = messageClass)
				});
			}
		},
		"resolvePeer" : {
			/**
			 * Override
			 */
			value : function(key){
				return undefined;
			}
		},
		"toString" : {
			value : function(){
				return "[class UdpService]";
			}
		}
	}
);


{
	UdpService.commandByKey = UdpService.prototype.commandByKey;
	
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgFail'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgHelo'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgMeet'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgPoke'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgPokeDirect'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgSeen'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgCall'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgCack'));
	UdpService.registerMessageClass(UdpService, require('ru.myx.ae3.internal/network/udp/MsgCerr'));
}
