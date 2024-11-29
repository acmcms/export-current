/**
 * 'this' to be bint to stateDomain
 **/
const MakeRsstReplyFn = function(rrst){
	var queryItem, rsst = this.createReplyBuilder();
	/** FIXME: TODO: */
	var supported = this.allSupportedResponseCodes();
	
	for(queryItem of rrst){
		console.log("ndm.client::cloud::HandlerRrst:iterateRRST: %s", queryItem.formatAsTextString());
		// this.
		// rsst.add(stateDomain);
	}
	return rsst;
};

/**
 * 
 * 'this' must be bint to an UdpCloudClient instance
 * 'iface' is UdpCloudService instance
 * 
**/
const HandlerRrst = module.exports = function(iface, message, address, serial){
	
	const rrst = message.rrst;
	
	if(!rrst){
		console.log("ndm.client::cloud::HandlerRrst: %s: %s => CERR: no rrst body", this, message);
		this.sendSingle(new iface.MSG_RF_CERR(serial, 0x03 /* Invalid Arguments */), address);
		return;
	}
	
	// console.log("ndm.client::cloud::HandlerRrst: %s: %s => CERR, request", this, message);
	// this.sendSingle(new iface.MSG_RF_CERR(serial, 0x01 /* No Such Component */), address);
	// return;

	const rsst = MakeRsstReplyFn.call(this.client.stateDomain, rrst);

	console.log("ndm.client::cloud::HandlerRrst: %s: %s => RSST: %s", this, message, rsst);
	this.sendSingle(new iface.MSG_RF_RSST(rsst, serial), address);
	
};
