const ae3 = require("ae3");

const CLIENT_ON_UPDATE_BOOKING_XNS_FN = require("./ClientOnUpdateBookingXnsFn");

const ComponentNdns = module.exports = ae3.Class.create(
	"ComponentNdns",
	require("./../AbstractComponent"),
	function(client){
		this.AbstractComponent.call(this, client);
		return this;
	},
	{
		componentName : {
			value : "ndns"
		},
		acceptXmlNotifications : {
			value : ['ubA','ut3']
		},
		
		requestXmlNotifications : {
			get : function(){
				if(this.lastUpdated && this.lastUpdated.getDate() + 2 * 60 * 60 * 1000 > Date.now()){
					return null;
				}
				return this.acceptXmlNotifications;
			}
		},
		
		onXmlNotification : {
			value : function(id, data){
				switch(id){
					case "ubA":
					return CLIENT_ON_UPDATE_BOOKING_XNS_FN.call(this.client, id, data);
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

		cliNdnsCheck : {
			value : function(name, domain){
				const clientRequest = this.client.createClientRequest();
				ComponentNdns.RequestNdnsCheck.append.call(this.client, clientRequest, name, domain);
				return !!clientRequest.launch();
			}
		},

		cliNdnsBook : {
			value : function(name, domain, address4, access4, address6, access6, transfer){
				const clientRequest = this.client.createClientRequest();
				ComponentNdns.RequestNdnsBook.append.call(this.client, clientRequest, name, domain, address4, access4, address6, access6, transfer);
				return !!clientRequest.launch();
			}
		},
		
		cliNdnsUpdate : {
			value : function(address4, access4, address6, access6){
				const clientRequest = this.client.createClientRequest();
				ComponentNdns.RequestNdnsUpdate.append.call(this.client, clientRequest, address4, access4, address6, access6);
				return !!clientRequest.launch();
			}
		},

		cliNdnsDrop : {
			value : function(name, domain){
				const clientRequest = this.client.createClientRequest();
				ComponentNdns.RequestNdnsDrop.append.call(this.client, clientRequest, name, domain);
				return !!clientRequest.launch();
			}
		},
	},
	{
		RequestNdnsCheck : {
			value : require("./RequestNdnsCheck")
		},
		RequestNdnsBook : {
			value : require("./RequestNdnsBook")
		},
		RequestNdnsUpdate : {
			value : require("./RequestNdnsUpdate")
		},
		RequestNdnsDrop : {
			value : require("./RequestNdnsDrop")
		},
		newInstance : {
			value : function(client){
				return new ComponentNdns(client);
			}
		}
	}
);