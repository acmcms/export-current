/**
 * 
 */
const ae3 = require("ae3");

/**
 * this is Client
 */
const ON_SUCCESS = function(map) {
	console.log("ndm.client::Client::ndns/update:onSuccess: '%s': data: %s", this.clientId, Format.jsObjectReadable(map));
};

/**
 * this is Client
 */
const ON_ERROR = function(code, text) {
	console.error("ndm.client::Client::ndns/update:onError: '%s': failed, code=%s, text=%s", this.clientId, code, text);
};

module.exports = Object.create(null, {
	append: {
		value:
			/**
			 * Use .call(client, ...)
			 */
			function(clientRequest, address4, access4, address6, access6) {
				clientRequest.append({
					name: "updateBooking",
					path: "/ndns/updateBooking",
					get: {
						origin: 'device',
						mode : "get-update",
						address : address4 || undefined,
						access : access4 || "cloud",
						address6 : address6 || undefined,
						access6 : access6 || "cloud",
					},
					onSuccess: ON_SUCCESS.bind(this),
					onError: ON_ERROR.bind(this),
				});
			}
	}
});
