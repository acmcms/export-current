const ae3 = require('ae3');
const Concurrent = ae3.Concurrent;

const f = {
	Puncher : require('./Puncher'),
	taskPendingTimeout : function(serial, task){
		this.tasksFinished.put(serial, task);
		task.onDestroy();
	},
	taskFinishedTimeout : function(serial, task){
		this.sRx < serial && (this.sRx = serial);
	}
};

function asyncTaskOnReceive(task, message){
	task.onReceive(message) === true || this.taskFinished(task.serial);
}


const RemoteServicePrincipal = module.exports = ae3.Class.create(
	/* name */
	"RemoteServicePrincipal",
	/* inherit */
	require('./Principal'),
	/* constructor */
	function(key, dst, secret, serial){
		this.Principal(key, dst, secret, serial);

		const tasksFinished = new Concurrent.CoarseDelayCache(3000, 9, f.taskFinishedTimeout.bind(this));
		
		Object.defineProperties(this, {
			"tasksPending" : {
				value : new Concurrent.CoarseDelayCache(2000, 7, f.taskPendingTimeout.bind(this))
			},
			"tasksFinished" : {
				value : tasksFinished
			},
		});
		
		if(this.isIgnoreSerial === RemoteServicePrincipal.prototype.isIgnoreSerial){
			Object.defineProperties(this, {
				"isIgnoreSerial" : {
					value : tasksFinished.readCheck.bind(tasksFinished)
				},
			});
		}

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
		isIgnoreSerial : {
				/**
				 * overriden by (faster) direct bind in constructor when
				 * following reference implementation.is not overriden in
				 * extending class prototype
				 * 
				 * actually it is semantically the same as
				 * <code>`execute : 'once', get : function(serial){`
				 * 	return this.tasksFinished.readCheck.bind(this.tasksFinished);
				 * }
				 * </code>
				 */
			value : function(serial){
				
				return this.tasksFinished.readCheck(serial);
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
			value : Concurrent.wrapSync(function(){
				this.puncher || (this.puncher = new f.Puncher(this));
			})
		},
		destroy : {
			value : Concurrent.wrapSync(function(){
				var puncher = this.puncher;
				if(puncher){
					this.puncher = null;
					puncher.destroy();
				}
			})
		},
		taskPending : {
			value : function(serial, task){
				this.tasksPending.put(serial, task);
			}
		},
		taskFinished : {
			value : function(serial){
				this.tasksFinished.put(serial, true);
				this.tasksPending.remove(serial);
			}
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
				const task = message.isReply && this.tasksPending.readCheck(serial);
				if(task){
					// console.log('>>> >>> %s: onReceive, task: %s, address: %s, serial: %s, task: %s', this, message, address, serial, task);
					setTimeout(asyncTaskOnReceive.bind(this, task, message), 0);
					return;
				}
				if(message.isUHP){
					// if(message.isUHP_FROM_SERVER){
					
					if(message.isMEET){
						return this.puncher && this.puncher.onMeet(message, address);
					}
					
					if(message.isSEEN){
						return this.puncher && this.puncher.onSeen(message, address, serial) && this.tasksFinished.put(serial, false);
					}
					
					// }
					
					// if(message.isUHP_PUNCH){
					
					// no repetitions
					this.tasksFinished.put(serial, false);
					
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
					
					// }
				}
				
				// no repetitions
				this.tasksFinished.put(serial, false);
				
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
