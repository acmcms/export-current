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
	},
	{
		newInstance : {
			value : function(client){
				return new ComponentNdns(client);
			}
		}
	}
);