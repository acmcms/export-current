const ae3 = require("ae3");

const CLIENT_ON_UPDATE_LINKING_XNS_FN = require("./ClientOnUpdateLinkingXnsFn");
const CLIENT_ON_UPDATE_MANAGEMENT_XNS_FN = require("./ClientOnUpdateManagementXnsFn");

const ComponentNdmp = module.exports = ae3.Class.create(
	"ComponentNdmp",
	require("./../AbstractComponent"),
	function(client){
		this.AbstractComponent.call(this, client);
		return this;
	},
	{
		componentName : {
			value : "ndmp"
		},
		acceptXmlNotifications : {
			value : ["ut3", "cc3", "um1", "cl1"]
		},
		
		requestXmlNotifications : {
			get : function(){
				if(this.lastUpdated && this.lastUpdated.getDate() + 4 * 60 * 60 * 1000 > Date.now()){
					return null;
				}
				return this.acceptXmlNotifications;
			}
		},
		
		onXmlNotification : {
			value : function(id, data){
				switch(id){
					
				case "cl1":
					return CLIENT_ON_UPDATE_LINKING_XNS_FN.call(this.client, id, data);
					
				case "um1":
					return CLIENT_ON_UPDATE_MANAGEMENT_XNS_FN.call(this.client, id, data);
					
				}
				return;
			}
		},
		
		lastUpdated : {
			/**
			 * last time data was successfully updated
			 */
			value : null
		},
		
			
		cliNdmpServices : {
			value : function(service){
				const clientRequest = this.client.createClientRequest();
				ComponentNdmp.RequestNdmpServices.append.call(this, clientRequest, service);
				return !!clientRequest.launch();
			}
		},
			
		cliNdmpPrepare : {
			
		},
			
		cliNdmpLinks : {
			
		},
			
		cliNdmpUnlink : {
			
		},

	
	},
	{
		RequestNdmpServices : {
			value : require("./RequestNdmpServices")
		},
		newInstance : {
			value : function(client){
				return new ComponentNdmp(client);
			}
		}
	}
);
