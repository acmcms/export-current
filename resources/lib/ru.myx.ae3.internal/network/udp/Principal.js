const ae3 = require('ae3');
const Transfer = ae3.Transfer;

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
		MsgSeen : {
			value : require('./MsgSeen')
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

				serial = (Number(serial) | 0) || 0;
				Object.defineProperties(this, {
					'secret' : {
						writable : true, 
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
				(this.handlers[c] || (this.handlers[c] = [])).push(Function.prototype.call.bind(messageCallback, thisArg || null));
			}
		},
		
		onReceive : {
			value : function(message, address, serial, /* locals: */ c){
				this.sTx = Math.max(this.sTx, serial);
				
				c = message.code;
				if( ('number' !== typeof c) || ((c^0) !== c) ){
					// console.log('>>> >>> %s: onReceive, invalid code: %s, address: %s, serial: %s', this, message, address, serial);
					return;
				}
				const handlers = this.handlers[c];
				if(handlers){
					// console.log('>>>>>> %s: onReceive, type: %s, address: %s, serial: %s, type: %s', this, message, address, serial, Format.jsDescribe(handler));
					handlers.forEach(function(handler){
						handler(message, address, serial);
					});
					return;
				}
				// console.log('>>> >>> %s: onReceive, no handler: %s, address: %s, serial: %s', this, message, address, serial);
				return;
			}
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
			value : function(b, d, m, a){
				a || (a = this.dst);
				if(!a){
					if(false !== m.log){
						console.log('>>>>>> %s: udp-send-skip, no address, message: %s', this, m);
					}
					return 0;
				}
				var key = this.key || m.key;
				if(!key){
					console.log('>>>>>> %s: udp-send-skip, no dst alias, message: %s', this, m);
					return 0;
				}
				
				var s = m.serial || (m.serial = (this.sTx = 1 + Math.max(this.sTx, this.sRx)));
				
				b[16 + 12 + 1] = (s >> 16) & 0xFF;
				b[16 + 12 + 2] = (s >> 8) & 0xFF;
				b[16 + 12 + 3] = (s) & 0xFF;
				
				var len = m.build(b, 32) + 32;
				
				key.copy(0, b, 16, 12);
				
				
				b[16 + 12] = m.code;
				
				var pkt = Transfer.wrapCopier(b, 0, len);
				
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
				Transfer.copyBytes(d.result, 0, b, 0, 16);
				
				
				
				if(!pkt){
					if(!m || false !== m.log){
						console.log('>>>>>> %s: udp-send-skip, no payload, message: %s', this, m);
					}
					return 0;
				}
				if(!m || false !== m.log){
					m = Object.create(m);
					var k, v;
					for keys(k in m){
						v = m[k];
						ae3.net.isSocketAddress(v) && (m[k] = v.address + ':' + v.port);
					}
					/**<code>
					console.log('>>> >>> udp-send: -> %s @ %s:%s, ser: %s, len: %s, %s', 
						Format.jsObject(key.slice(0, 12)), 
						a.address.hostAddress, 
						a.port,
						s,
						pkt.length(),
						m
					);
					</code>*/
				}
				return this.sendUdp(pkt, a);
			}
		},
		isIgnoreSerial : {
			value : function(serial){
				return undefined;
			}
		},
		
		
		
		
		payloadEncrypt : {
			value : function(b, payloadLength, digest){
				digest = digest.clone();
				Transfer.updateMessageDigest(digest, b, 16, 16);
				this.secret.updateMessageDigest(digest);
				Transfer.xorBytes(b, 32, digest.result, payloadLength);
			}
		},
		payloadDecrypt : {
			value : function(pkt, b, offset, payloadLength, digest){
				// var dg = digest.clone();
				digest = digest.clone();
				// Transfer.updateMessageDigest(dg, pkt, 16, 16);
				Transfer.updateMessageDigest(digest, pkt, 16, 16);
				// this.secret.updateMessageDigest(dg);
				this.secret.updateMessageDigest(digest);
				// console.log(">>>>>> DG: " + Format.binaryAsHex(dg.result));
				Transfer.xorBytes(pkt, 32, digest.result, b, offset, payloadLength);
			}
		},
		
		
		
		
		taskPending : {
			value : function(serial, task){
				console.log('>>>>>> %s: taskPending', this);
				throw new Error("'taskPending' of Principal is an abstract method and should be overriden!");
			}
		},
		taskFinished : {
			value : function(serial){
				console.log('>>>>>> %s: taskFinished', this);
				throw new Error("'taskPending' of Principal is an abstract method and should be overriden!");
			}
		},
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
