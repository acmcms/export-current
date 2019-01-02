exports.buildAcmAuthCallbackUrl = function buildAcmAuthCallbackUrl(authType, returnLocation){
	return encodeURI(
			Runtime.ENTRANCE + 
			'/login.user?tp=cat2&__auth_type=' + 
			authType + 
			'&login=1&back=' + 
			encodeURIComponent(returnLocation || '/')
		);
};
exports.getCurrentUser = function(networkId, networkUid){
	var key = networkId + '-' + networkUid;
	var selected = require('ru.acmcms/dbi')
		.executeSelectOne(
			'default', 
			'SELECT UserID FROM umUserProfiles WHERE Scope=' + Format.sqlString(key)
		);
	var userId = selected && selected[0];
	var user = userId && UserManager.getUser(userId, true) || User.getUser();

	/**
	 * user is persistent and accessed
	 */
	user.commit();

	/**
	 * save networks
	 */
	var profile = user.getProfile();
	var networks = profile.networks || {};
	networks[networkId] = networkUid;
	profile.networks = networks;
	profile.lastNetwork = key;
	user.setProfile(profile);
	
	return user;
};
exports.getLoginLocation = function loginLocation(returnLocation) {
	var startContext = {
		url : null
	};
	if(!this.startAuth(startContext, returnLocation)){
		throw "Cannot initiate autentication process!";
	}
	return startContext.url;
};
