/**
 * 
 */
const ae3 = require("ae3");

/**
 * this is Client
 */
const ON_SUCCESS = function(map) {
	console.log("ndm.client::Client::ndns/book:onSuccess: '%s': data: %s", this.clientId, Format.jsObjectReadable(map));
};

/**
 * this is Client
 */
const ON_ERROR = function(code, text) {
	console.error("ndm.client::Client::ndns/book:onError: '%s': failed, code=%s, text=%s", this.clientId, code, text);
};

module.exports = Object.create(null, {
	append: {
		value:
			/**
			 * Use .call(client, ...)
			 */
			function(clientRequest, name, domain, address4, access4, address6, access6, transfer) {
				clientRequest.append({
					name: "bookName",
					path: "/ndns/bookName",
					get: {
						origin: 'device',
						name : name,
						domain : domain,
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
