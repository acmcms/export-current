Object.defineProperties(exports, {
	description : {
		enumerable : true,
		value : "'ndm.client's periodic task (cloud services registration update)."
	},
	run : {
		value : function(){
			console.sendMessage("NDM.Client: periodic start.");
			const NdmCloudService = require('./NdmCloudService');
			const clients = NdmCloudService.getClients();
			for(let client of clients){
				console.sendMessage("NDM.Client: running: " + client.clientId);
				client.run(console);
			}
			console.sendMessage("NDM.Client: periodic done.");
			return true;
		}
	},
	toString : {
		value : function(){
			return "[NDM.Client  PeriodicTask]";
		}
	}
});

