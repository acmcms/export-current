const ae3 = require("ae3");

const CLIENT_ON_UPDATE_TOKEN_XNS_FN = require("./ClientOnUpdateTokenXnsFn");

const ComponentCloud = module.exports = ae3.Class.create(
	"ComponentCloud",
	require("./../AbstractComponent"),
	function(client){
		this.AbstractComponent.call(this, client);
		return this;
	},
	{
		componentName : {
			value : "cloud"
		},
		acceptXmlNotifications : {
			value : ["ut3"]
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
				case "ut3":
					return CLIENT_ON_UPDATE_TOKEN_XNS_FN.call(this.client, id, data);
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

		cliNrpcUpdate : {
			value : function(){
				const clientRequest = this.client.createClientRequest();
				ComponentNrpc.RequestNrpcUpdate.append.call(this.client, clientRequest);
				return !!clientRequest.launch();
			}
		},
	},
	{
		RequestNrpcUpdate : {
			value : require("./RequestNrpcUpdate")
		},
		newInstance : {
			value : function(client){
				return new ComponentCloud(client);
			}
		}
	}
);
