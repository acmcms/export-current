/**
 * 
 */
const ae3 = require("ae3");

/**
 * this is Client
 */
const ON_SUCCESS = function(map) {
	console.log("ndm.client::Client::ndns/check:onSuccess: '%s': data: %s", this.clientId, Format.jsObjectReadable(map));
};

/**
 * this is Client
 */
const ON_ERROR = function(code, text) {
	console.error("ndm.client::Client::ndns/check:onError: '%s': failed, code=%s, text=%s", this.clientId, code, text);
};

module.exports = Object.create(null, {
	append: {
		value:
			/**
			 * Use .call(client, ...)
			 */
			function(clientRequest, name, domain) {
				if(!name){
					clientRequest.append({
						name: "listDomains",
						path: "/ndns/listDomains",
						get: {
							origin: 'device',
						},
						onSuccess: ON_SUCCESS.bind(this),
						onError: ON_ERROR.bind(this),
					});
					return;
				}
				
				clientRequest.append({
					name: "checkName",
					path: "/ndns/checkName",
					get: {
						origin: 'device',
						name : name,
						domain : domain,
					},
					onSuccess: ON_SUCCESS.bind(this),
					onError: ON_ERROR.bind(this),
				});
			}
	}
});
