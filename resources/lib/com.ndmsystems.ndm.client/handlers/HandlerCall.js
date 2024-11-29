/**
 * 
 * 'this' must be bint to an UdpCloudClient instance
 * 'iface' is UdpCloudService instance
 * 
**/
const HandlerCall = module.exports = function(iface, message, address, serial){
	
	const component = this.client.components[message.component];
	
	if(undefined === component || !component.AbstractComponent){
		console.log("ndm.client::cloud::HandlerCall: %s: invalid component: %s", this, message.component);
		this.sendSingle(new iface.MSG_RF_CERR(serial, 0x01 /* No Such Component */), address);
		return;
	}
	
	const args = message.argument.toStringUtf8().split('\n');
	
	const result = component.prepareCall(args);
	
	if(result === (result & 0xFF)){
		console.log("ndm.client::cloud::HandlerCall: %s: %s => CERR 0x%02X: %s", this, message, (result|0), component.componentName);
		this.sendSingle(new iface.MSG_RF_CERR(serial, (result|0) || 0x03 /* Invalid Arguments */), address);
		return;
	}
	
	if(null === (result ?? null)){
		console.log("ndm.client::cloud::HandlerCall: %s: %s => CERR 0x03 default: %s", this, message, component.componentName);
		this.sendSingle(new iface.MSG_RF_CERR(serial, 0x03 /* Invalid Arguments */), address);
		return;
	}
	
	if("function" === typeof result){
		console.log("ndm.client::cloud::HandlerCall: %s: %s => CACK, %s", this, message, component.componentName);
		this.sendSingle(new iface.MSG_RF_CACK(serial), address);
		setTimeout(result, 0);
		return;
	}
	
	console.log("ndm.client::cloud::HandlerCall: %s: %s => CACK, no task, %s", this, message, component.componentName);
	this.sendSingle(new iface.MSG_RF_CACK(serial), address);
	
};
