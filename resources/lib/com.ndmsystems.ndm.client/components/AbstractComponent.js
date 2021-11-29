const ae3 = require("ae3");

const AbstractComponent = module.exports = ae3.Class.create(
	"AbstractComponent",
	undefined,
	function(client){
		Object.defineProperty(this, "client", {
			value : client
		});
		return this;
	},
	{
		componentName : {
			/** 
			 * override with component name. must not be dynamic.
			 */
			value : null
		},
		acceptXmlNotifications : {
			/**
			 * return array of XNS names. must not be dynamic.
			 */
			value : null
		},
		requestXmlNotifications : {
			/**
			 * return array of XNS names. could be dynamic.
			 */
			execute : "once", get : function(){
				return this.acceptXmlNotifications;
			}
		},
		onXmlNotification : {
			value : function(id, data){
				return;
			}
		},
		acceptRpcCommands : {
			
		},
		onRpcCommand : {
			
		},
		
		client : {
			/** 
			 * property set by constructor
			 */
			value : null
		},
		
		prepareCall : {
			value : function(args){
				const name = args[0];
				const href = './../callbacks/'+this.componentName+'/Callback' + (name[0].toUpperCase()) + (name.substr(1));
				let callback;
				try{
					callback = require(href);
				}catch(e){
					console.log(">>>>>> ndm.client:component:%s:prepareCall: invalid callback: %s", this.componentName, name);
					return null;
				}
				
				callback = new callback(args);
				if(!callback){
					console.log(">>>>>> ndm.client:component:%s:prepareCall: invalid arguments: %s", this.componentName, args);
					return null;
				}
				
				if(!callback.prepareCallback(this)){
					console.log(">>>>>> ndm.client:component:%s:prepareCall: extra validation failed: %s", this.componentName, args);
					return null;
				}
				
				console.log(">>>>>> ndm.client:component:%s:prepareCall: ready: %s", this.componentName, callback);
				return callback.executeCallback.bind(callback, this, args);
			}
		}
	}
);