const ae3 = require('ae3');

const asyncTaskOnReceive = function(task, message){
	task.onReceive(message) === true || this.serialTxqCache(task.serial);
};

const UdpServiceHelper = require("java.class/ru.myx.ae3.internal.net.UdpServiceHelper");
const Puncher = require('./Puncher');


const RemoteServicePrincipal = module.exports = ae3.Class.create(
	/* name */
	"RemoteServicePrincipal",
	/* inherit */
	require('./Principal'),
	/* constructor */
	function(key, dst, secret, serial){
		this.Principal(key, dst, secret, serial);

		Object.defineProperties(this, {
			"serialTxqQueueWindow" : {
				value : new ae3.Concurrent.CoarseDelayCache(3200, 5, (UdpServiceHelper.serialTxqQueueExpire || (
					function(serial, task){
						this.serialTxqCacheWindow.put(serial, task);
						task.onDestroy();
					}
				)).bind(this))
			},
			"serialRxqCacheWindow" : {
				value : new ae3.Concurrent.CoarseDelayCache(3800, 5, (UdpServiceHelper.serialAxqCacheExpire || (
					function(serial, task){
						if(this.sRx < serial && (serial > 16000000) === (this.sRx > 16000000)){
							this.sRx = serial;
						}
					}
				)).bind(this))
			},
			"serialTxqCacheWindow" : {
				value : new ae3.Concurrent.CoarseDelayCache(3800, 5, (UdpServiceHelper.serialAxqCacheExpire || (
					function(serial, task){
						if(this.sRx < serial && (serial > 16000000) === (this.sRx > 16000000)){
							this.sRx = serial;
						}
					}
				)).bind(this))
			},
		});
		
		return this;
	},
	/* instance */
	{
		handlers : {
			execute : "once", get : function(){
				return [];
			}
		},
		/** 
		 * override Principal's getter to make it cached here
		 */
		keyHex : {
			execute : "once", get : function(){
				return Format.binaryAsHex(this.key);
			}
		},
		checkRxqSerial : {
			execute : "once", get : function(){
				return this.serialRxqCacheWindow.readCheck.bind(this.serialRxqCacheWindow);
			}
		},
		checkRxrSerial : {
			execute : "once", get : function(){
				return this.serialTxqCacheWindow.readCheck.bind(this.serialTxqCacheWindow);
			}
		},
		/**
		 * register pending outgoing request task, see Principal.
		 */
		serialTxqQueue : {
			value : function(serial, task){
				this.serialTxqQueueWindow.put(serial, task);
			}
		},
		/**
		 * register incoming routed request, see Principal.
		 */
		serialRxqCache : {
			value : function(serial, result){
				this.serialRxqCacheWindow.put(serial, result || true);
			}
		},
		serialTxqCache : {
			value : function(serial){
				this.serialTxqCacheWindow.put(serial, true);
				this.serialTxqQueueWindow.remove(serial);
			}
		},
		puncher : {
			/**
			 * set the puncher object that will receive: 
			 * 
			 * onSeen(message, address, serial)
			 * 
			 * onMeet(message, address)
			 * 
			 * Override 'start' and 'destroy' methods, they only do control the Puncher 
			 * life-cycle.
			 */
			value : null
		},
		start : {
			value : ae3.Concurrent.wrapSync(function(){
				this.puncher || (this.puncher = new Puncher(this));
			})
		},
		destroy : {
			value : ae3.Concurrent.wrapSync(function(/* locals: */ p){
				p = this.puncher;
				if(p){
					this.puncher = null;
					p.destroy();
				}
			})
		},
		tryUpdateToken : {
			/**
			 * tries to retrieve keys, secrets and serials and update this principal
			 * 
			 * the NAT traversal process will call this method when 'key' || 'secret'
			 * is not accessible.
			 */
			value : function(){
				throw "tryUpdateToken must be overriden!";
			}
		},
		tryResolveHosts : {
			value : function(){
				throw "tryResolveHosts must be overriden!";
			}
		},
		onReceive : {
			value : function(message, address, serial){
				// console.log('>>> >>> %s: onReceive: %s, address: %s, serial: %s', this, message, address, serial);
				const task = message.isReply && this.serialTxqQueueWindow.readCheck(serial);
				if(task){
					// console.log('>>> >>> %s: onReceive, task: %s, address: %s, serial: %s, task: %s', this, message, address, serial, task);
					setTimeout(asyncTaskOnReceive.bind(this, task, message), 0);
					return;
				}
				if(message.isUHP){
					if(message.isUHP_PUNCH){
						this.serialRxqCacheWindow.put(serial, true);
						if(this.sTx < serial && (serial > 16000000) === (this.sTx > 16000000)){
							this.sTx = serial;
						}
						return this.sendSingle(
								new this.iface.MsgSeen(
										serial,
										address.port, 
										message.isHELO 
										? this.UHP_SEEN_HELO_MODE 
											: this.UHP_SEEN_POKE_MODE
								),
								address
						);
					}

					return this.puncher && this.puncher.onUHP(message, address, serial);
				}
				
				// no repetitions for requests
				message.isRequest && this.serialRxqCacheWindow.put(serial, true);
				return this.Principal.prototype.onReceive.call(this, message, address, serial);
			}
		},
		UHP_SEEN_HELO_MODE : {
			value : 0xA0
		},
		UHP_SEEN_POKE_MODE : {
			/**
			 * value : 0x84  - Set UHP loop interval to 17 seconds, count to 9
			 * value : 0x83  - Set UHP loop interval to 13 seconds, count to 9
			 * value : 0x82  - Set UHP loop interval to 9 seconds, count to 9
			 **/
			value : 0x83
		},
		toString : {
			value : function(){
				return "[RemoteServicePrincipal " + this.keyHex + ", " + Format.jsObject(this.hostId || this.address) + "]";
			}
		}
	}
);
