const ae3 = require('ae3');
const vfs = ae3.vfs;
const Client = require('./Client');


/**
 * Tells whether service is started or stopped
 */
let stopped = true;

/**
 * Client persistent state data location
 */
const clientsFolder = ae3.vfs.ROOT.relativeFolderEnsure("storage/data/ndm.client/clients");

/**
 * Client instances map
 */
const CLIENT_MAP = {};


const f = {
	checkClients : function(){
		console.log("ndm.client::NdmCloudService:checkClients: starting...");

		this.udpService || Object.defineProperty(this, "udpService", {
			writable : true,
			value : require('./UdpCloudService')
		});

		const clients = ae3.Util.Settings.SettingsBuilder.builderSimple()//
			.setInputFolderPath("settings/ndm.ndss-client")//
			.setDescriptorReducer(function(settings, description){
				if (description.type !== "ndm.client/Connection") {
					return settings;
				}
				const name = description.name;
				if(!name){
					throw "Client 'name' is expected!";
				}
				const folder = clientsFolder.relativeFolder(name);
				settings[name] = new Client(
					folder, 
					description.service, 
					description.override
				);
				return settings;
			})//
			.get()
		;

		for(var key of Object.keys(clients)){
			if(!CLIENT_MAP[key]){
				CLIENT_MAP[key] = clients[key];
				CLIENT_MAP[key].start();
			}
		}
		
		console.log("ndm.client::NdmCloudService:checkClients: file based configuration loaded, clients: [%s]", Object.keys(clients).join());

		/** do not auto-start */
		for(var folder of clientsFolder.getContentCollection(null).filter(vfs.isContainer)){
			if(undefined === clients[folder.key]){
				CLIENT_MAP[folder.key] = clients[folder.key] = new Client(folder);
			}
		}

		console.log("ndm.client::NdmCloudService:checkClients: vfs persistent checked, clients folder: %s, clients: [%s]", clientsFolder, Object.keys(clients).join());
		
		for(var key of Object.keys(CLIENT_MAP)){
			if(!clients[key]){
				CLIENT_MAP[key].destroy();
				delete CLIENT_MAP[key];
			}
		}
		console.log("ndm.client::NdmCloudService:checkClients: done. clients: [%s]", Object.keys(CLIENT_MAP).join());
	}
};


Object.defineProperties(exports, {
	udpService : {
		writable : true,
		value : null
	},
	description : {
		enumerable : true,
		value : "'ndm.client' service: cloud registration and UDP push notifications support."
	},
	
	
	
	getClient : {
		value : function(key){
			return CLIENT_MAP[key];
		}
	},
	getClients : {
		value : function(){
			return Object.assign({}, CLIENT_MAP);
		}
	},
	updateClient : {
		value : function(clientId, licenseNumber, serviceKey){
			const clientCurrent = CLIENT_MAP[clientId];
			const folder = clientsFolder.relativeFolderEnsure(clientId); // clientsFolder.relativeFolder(clientId);
			if(!Client.storeRaw(folder, clientId, ndssHost, licenseNumber, serviceKey)){
				return false;
			}
			const clientUpdated = new Client(folder);
			if(clientCurrent){
				if(clientCurrent.equals(clientUpdated)){
					return clientCurrent;
				}
				clientCurrent.destroy();
			}
			CLIENT_MAP[clientId] = clientUpdated;
			clientUpdated.start();
			return clientUpdated;
		}
	},
	
	
	
	start : {
		value : ae3.Concurrent.wrapSync(function(){
			if(!stopped){
				throw "already started";
			}
			stopped = false;
			
			setTimeout(f.checkClients.bind(this), 500);
		})
	},
	stop : {
		value : ae3.Concurrent.wrapSync(function(){
			if(stopped){
				throw "already stopped";
			}
			stopped = true;
			
			if(this.udpService !== null){
				this.udpService.destroy?.();
				Object.defineProperty(this, "udpService", {
					writable : true,
					value : null
				});
			} 
		})
	},
	toString : {
		value : function(){
			return "[NdmClientService, started: " + (!stopped) + "]";
		}
	}
});
