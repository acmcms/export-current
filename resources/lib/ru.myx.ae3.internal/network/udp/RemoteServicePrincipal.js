const ae3 = require('ae3');

const FN_FORMAT_BINARY_AS_HEX = Format.binaryAsHex;

/**
 * unless task returns true, the following replies will be ignored
 * 
 * 'this' - is an instance of RemoteServicePrincipal
 */
const FN_TASK_ON_RECEIVE_ASYNC = function(serial, task, message){
	task.onReceive(message) === true || this.cacheIncomingReplySerial(serial);
};

const Principal = require('./Principal');

const FN_ON_RECEIVE_PRINCIPAL = Principal.prototype.onReceive;
const FN_UPDATE_SECRET_PRINCIPAL = Principal.prototype.updateSecret;

const CoarseDelayCache = ae3.Concurrent.CoarseDelayCache;

const UdpServiceHelper = require("java.class/ru.myx.ae3.internal.net.UdpServiceHelper");

/**
 * 'this' should be bint to RemoteServicePrincipal instanc
 * 'task' - task or false.
 */
const expireWaitingTaskSerial = UdpServiceHelper?.expireWaitingTaskSerial ?? function(serial, task){
	this.receiveReplySerialsCache.put(serial, true);
	task.onDestroy?.();
};

/**
 * 'this' should be bint to RemoteServicePrincipal instance
 * 'x' true or message
 */
const expireReceiveCachedSerial = UdpServiceHelper?.expireReceiveCachedSerial ?? function(serial, x){
	if(this.sRx < serial && this.sTx > serial && (serial > 16000000) === (this.sRx > 16000000)){
		this.sRx = serial;
	}
};

const RemoteServicePrincipal = module.exports = ae3.Class.create(
	/* name */
	"RemoteServicePrincipal",
	/* inherit */
	Principal,
	/* constructor */
	function(key, dst, secret, serial){
		this.Principal(key, dst, secret, serial);
		
		Object.defineProperties(this, {
			"waitingTaskSerialsCache" : {
				/** tasks awaiting replies cache **/
				value : new CoarseDelayCache(3100, 5, expireWaitingTaskSerial.bind(this))
			},
			"receiveQuerySerialsCache" : {
				/** fresh incoming requests for us to ignore or repeat replies */
				value : new CoarseDelayCache(3400, 5, expireReceiveCachedSerial.bind(this))
			},
			"receiveReplySerialsCache" : {
				/** fresh incoming replies for us to ignore */
				value : new CoarseDelayCache(3400, 5, expireReceiveCachedSerial.bind(this))
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
			enumerable : true,
			execute : "once", get : function(){
				return FN_FORMAT_BINARY_AS_HEX(this.key);
			}
		},
		
		/**
		 * register incoming routed request duplicates filter, see Principal.
		 */
		cacheIncomingQuerySerial : {
			/** function put(serial, result/true) **/
			execute : "once", get : function(){
				return this.receiveQuerySerialsCache.put.bind(this.receiveQuerySerialsCache);
			}
		},
		/**
		 * register incoming routed reply duplicates filter, see Principal.
		 */
		cacheIncomingReplySerial : {
			/** function put(serial) **/
			value : function(serial){
				this.receiveReplySerialsCache.put(serial, true);
				this.waitingTaskSerialsCache.remove(serial);
			}
		},

		/**
		 * check incoming routed request duplicates filter, see Principal.
		 */
		checkIncomingQuerySerial : {
			/** function get(serial) **/
			execute : "once", get : function(){
				return this.receiveQuerySerialsCache.readCheck.bind(this.receiveQuerySerialsCache);
			}
		},
		/**
		 * check incoming routed reply duplicates filter, see Principal.
		 */
		checkIncomingReplySerial : {
			/** function get(serial) **/
			execute : "once", get : function(){
				return this.receiveReplySerialsCache.readCheck.bind(this.receiveReplySerialsCache);
			}
		},
		
		/**
		 * register pending outgoing request task, see Principal.
		 */
		cacheWaitingTaskSerial : {
			/** function put(serial, task) **/
			execute : "once", get : function(){
				return this.waitingTaskSerialsCache.put.bind(this.waitingTaskSerialsCache);
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
						console.log("UDP::UdpPrincipal:onReceive:UhpPunch: %s: %s, address: %s, serial: %s", this, message, address, serial);
						/* ignore repeated messages with same serial */
						this.cacheIncomingQuerySerial(serial, true);
						/* check update local serial */
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

					if(this.puncher){
						return this.puncher.onUHP(message, address, serial);
					}
					
					console.log("UDP::UdpPrincipal:onReceive:UhpOther: %s: %s, address: %s, serial: %s, no puncher object.", this, message, address, serial);
					return undefined;
				}
				
				if(message.isReply){
					/** check task that awaits **/
					if( (task = this.waitingTaskSerialsCache.readCheck(serial)) ){
						console.log("UDP::UdpPrincipal:onReceive:ReplyTask: %s: %s, address: %s, serial: %s", this, message, address, serial);
						/** start asynchronous processing **/
						setTimeout(FN_TASK_ON_RECEIVE_ASYNC.bind(this, serial, task, message), 0);
						return;
					}
					/** check serial explicitly ignored **/
					if( false === task ){
						// console.info("UDP::UdpPrincipal:onReceive:ReplyIgnore: %s: %s, address: %s, serial: %s", this, message, address, serial);
						return;
					}
					/** reply without corresponting request still alive **/
					console.log("UDP::UdpPrincipal:onReceive:ReplySkip: %s: %s, address: %s, serial: %s", this, message, address, serial);
					return;
				}
				
				if(message.isRequest){
					console.log("UDP::UdpPrincipal:onReceive:Request: %s: %s, address: %s, serial: %s", this, message, address, serial);
					/** no repetitions for requests **/
					this.cacheIncomingQuerySerial(serial, true);
					return FN_ON_RECEIVE_PRINCIPAL.call(this, message, address, serial);
				}

				console.log("UDP::UdpPrincipal:onReceive:Skip: %s: %s, address: %s, serial: %s", this, message, address, serial);
				return;
			}
		},
		updateSecret : {
			value : function(secret, serial){
				console.log("UDP::UdpPrincipal:updateSecret: %s: secret?: %s, serial: %s, puncher: %s", this, !!secret, serial, this.puncher?.state);
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
		/** 
		 * for toString and logging (including debug logging)
		 */
		shortHostString : {
			execute : "once", get : function(){
				return this.hostId ?? (this.keyHex.substr(0, 8) + "... ");
			}
		},
		shortTypeString : {
			get : function(){
				return this.constructor.name ?? "RemoteServicePrincipal";
			}
		},
		toString : {
			value : function(){
				return ["[", this.shortTypeString, " ", this.shortHostString, " ", Format.jsObject(this.address), "]"].join("");
				return "[" + this.shortTypeString + " " + this.shortHostString + " " + Format.jsObject(this.address) + "]";
			}
		}
	}
);
