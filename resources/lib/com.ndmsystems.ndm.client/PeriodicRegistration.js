
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
			var key, client;
			for keys(key in clients){
				client = clients[key];
				console.sendMessage("NDM.Client: running: " + key);
				client.run(console);
			}
			console.sendMessage("NDM.Client: periodic done.");
			return true;
		}
	},
	toString : {
		value : function(){
			return "[PeriodicRegisterTask]";
		}
	}
});

