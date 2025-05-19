/**
 * 
 */
const ae3 = require("ae3");

/**
 * this is Client
 */
const ON_SUCCESS = function(map) {
	console.log("ndm.client::Client::ndmp/services:onSuccess: '%s': data: %s", this.clientId, Format.jsObjectReadable(map.item));
};

/**
 * this is Client
 */
const ON_ERROR = function(code, text) {
	console.error("ndm.client::Client::ndmp/services:onError: '%s': failed, code=%s, text=%s", this.clientId, code, text);
};

module.exports = Object.create(null, {
	append: {
		value:
			/**
			 * Use .call(client, ...)
			 */
			function(clientRequest, service) {
				clientRequest.append({
					name: "listServices",
					path: "/ndmp/listServices",
					get: {
						origin: 'device',
						service : service || undefined,
					},
					onSuccess: ON_SUCCESS.bind(this),
					onError: ON_ERROR.bind(this),
				});
			}
	}
});
