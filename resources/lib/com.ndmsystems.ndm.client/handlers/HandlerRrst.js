const UdpCloudService = require('./../UdpCloudService');

/**
 * 'this' to be bint to stateDomain
 **/
const MakeRsstReplyFn = function(rrst){
	var queryItem, rsst = this.createReplyBuilder();
	/** FIXME: TODO: */
	var supported = this.allSupportedResponseCodes();
	
	for(queryItem of rrst){
		console.log(">>>>>> ndm.client:UdpCloudService::iterateRRST: %s", queryItem.formatAsTextString());
		// this.
		// rsst.add(stateDomain);
	}
	return rsst;
};

/**
 * 
 * 'this' must be bint to an UdpCloudClient instance
 * 
**/
const HandlerRrst = module.exports = function(message, address, serial){
	const rrst = message.rrst;
	if(!rrst){
		console.log(">>>>>> ndm.client:UdpCloudService::handlerRRST(%s, %s) => CERR: no rrst body", this, message);
		this.sendSingle(new UdpCloudService.MSG_RF_CERR(serial, 0x03 /* Invalid Arguments */), address);
		return;
	}
	
	// console.log(">>>>>> ndm.client:UdpCloudService::handlerRRST(%s, %s) => CERR, request", this, message);
	// this.sendSingle(new UdpCloudService.MSG_RF_CERR(serial, 0x01 /* No Such Component */), address);
	// return;

	const rsst = MakeRsstReplyFn.call(this.client.stateDomain, rrst);

	console.log(">>>>>> ndm.client:UdpCloudService::handlerRRST(%s, %s) => RSST: %s", this, message, rsst);
	this.sendSingle(new UdpCloudService.MSG_RF_RSST(rsst, serial), address);
};
