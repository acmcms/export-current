const UdpCloudService = require('./../UdpCloudService');

/**
 * 
 * 'this' must be bint to an UdpCloudClient instance
 * 
**/
const HandlerCall = module.exports = function(message, address, serial){
	const component = this.client.components[message.component];
	if(undefined === component || !component.AbstractComponent){
		console.log(">>>>>> ndm.client:UdpCloudService::handlerCall: invalid component: %s", message.component);
		this.sendSingle(new UdpCloudService.MsgCerr(serial, 0x01 /* No Such Component */), address);
		return;
	}
	const args = message.argument.toStringUtf8().split('\n');
	const result = component.prepareCall(args);
	if(!result){
		console.log(">>>>>> ndm.client:UdpCloudService::handlerCall(%s, %s) => CERR: %s", this, message, component.componentName);
		this.sendSingle(new UdpCloudService.MsgCerr(serial, 0x03 /* Invalid Arguments */), address);
		return;
	}
	console.log(">>>>>> ndm.client:UdpCloudService::handlerCall(%s, %s) => CACK, %s", this, message, component.componentName);
	this.sendSingle(new UdpCloudService.MsgCack(serial), address);
	setTimeout(result, 0);
};
