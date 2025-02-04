/**
 *
 */


const WebInterface = require("ae3").web.WebInterface;


/**
 * 'this'- must be bint to an instance of Client
 */
const ClientOnUpdateBookingXnsFn = module.exports = function(xnsId, xnsData){
	this.ddnsName = xnsData.name;
	this.ddnsZone = xnsData.domain;
	this.ddnsAddr = xnsData.address;
	const ddnsHost = this.ddnsHost;
	if(this.ddnsName && this.ddnsZone){
		this.ddnsHost = this.ddnsName + "." + this.ddnsZone;
		console.log("ndm.client::Client::onUpdateBookingXns: '%s': '%s', booked name: %s", this.clientId, xnsId, this.ddnsHost);
	}else{
		this.ddnsHost = null;
	}
	if(ddnsHost !== this.ddnsHost){
		if(this.ddnsHost){

			/** only for reference / logging, not loaded on init **/
			this.vfs.setContentPublicTreePrimitive("ddnsHost", this.ddnsHost);
			
			/** register handler **/
			WebInterface.localNameUpsert(this.ddnsHost, "ndmc-ddns-" + this.clientId);
			
			console.log("ndm.client::Client::onUpdateBookingXns: '%s': '%s', name registered: %s", this.clientId, xnsId, this.ddnsHost);
			
		}else{

			/** only for reference / logging, not loaded on init **/
			this.vfs.setContentUndefined("ddnsHost");
			
			/** un-register handler **/
			WebInterface.localNameRemove(ddnsHost, "ndmc-ddns-" + this.clientId);
			
			console.log("ndm.client::Client::onUpdateBookingXns: '%s': '%s', name un-registered: %s", this.clientId, xnsId, ddnsHost);
			
		}
	}
};
