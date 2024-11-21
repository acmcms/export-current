Object.defineProperties(exports, {
	description : {
		enumerable : true,
		value : "'ndm.client's periodic task (cloud services registration update)."
	},
	run : {
		value : function(){
			console.sendMessage("ndm.client::PeriodicRegistration:run: periodic start.");
			const NdmCloudService = require('./NdmCloudService');
			const clients = NdmCloudService.getClients();
			for(let client of clients){
				console.sendMessage("ndm.client: running: " + client.clientId);
				client.run(console);
			}
			console.sendMessage("ndm.client::PeriodicRegistration:run: periodic done.");
			return true;
		}
	},
	toString : {
		value : function(){
			return "[ndm.client  PeriodicTask]";
		}
	}
});
