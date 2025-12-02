/**
 *
 */


/**
 * 'this'- must be bint to an instance of Client
 */
const ClientOnCloudSettingsXnsFn = module.exports = function(xnsId, xnsData) {
	const webUiCdnUri = this.webuiCdn;
	this.webuiCdn = this.overrideSettings.useCloudWebuiCdnUri || xnsData.webui_cdn_uri;
	if(this.webuiCdn != webUiCdnUri) {
		if(this.webuiCdn) {
			console.log("ndm.client::Client::onCloudSettingsXns: '%s': '%s', webui cdn uri set: %s", this.clientId, xnsId, this.webuiCdn);
		}else{
			console.log("ndm.client::Client::onCloudSettingsXns: '%s': '%s', webui cdn uri cleared, previous uri: %s", this.clientId, xnsId, webUiCdnUri);
		}
	}
};
