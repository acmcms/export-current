const UdpCloudService = require('./../UdpCloudService');

/**
 * 
 * 'this' must be bint to an UdpCloudClient instance
 * 
**/
const HandlerCall = module.exports = function(message, address, serial){
	const component = this.client.components[message.component];
	if(undefined === component || !component.AbstractComponent){
		console.log("ndm.client::cloud::HandlerCall: %s: invalid component: %s", this, message.component);
		this.sendSingle(new UdpCloudService.MSG_RF_CERR(serial, 0x01 /* No Such Component */), address);
		return;
	}
	const args = message.argument.toStringUtf8().split('\n');
	const result = component.prepareCall(args);
	if(!result){
		console.log("ndm.client::cloud::HandlerCall: %s: %s => CERR: %s", this, message, component.componentName);
		this.sendSingle(new UdpCloudService.MSG_RF_CERR(serial, 0x03 /* Invalid Arguments */), address);
		return;
	}
	console.log("ndm.client::cloud::HandlerCall: %s: %s => CACK, %s", this, message, component.componentName);
	this.sendSingle(new UdpCloudService.MSG_RF_CACK(serial), address);
	setTimeout(result, 0);
};
