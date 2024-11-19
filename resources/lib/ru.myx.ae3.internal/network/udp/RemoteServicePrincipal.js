const ae3 = require('ae3');

const FN_FORMAT_BINARY_AS_HEX = Format.binaryAsHex;


const FN_ON_REPLY_ASYNC = function(task, message){
	task.onReceive(message) === true || this.serialRxrCache(task.serial);
};

const Principal = require('./Principal');

const FN_ON_RECEIVE_PRINCIPAL = Principal.prototype.onReceive;
const FN_UPDATE_SECRET_PRINCIPAL = Principal.prototype.updateSecret;

const CoarseDelayCache = ae3.Concurrent.CoarseDelayCache;

const UdpServiceHelper = require("java.class/ru.myx.ae3.internal.net.UdpServiceHelper");

const RemoteServicePrincipal = module.exports = ae3.Class.create(
	/* name */
	"RemoteServicePrincipal",
	/* inherit */
	Principal,
	/* constructor */
	function(key, dst, secret, serial){
		this.Principal(key, dst, secret, serial);
		
		Object.defineProperties(this, {
			"serialTxqQueueWindow" : {
				/** tasks awaiting replies cache **/
				value : new CoarseDelayCache(3200, 5, (UdpServiceHelper.serialTxqQueueExpire || (
					function(serial, task){
						this.serialTxqCacheWindow.put(serial, task);
						task.onDestroy();
					}
				)).bind(this))
			},
			"serialRxqCacheWindow" : {
				/** fresh incoming requests for us to ignore */
				value : new CoarseDelayCache(3800, 5, (UdpServiceHelper.serialAxqCacheExpire || (
					function(serial, task){
						if(this.sRx < serial && this.sTx > serial && (serial > 16000000) === (this.sRx > 16000000)){
							this.sRx = serial;
						}
					}
				)).bind(this))
			},
			"serialTxqCacheWindow" : {
				/** fresh incoming replies for us to ignore */
				value : new CoarseDelayCache(3800, 5, (UdpServiceHelper.serialAxqCacheExpire || (
					function(serial, task){
						if(this.sRx < serial && this.sTx > serial && (serial > 16000000) === (this.sRx > 16000000)){
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
				return FN_FORMAT_BINARY_AS_HEX(this.key);
			}
		},
		/** 
		 * for toString only
		 */
		keyShortString : {
			execute : "once", get : function(){
				return "[RemoteServicePrincipal " + this.keyHex.substr(0, 8) + "... ";
			}
		},
		checkRxqSerial : {
			/** function get(serial) **/
			execute : "once", get : function(){
				return this.serialRxqCacheWindow.readCheck.bind(this.serialRxqCacheWindow);
			}
		},
		checkRxrSerial : {
			/** function get(serial) **/
			execute : "once", get : function(){
				return this.serialTxqCacheWindow.readCheck.bind(this.serialTxqCacheWindow);
			}
		},
		/**
		 * register pending outgoing request task, see Principal.
		 */
		serialTxqQueue : {
			/** function put(serial, task) **/
			execute : "once", get : function(){
				return this.serialTxqQueueWindow.put.bind(this.serialTxqQueueWindow);
			}
		},
		/**
		 * register incoming routed request filter, see Principal.
		 */
		serialRxqCache : {
			/** function put(serial, result) **/
			execute : "once", get : function(){
				return this.serialRxqCacheWindow.put.bind(this.serialRxqCacheWindow);
			}
		},
		/**
		 * register incoming routed reply filter, see Principal.
		 */
		serialRxrCache : {
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
				if(!this.puncher){
					const Puncher = require('./Puncher');
					this.puncher = new Puncher(this);
				}
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
			value : function(message, address, serial /* locals: */, task){
				if(message.isUHP){
					if(message.isUHP_PUNCH){
						console.log('>>>>>> %s: onReceive, UHP punch: %s, address: %s, serial: %s', this, message, address, serial);
						this.serialRxqCache(serial, true);
						if(this.sTx < serial && (serial > 16000000) === (this.sTx > 16000000)){
							this.sTx = serial;
						}
						return this.sendSingle(
								new this.MSG_RF_SEEN(
										serial,
										address.port, 
										message.isHELO 
										? this.UHP_SEEN_HELO_MODE 
											: this.UHP_SEEN_POKE_MODE
								),
								address
						);
					}

					console.log('>>>>>> %s: onReceive, UHP other: %s, address: %s, serial: %s, puncher: %s', this, message, address, serial, !!this.puncher);
					return this.puncher && this.puncher.onUHP(message, address, serial);
				}
				
				if(message.isReply){
					/** check task that awaits **/
					if( (task = this.serialTxqQueueWindow.readCheck(serial)) ){
						console.log('>>>>>> %s: onReceive, task: %s, address: %s, serial: %s, task: %s', this, message, address, serial, task);
						setTimeout(FN_ON_REPLY_ASYNC.bind(this, task, message), 0);
						return;
					}
					return;
				}
				
				if(message.isRequest){
					console.log('>>>>>> %s: onReceive, request: %s, address: %s, serial: %s', this, message, address, serial);
					/** no repetitions for requests **/
					this.serialRxqCache(serial, true);
					return FN_ON_RECEIVE_PRINCIPAL.call(this, message, address, serial);
				}

				console.log('>>>>>> %s: onReceive, skip: %s, address: %s, serial: %s', this, message, address, serial);
				return;
			}
		},
		updateSecret : {
			value : function(secret, serial){
				console.log('>>>>>> %s: updateSecret: %s, serial: %s, puncher: %s', this, !!secret, serial, this.puncher?.state);
				return FN_UPDATE_SECRET_PRINCIPAL.call(this, secret, serial);
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
				return [this.keyShortString, Format.jsObject(this.hostId || this.address), "]"].join("");
				return this.keyShortString + Format.jsObject(this.hostId || this.address) + "]";
				return "[RemoteServicePrincipal " + this.keyHex + ", " + Format.jsObject(this.hostId || this.address) + "]";
			}
		}
	}
);
