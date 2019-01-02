/**
 * 
 * This is an example auth-type implementation template.
 * 
 */

/**
 * @param startContext -
 *            an interface object for login start process. It looks like
 *            {url:null}.
 * @param returnLocation -
 *            the location where we'd like to redirect the user when login will
 *            finally succeed.
 * 
 * @returns boolean - false means 'skip', true means that attempt was handled.
 */
exports.startAuth = function startAuth(startContext, returnLocation) {
	/**
	 * set something up
	 */
	User.ensureAuthmaticAuthorization();
	/**
	 * set login form URL
	 */
	startContext.url = "/login.user?tp=at&__auth_type=&login=1&error=" + encodeURIComponent("This is just an example!");
	return true;
};

/**
 * @param checkContext -
 *            an interface object for login check process. It looks like
 *            {error:null, userId:null}.
 * @param parameters -
 *            parameter map received in authentication request.
 * 
 * @returns boolean - false means 'skip', true means that attempt was handled.
 */
exports.checkAuth = function checkAuth(checkContext, parameters) {
	if (parameters.error) {
		/**
		 * set error result
		 */
		checkContext.error = parameters.error;
		return true;
	}
	if (parameters.userId) {
		/**
		 * this line is here to stop anyone of using this example as a way to
		 * actually authenticate.
		 */
		throw "This is really just an example!";
		
		/**
		 * set authentication success result
		 */
		checkContext.userId = "example-" + parameters.userId;
		return true;
	}
	
	/**
	 * not handled
	 */
	return false;
};
