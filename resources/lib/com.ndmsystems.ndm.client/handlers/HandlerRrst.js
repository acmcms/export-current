const UdpCloudService = require('./../UdpCloudService');
const MakeRsstReplyFn = require("java.class/ru.myx.ae3.state.RemoteServiceStateSAPI").makeRsstReplyUsingDomain;

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

	/** FIXME: TODO: */
	const rsst = MakeRsstReplyFn(rrst, this.client.stateDomain);

	console.log(">>>>>> ndm.client:UdpCloudService::handlerRRST(%s, %s) => RSST, request", this, message);
	this.sendSingle(new UdpCloudService.MSG_RF_RSST(rsst, serial), address);
	setTimeout(result, 0);
};
