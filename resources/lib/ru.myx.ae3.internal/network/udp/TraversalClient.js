
function TraversalClient(key, dst, secret, serial){
	if(!key){
		throw new Error("TraversalClient: key is requried!");
	}
	if(!dst){
		throw new Error("TraversalClient: dst is requried!");
	}
	this.Principal(key, dst, secret, serial);
	return this;
}

TraversalClient.prototype = Object.create(require('./Principal').prototype, {
	TraversalClient : {
		value : TraversalClient
	},
	onReceive : {
		value : function(message, address, serial){
			// console.log('>>> >>> %s: onReceive: %s, address: %s, serial: %s', this, message, address, serial);
			// wrong - use fifo
			this.sRx = serial;
			if(message.isUHP_PUNCH){
				return this.sendSingle(
					new this.MSG_RF_SEEN(
						serial,
						address.port, 
						message.isHELO 
							? 0xA0 
							: 0x84 
					),
					address
				);
			}
			return this.Principal.prototype.onReceive.call(this, message, address, serial);
		}
	},
	toString : {
		value : function(){
			return "[TraversalClient " + Format.binaryAsHex(this.key) + ", " + Format.jsObject(this.address) + "]";
		}
	}
});

module.exports = TraversalClient;