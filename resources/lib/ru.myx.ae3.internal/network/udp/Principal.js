const ae3 = require('ae3');
const Transfer = ae3.Transfer;
const UdpServiceHelper = require("java.class/ru.myx.ae3.internal.net.UdpServiceHelper");

const wrapCopier = Transfer.wrapCopier;
const copyBytes = Transfer.copyBytes;
const xorBytes = Transfer.xorBytes;
const updateMessageDigest = Transfer.updateMessageDigest;

const Principal = module.exports = ae3.Class.create(
	/* name */
	"Principal",
	/* inherit */
	undefined,
	/* constructor */
	function(key, dst, secret, serial){
		if(dst){
			if('string' === typeof dst){
				dst = ae3.net.socketAddress(dst);
			}else//
			if(ae3.net.isSocketAddress(dst)){
				// ignore
			}else//
			if(dst.port && (dst.host || dst.ip)){
				dst = ae3.net.socketAddress(dst);
			}else{
				throw "Invalid address: " + Format.jsDescribe(dst);
			}
		}
		Object.defineProperties(this, {
			'key' : {
				enumerable : true,
				writable : true, 
				value : key || null
			},
			'dst' : {
				writable : true, 
				value : dst || null
			},
			'secret' : {
				writable : true, 
				configurable : true, 
				value : secret || null
			},
			'sRx' : {
				writable : true, 
				enumerable : true, 
				configurable : true, 
				value : serial || 0
			},
			'sTx' : {
				writable : true, 
				enumerable : true, 
				configurable : true, 
				value : serial || 0
			},
		});
		return this;
	},
	/* instance */
	{
		MsgHelo : {
			value : require('./MsgHelo')
		},
		MsgPoke : {
			value : require('./MsgPoke')
		},
		MsgPokeDirect : {
			value : require('./MsgPokeDirect')
		},
		MsgSeen : {
			value : require('./MsgSeen')
		},
		MsgMeet : {
			value : require('./MsgMeet')
		},
		TaskUdpSingle : {
			value : require('./TaskUdpSingle')
		},
		/**
		 * formal fields
		 */
		dst : {
			value : 'null or socket address'
		},
		key : {
			value : 'the 12-byte binary key, primary'
		},
		/**
		 * base16 representation of the key
		 */
		keyHex : {
			get : function(){
				return Format.binaryAsHex(this.key);
			}
		},
		alt : {
			value : 'the 12-byte binary key, alternative'
		},
		secret : {
			value : 'the 16-byte binary secret'
		},
		sRx : {
			value : 'uint32, serialIn'
		},
		sTx : {
			value : 'uint32, serialOut'
		},
		/**
		 * methods
		 */
		updateSecret : {
			value : function(secret, serial){
				console.log(">>>>>> %s: Secret update: secret changed: %s, serial: %s", this, (secret != this.secret), serial);

				serial = (serial ^ 0) || 0;
				Object.defineProperties(this, {
					'secret' : {
						writable : true, 
						configurable : true, 
						value : secret || null
					},
					'sRx' : {
						writable : true, 
						enumerable : true, 
						configurable : true, 
						value : serial
					},
					'sTx' : {
						writable : true, 
						enumerable : true, 
						configurable : true, 
						value : serial
					},
				});
			}
		},
		address : {
			enumerable : true,
			get : function(){
				return this.dst
					? this.dst.address + ':' + this.dst.port
					: 'no-address';
			}
		},
		destroy : {
			value : function(){
				//
			}
		},
		
		handlers : {
			value : [ 
				'# array[256] ( XLAT messageCode -> callback(message) )' 
			]
		},
		registerHandler : {
			value : function(messageClass, messageCallback, thisArg){
				if(this.handlers === Principal.prototype.handlers){
					throw this + ": registerHandler: the 'handlers' array must be overriden!";
				}
				if('function' !== typeof messageCallback){
					throw this + ": 'messageCallback' is not a function!";
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
				(this.handlers[c] ||= []).push(
					thisArg
						? Function.prototype.call.bind(messageCallback, thisArg || null)
						: messageCallback
				);
			}
		},
		
		onReceive : {
			value : UdpServiceHelper.principalOnReceive || (function(message, address, serial /* locals: */, c, h){
				if(this.sTx < serial && (serial > 16000000) === (this.sTx > 16000000)){
					this.sTx = serial;
				}
				
				c = message.code;
				if( ((c^0) !== c) ){
					// console.log('>>> >>> %s: onReceive, invalid code: %s, address: %s, serial: %s', this, message, address, serial);
					return;
				}
				h = this.handlers[c];
				if(h){
					// console.log('>>>>>> %s: onReceive, type: %s, address: %s, serial: %s, type: %s', this, message, address, serial, Format.jsDescribe(h));
					for(c of h){
						setTimeout(c.bind(this, message, address, serial), 0);
						// c(message, address, serial);
					}
					return;
				}
				// console.log('>>> >>> %s: onReceive, no handler: %s, address: %s, serial: %s', this, message, address, serial);
				return;
			})
		},
		sendQuery : {
			/**
			 * taskCallback - optional, function(task, reply)
			 */
			value : function(message, taskCallback){
				return new this.TaskUdpSingle(null, this, message, false, taskCallback);
			}
		},
		sendSingle : {
			/**
			 * message
			 * address
			 * 
			 * should be overriden to re-use pre-allocated buffer and/or digest
			 */
			value : function(m, a){
				import ru.myx.ae3.know.WhirlpoolDigest;
				return this.sendImpl(new ArrayBuffer(1500), new WhirlpoolDigest(), m, a);
			}
		},
		sendImpl : {
			/**
			 * buffer
			 * digest
			 * message
			 * address
			 */
			value : UdpServiceHelper.principalSendImpl || (function(b, d, m, a /* locals: */, key, s, len, pkt, k, v){
				if( ! (a ||= this.dst) ){
					if(false !== m.log){
						console.log('>>>>>> %s: udp-send-skip, no address, message: %s', this, m);
					}
					return 0;
				}
				if( ! (key = this.key || m.key) ){
					console.log('>>>>>> %s: udp-send-skip, no dst alias, message: %s', this, m);
					return 0;
				}
				
				s = m.serial ||= (this.sTx = 1 + Math.max(this.sTx, this.sRx));
				
				b[16 + 12 + 1] = (s >> 16) & 0xFF;
				b[16 + 12 + 2] = (s >> 8) & 0xFF;
				b[16 + 12 + 3] = (s) & 0xFF;
				
				len = m.build(b, 32) + 32;
				
				key.copy(0, b, 16, 12);
				
				
				b[16 + 12] = m.code;
				
				pkt = wrapCopier(b, 0, len);
				
				m.encrypt && this.payloadEncrypt(b, len, d);
	
				/**
				 * calculate signature
				 */
				d = d.clone();
				pkt.slice(16, len - 16).updateMessageDigest(d);
				this.secret.updateMessageDigest(d);
				
				/**
				 * put signature in the header
				 */
				copyBytes(d.result, 0, b, 0, 16);
				
				if(false && (!m || false !== m.log)){
					m = Object.create(m);
					for keys(k in m){
						v = m[k];
						ae3.net.isSocketAddress(v) && (m[k] = v.address + ':' + v.port);
					}
					console.log('>>> >>> udp-send: -> %s @ %s:%s, ser: %s, len: %s, %s', 
						Format.jsObject(key.slice(0, 12)), 
						a.address.hostAddress, 
						a.port,
						s,
						pkt.length(),
						m
					);
				}
				return this.sendUdp(pkt, a);
			})
		},
		/**
		 * checks incoming query (outgoing reply) cache
		 */
		checkRxqSerial : {
			value : function(serial){
				return undefined;
			}
		},
		/**
		 * checks incoming reply (outgoing request) cache
		 */
		checkRxrSerial : {
			value : function(serial){
				return undefined;
			}
		},
		
		
		
		
		payloadEncrypt : {
			value : UdpServiceHelper.payloadEncrypt || (function(b, payloadLength, digest){
				digest = digest.clone();
				updateMessageDigest(digest, b, 16, 16);
				this.secret.updateMessageDigest(digest);
				xorBytes(b, 32, digest.result, payloadLength);
			})
		},
		payloadDecrypt : {
			value : UdpServiceHelper.payloadDecrypt || (function(pkt, b, offset, payloadLength, digest){
				digest = digest.clone();
				updateMessageDigest(digest, pkt, 16, 16);
				this.secret.updateMessageDigest(digest);
				xorBytes(pkt, 32, digest.result, b, offset, payloadLength);
			})
		},
		
		
		
		
		/**
		 * outgoing query task is waiting for replies with given serial
		 *
		 */
		serialTxqQueue : {
			value : function(serial, task){
				console.log('>>>>>> %s: serialTxqQueue', this);
				throw new Error("'serialTxqQueue' of Principal is an abstract method and should be overriden!");
			}
		},
		/** ... 
		 * cached when:
		 * - incoming request routed to principal's handler, (true)
		 * - outgoing final reply is sent on princinal's behalf, (message || true)
		 *
		 * stage 1: message code (type) and serial is known
		 * stage 2: message signature is verified
		 *
		 * result:
		 * case undefined, any stage - continue processing incoming message
		 * case true, stage 1 - ignore message
		 * case <Message>, stage 2 - return cached reply
		 */
		serialRxqCache : {
			value : function(serial, result){
				console.log('>>>>>> %s: serialRxqCache', this);
				throw new Error("'serialRxqCache' of Principal is an abstract method and should be overriden!");
			}
		},
		/** ... 
		 * cached when:
		 * - task handler's return value is not 'true', 
		 * // - outgoing request is sent on princinal's behalf
		 * - incoming final reply is routed to principal's handler, (task || true)
		 *
		 * further reply messages with given serial are discarded.
		 */
		serialTxqCache : {
			value : function(serial){
				console.log('>>>>>> %s: serialTxqCache', this);
				throw new Error("'serialTxqCache' of Principal is an abstract method and should be overriden!");
			}
		},
		/**
		 * Sends actial UDP datagram message to the address given
		 */
		sendUdp : {
			value : function(payload, addr){
				console.log('>>>>>> %s: sendUdp', this);
				throw new Error("'sendUdp' of Principal is an abstract method and should be overriden!");
			}
		},
		toString : {
			value : function(/* locals: */t){
				t = this.hostId;
				if(t){
					return "[Principal " + t + "]";
				}
				t = this.address;
				if(t){
					return "[Principal " + t + "]";
				}
				return "[Principal]";
			}
		}
	}
);
