/**
 * 
 */
const ae3 = require("ae3");

/**
 * this is Client
 */
const ON_SUCCESS = function(map) {
	// const address = map.address;
	const notify = map.notify;
	var notification, handlers, handler, id;
	console.log("ndm.client::Client::base/register:onSuccess: '%s': registration OK, got notifications: %s", this.clientId, (!!notify));
	if (notify) {
		for (notification of Array(notify)) {
			console.log("ndm.client::Client::base/register:onSuccess: '%s': notification: %s", this.clientId, Format.jsObject(notification));
			id = notification.id;
			handlers = this.notificationHandlers[id];
			if (handlers) {
				for (handler of Array(handlers)) {
					handler.onXmlNotification(id, notification);
				}
			}
		}
	}

	this.vfs.setContentPublicTreePrimitive("lastRegistered", new Date());
};

/**
 * this is Client
 */
const ON_ERROR = function(code, text) {
	console.error("ndm.client::Client::base/register:onError: '%s': failed, code=%s, text=%s", this.clientId, code, text);
};

module.exports = Object.create(null, {
	append: {
		value:
			/**
			 * Use .call(client, ...)
			 */
			function(clientRequest, reason) {
				clientRequest.append({
					name: "register",
					path: "/register",
					get: {
						origin: 'device',
						reason: reason || 'periodic',
						address: ae3.net.localAddress,
						xns: Object.keys(Object.values(this.components).reduce(function(previousValue, currentValue) {
							if (currentValue) {
								for (let xns of (currentValue.requestXmlNotifications || [])) {
									previousValue[xns] = true;
								}
							}
							return previousValue;
						}, {}))
					},
					onSuccess: ON_SUCCESS.bind(this),
					onError: ON_ERROR.bind(this),
				});
			}
	}
});
