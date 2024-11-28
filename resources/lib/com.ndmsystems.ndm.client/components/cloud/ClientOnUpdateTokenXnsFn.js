/**
 *
 */


const WebInterface = require('ae3').web.WebInterface;


/**
 * 'this'- must be bint to an instance of Client
 */
const ClientOnUpdateTokenXnsFn = module.exports = function(xnsId, xnsData){
	this.ndnsAlias = Format.hexAsBinary(xnsData.alias);
	this.ndnsSecret = Format.hexAsBinary(xnsData.secret);
	this.ndnsSettings = xnsData.settings;
	const ndmpHost = this.ndmpHost;
	if(xnsData.alias && xnsData.settings?.domain){
		this.ndmpZone = xnsData.settings.domain;
		this.ndmpHost = xnsData.alias.substring(0, 24) + '.' + this.ndmpZone;
		console.log("ndm.client::Client::onUpdateTokenXns: '%s': '%s' notification handler, system name: %s", this.clientId, xnsId, this.ndmpHost);
	}else{
		this.ndmpHost = null;
	}
	if(ndmpHost !== this.ndmpHost){
		if(this.ndmpHost){
			
			/** only for reference / logging, not loaded on init **/
			this.vfs.setContentPublicTreePrimitive("ndmpHost", this.ndmpHost);
			
			/** register handler **/
			WebInterface.localNameUpsert(this.ndmpHost, "ndmc-ndmp-" + this.clientId);
			
			console.log("ndm.client::Client::onUpdateTokenXns: '%s': '%s', name registered: %s", this.clientId, xnsId, this.ndmpHost);
			
		}else{

			/** only for reference / logging, not loaded on init **/
			this.vfs.setContentUndefined("ndmpHost");
			
			/** un-register handler **/
			WebInterface.localNameRemove(ndmpHost, "ndmc-ndmp-" + this.clientId);

			console.log("ndm.client::Client::onUpdateTokenXns: '%s': '%s', name un-registered: %s", this.clientId, xnsId, ndmpHost);
			
		}
	}
	
	const uClient = this.udpCloudClient;
	if(uClient){
		if(uClient.secret != this.ndnsSecret){
			uClient.destroy();
			(this.udpCloudClient = new this.UdpCloudClient(this, this.ndnsAlias.slice(0, 12), this.ndnsSecret, 0)).start();
		}else{
			console.log("ndm.client::Client::onUpdateTokenXns: '%s': '%s', re-using udp cloud client: ", this.clientId, xnsId, udpCloudClient);
		}
	}else{
		(this.udpCloudClient = new this.UdpCloudClient(this, this.ndnsAlias.slice(0, 12), this.ndnsSecret, 0)).start();
	}
};
