const ae3 = require("ae3");

/**
 * Only for nice looks in CLI
 */
const TARGET_LIST_PROPERTY = {
	enumerable : true,
	get : function(){
		return this.targetListArray;
	}, 
	set : function(x){
		Object.defineProperty(this, "targetListArray", {
			writable : true,
			value : x?.map 
				? x.map(function(x){
					return Object.create(x, {
						host : {
							value : String(x.address),
							enumerable : true,
						},
						port : {
							value : Number(x.port) | 0,
							enumerable : true
						}
					});
				}) 
				: x
		});
		return this.targetListArray;
	},
};

const Puncher = module.exports = ae3.Class.create(
	/* name */
	"Puncher",
	/* inherit */
	undefined,
	/* constructor */
	function(remoteService){
		Object.defineProperties(this, {
			remote : {
				value : remoteService
			},
			timerLoop : {
				value : this.timerLoop.bind(this)
			},
			targetList : TARGET_LIST_PROPERTY,
		});
		this.puncherReset();
		setTimeout(this.timerLoop, 1000);
		console.log("UDP::Puncher:init %s: puncher created", this);
		return this;
	},
	/* instance methods */
	{
		"state" : {
			value : "init"
		},
		
		"directAccess" : {
			value : false
		},
		
		"loopInterval" : {
			value : 10
		},
		
		"loopLimit" : {
			value : 10
		},
		
		"loopNumber" : {
			value : 0
		},
		
		"since" : {
			value : 0
		},
		
		// list of SocketAddress to search
		"targetList" : TARGET_LIST_PROPERTY,
		
		"onUHP" : {
			value : function(message, address, serial){
				// if(message.isUHP_FROM_SERVER){
				if(message.isMEET){
					return this.onMeet(message, address);
				}
				
				if(message.isSEEN){
					return this.onSeen(message, address, serial);
				}
				// }
				console.log("UDP::Puncher:onUHP: %s: %s, address: %s, unsupported message type!", this, meet, address);
			}
		},
		"onMeet" : {
			value : function(meet, address){
				console.log("UDP::Puncher:onMeet: state: %s, %s: %s, address: %s", this.state, this.remote, meet, address);
				this.puncherReset();
				return false;
			}
		},
		
		"onSeen" : {
			value : function(seen, address, serial){
				Object.defineProperty(this.remote, "dst",{
					writable : true,
					value : address
				});
				// sets loopInterval & loopLimit
				if(!seen.parseMode(this)){
					// mode is 0x00 - reset and exit
					this.puncherReset();
					console.log("UDP::Puncher:onSeen: state: %s, %s: %s, address: %s, code 0x00, puncher reset into enabled state.", this.state, this.remote, seen, address);
					return false;
				}
				this.since = 0;
				if(this.state === "search"){
					Object.defineProperty(this, "timerTask", {
						value : this.loopActive.bind(this),
						writable : true
					});
					this.state = "active";
					console.log("UDP::Puncher:onSeen: state: %s, %s: %s, address: %s, puncher mode switched search->active", this.state, this.remote, seen, address);
					return true;
				}
				console.log("UDP::Puncher:onSeen: state: %s, %s: %s, address: %s", this.state, this.remote, seen, address);
				return true;
			}
		},

		"puncherReset" : {
			value : function(){
				if(this.remote.targetSpec){
					Object.defineProperty(this.remote, "dst",{
						writable : true,
						value : null
					});
					this.targetList = null;
				}
				this.since = 0;
				this.directAccess = false;
				this.loopLimit = 5;
				this.loopInterval = 2;
				Object.defineProperties(this, {
					"timerTask": {
						value : this.loopEnabled.bind(this),
						writable : true
					},
					"timerDate": {
						value : 0,
						writable : true
					}
				});
				if(this.state === "stopped"){
					setTimeout(this.timerLoop, 1000);
					console.log("UDP::Puncher:puncherReset: %s: puncher timer loop task restarted", this);
				}
				this.state = "enabled";
			}
		},
		
		"switchDisabled" : {
			value : function(error){
				this.error = "prev: " + this.state + ", error: " + error;
				Object.defineProperty(this, "timerTask", {
					value : this.loopDisabled.bind(this),
					writable : true
				});
				this.state = "disabled";
			}
		},
		
		"loopDisabled" : {
			value : function(){
				// empty
			}
		},
		
		"loopEnabled" : {
			value : function(){
				if(this.state !== "enabled"){
					return;
				}
				this.error && (this.error = "...processing");
				if(!this.targetList?.length){
					var spec = this.remote.targetSpec;
					if(!spec){
						return this.switchDisabled("No target spec");
					}
					
					if(!this.remote.secret || this.since === 0){
						if(this.remote.updateToken){
							try{
								if(!this.remote.updateToken()){
									this.error = "Can't updateToken.";
									return;
								}
							}catch(e){
								this.error = "Error doing updateToken: " + Format.throwableAsPlainText(e);
								return;
							}
						}
						if(!this.remote.secret){
							this.error = "No 'secret' could be resolved.";
							return;
						}
					}
					
					try{
						this.targetList = ae3.net.socketAddressArray(spec);
					}catch(e){
						this.targetList = null;
						this.error = "Error resolving target spec: " + Format.jsObject(spec) + ", error: " + Format.throwableAsPlainText(e);
						return;
					}

					if(!this.targetList?.length){
						this.error = "Spec produce no usable addresses: " + Format.jsObject(spec);
						return;
					}
				}
				if(!this.remote.key){
					this.error = "'Token Alias' is not set!";
					return;
				}
				if(!this.remote.secret){
					this.error = "'Token Secret' is not set!";
					return;
				}
				
				if(!this.targetList?.length){
					this.error = "No targets available";
					return;
				}
				
				delete this.error;
				this.since = 0;
				this.directAccess = false;
				this.loopLimit = 5;
				this.loopInterval = 2;
				Object.defineProperty(this, "timerTask", {
					value : this.loopSearch.bind(this),
					writable : true
				});
				this.state = "search";
				console.log("UDP::Puncher:loopEnabled: %s: puncher mode switched to 'search'", this.remote);
			}
		},
		
		"loopSearch" : {
			value : function(){
				if(this.state !== "search"){
					return;
				}
				const targetList = this.targetList;
				if(targetList){
					if(this.since > this.loopLimit){
						targetList.forEach((function(meet, target){
							this.remote.sendSingle(meet, target);
							console.log("UDP::Puncher:loopSearch: %s: puncher send meet: %s, %s", this.remote, meet, target);
						}).bind(this, new this.remote.MSG_Q_MEET()));
						this.puncherReset();
						console.log("UDP::Puncher:loopSearch: %s: puncher mode switched to 'enabled'", this.remote);
						return;
					}
					targetList.forEach((function(helo, target){
						this.remote.sendSingle(helo, target);
						console.log("UDP::Puncher:loopSearch: %s: send helo: %s, %s", this.remote, helo, target);
					}).bind(this, new this.remote.MSG_Q_HELO(this.remote.localSocketAddress, ++this.remote.sTx)));
				}
				++ this.since;
			}
		},
		
		"loopActive" : {
			value : function(){
				if(this.state !== "active"){
					return;
				}
				if(this.since > this.loopLimit){
					this.since = 0;
					this.loopLimit = 5;
					this.loopInterval = 5;
					this.state = "search";
					Object.defineProperty(this, "timerTask", {
						value : this.loopSearch.bind(this),
						writable : true
					});
					console.log("UDP::Puncher:loopActive: %s: mode switched to 'search'", this.remote);
					return;
				}
				console.log("UDP::Puncher:loopActive: %s: poke out (direct:%s)", this.remote, this.directAccess);
				var poke = this.directAccess 
					? new this.remote.MSG_Q_POKD(this.remote.localSocketAddress) 
					: new this.remote.MSG_Q_POKE(this.remote.localSocketAddress)
				;
				this.remote.sendSingle(poke, null);
				++ this.since;
			}
		},
		
		"timerLoop" : {
			value : function(){
				if(this.state === "stopping..."){
					// stop
					this.state = "stopped";
					Object.defineProperty(this, "timerDate", {
						value : -1,
						writable : true
					});
					console.log("UDP::Puncher:timeLoop: %s: puncher destroyed, task stopped", this);
					return;
				}
				if(this.timerDate > Date.now()){
					setTimeout(this.timerLoop, 1000);
					return;
				}
				if(this.remote.active === false){
					console.log("UDP::Puncher:timerLoop: %s: remote inactive...", this);
					setTimeout(this.timerLoop, 1000);
					return;
				}
				try{
					this.timerTask.call(this);
				}finally{
					Object.defineProperty(this, "timerDate", {
						value : Date.now() + this.loopInterval * 1000,
						writable : true
					});
					setTimeout(this.timerLoop, 1000);
				}
				return;
			}
		},
		
		"destroy" : {
			value : function(){
				this.state = "stopping...";
				console.log("UDP::Puncher:destroy: %s: puncher destroyed", this);
			}
		},
		
		"toString" : {
			value : function(){
				return "[Puncher " + this.state + " " + this.remote + "]";
				return ["[Puncher ", this.state, " ", this.remote, "]"].join("");
			}
		}
	}
);
