/**
 * 
 */
const ae3 = require("ae3");

/**
 * this is Client
 */
const ON_SUCCESS = function(map) {
	console.log("ndm.client::Client::nrpc/update:onSuccess: '%s': data: %s", this.clientId, Format.jsObjectReadable(map));
};

/**
 * this is Client
 */
const ON_ERROR = function(code, text) {
	console.error("ndm.client::Client::nrpc/update:onError: '%s': failed, code=%s, text=%s", this.clientId, code, text);
};

module.exports = Object.create(null, {
	append: {
		value:
			/**
			 * Use .call(client, ...)
			 */
			function(clientRequest) {
				clientRequest.append({
					name: "updateToken",
					path: "/ndns/updateToken",
					get: {
						origin: 'device',
					},
					onSuccess: ON_SUCCESS.bind(this),
					onError: ON_ERROR.bind(this),
				});
			}
	}
});
