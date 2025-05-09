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
				var callbackClass;
				try{
					callbackClass = require(href);
				}catch(e){
					console.log("ndm.client::AbstractComponent:prepareCall: %s: no such component: %s", this.componentName, name);
					return 0x01;
				}
				
				const callback = new callbackClass(args);
				if(!callback){
					/** ^^^ callback constructor fails to construct an object, CERR 0x03 - invalid arguments */
					console.log("ndm.client::AbstractComponent:prepareCall: %s: invalid arguments: %s", this.componentName, args);
					return 0x03;
				}
				
				const prepareResult = callback.prepareCallback(this);
				
				// null, undefined, false, zero...
				if(!prepareResult){
					console.log("ndm.client::AbstractComponent:prepareCall: %s: extra validation failed: %s", this.componentName, args);
					return null;
				}
				
				// byte
				if(prepareResult === (prepareResult & 0xFF)){
					console.log("ndm.client::AbstractComponent:prepareCall: %s: extra validation failed: code: 0x%04X, args: %s", this.componentName, prepareResult, args);
					return prepareResult;
				}
				
				if(true !== prepareResult){
					console.log("ndm.client::AbstractComponent:prepareCall: %s: extra validation failed: %s", this.componentName, args);
					return 0x03;
				}
				
				console.log("ndm.client::AbstractComponent:prepareCall: %s: ready: %s", this.componentName, callbackClass);
				return callback.executeCallback.bind(callback, this, args);
			}
		}
	}
);
