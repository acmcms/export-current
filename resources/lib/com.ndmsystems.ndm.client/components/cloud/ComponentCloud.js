const ae3 = require("ae3");

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
			value : ['ubA','ut1']
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
				case "ut1":
					return this.client.onUpdateTokenXns(id, data);
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
				return new ComponentCloud(client);
			}
		}
	}
);
