const ae3 = require('ae3');

const UdpCloudService = require('./UdpCloudService');

const f = {
	/**
	 * this - UdpCloudService
	 */
	handlerCall : function handlerStat(peer, message, address, serial){
		const component = message.component;
		if(component !== 'cloud'){
			console.log(">>>>>> ndm.client:UdpCloudService::handlerCall: invalid component: %s", component);
			peer.sendSingle(new this.MsgCerr(serial, 0x01 /* No Such Component */), address);
			return;
		}
		const args = message.argument.toStringUtf8().split('\n');
		const name = args[0];
		const href = './callbacks/Callback' + (name[0].toUpperCase()) + (name.substr(1));
		var callback;
		try{
			callback = require(href);
		}catch(e){
			console.log(">>>>>> ndm.client:UdpCloudService::handlerCall: invalid callback: %s", name);
			peer.sendSingle(new this.MsgCerr(serial, 0x03 /* Invalid Arguments */), address);
			return;
		}
		
		callback = new callback(args);
		if(!callback){
			console.log(">>>>>> ndm.client:UdpCloudService::handlerCall: invalid arguments: %s", name);
			peer.sendSingle(new this.MsgCerr(serial, 0x03 /* Invalid Arguments */), address);
			return;
		}
		
		console.log(">>>>>> ndm.client:UdpCloudService::handlerCall(%s, %s) => CACK, callback: %s", peer, message, callback);
		peer.sendSingle(new this.MsgCack(serial), address);
		setTimeout(callback.executeCallback.bind(callback, peer.client, args), 0);
	},
};

function UdpCloudClient(client, key, secret, serial){
	this.RemoteServicePrincipal(key, undefined, secret, serial);
	Object.defineProperties(this, {
		client : {
			value : client
		},
		targetSpec : {
			value : 'udp.' + client.ndssHost + ':4044'
		}
	});
	this.registerHandler(this.iface.MsgCall, f.handlerCall.bind(this.iface, this));
	return this;
}


UdpCloudClient.prototype = Object.create(UdpCloudService.RemoteServicePrincipal.prototype, {
	"UdpCloudClient" : {
		value : UdpCloudClient
	},
	"localSocketAddress" : {
		value : UdpCloudService.sock.localSocketAddress
	},
	"iface" : {
		value : UdpCloudService
	},
	"sendUdp" : {
		value : UdpCloudService.sendUdp
	},
	"start" : {
		value : function(){
			UdpCloudService.registerClient(this);
			this.RemoteServicePrincipal.prototype.start.call(this);
		}
	},
	"destroy" : {
		value : function(){
			UdpCloudService.removeClient(this);
			this.RemoteServicePrincipal.prototype.destroy.call(this);
		}
	},
	"toString" : {
		value : function(){
			return "[UdpCloudClient, target=" + this.targetSpec + ", client=" + this.client + ", service=" + UdpCloudService + "]";
		}
	}
});

Object.defineProperties(UdpCloudClient, {
	"toString" : {
		value : function(){
			return "[UdpCloudClientClass]";
		}
	}
});

module.exports = UdpCloudClient;