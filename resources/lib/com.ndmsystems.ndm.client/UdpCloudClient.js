const ae3 = require('ae3');

const UdpCloudService = require('./UdpCloudService');

const UdpCloudClient = module.exports = ae3.Class.create(
	"UdpCloudClient",
	UdpCloudService.RemoteServicePrincipal,
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
		// this.registerHandler(this.iface.MsgCall, f.handlerCall.bind(this.iface, this));
		this.registerHandler(UdpCloudService.MsgCall, (function (message, address, serial){
			const component = message.component;
			if(component !== 'cloud' && component !== 'ndmp'){
				console.log(">>>>>> ndm.client:UdpCloudService::handlerCall: invalid component: %s", component);
				this.sendSingle(new UdpCloudService.MsgCerr(serial, 0x01 /* No Such Component */), address);
				return;
			}
			const args = message.argument.toStringUtf8().split('\n');
			const name = args[0];
			const href = './callbacks/'+component+'/Callback' + (name[0].toUpperCase()) + (name.substr(1));
			var callback;
			try{
				callback = require(href);
			}catch(e){
				console.log(">>>>>> ndm.client:UdpCloudService::handlerCall: invalid callback: %s", name);
				this.sendSingle(new UdpCloudService.MsgCerr(serial, 0x03 /* Invalid Arguments */), address);
				return;
			}
			
			callback = new callback(args);
			if(!callback){
				console.log(">>>>>> ndm.client:UdpCloudService::handlerCall: invalid arguments: %s", name);
				this.sendSingle(new UdpCloudService.MsgCerr(serial, 0x03 /* Invalid Arguments */), address);
				return;
			}
			
			console.log(">>>>>> ndm.client:UdpCloudService::handlerCall(%s, %s) => CACK, callback: %s", this, message, callback);
			this.sendSingle(new UdpCloudService.MsgCack(serial), address);
			setTimeout(callback.executeCallback.bind(callback, this.client, args), 0);
		}).bind(this));
		return this;
	},
	{
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
	}
);


