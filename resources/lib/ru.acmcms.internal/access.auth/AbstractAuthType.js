var AbstractAuthType = function AbstractAuthType(){
	// does nothing
};

/**
 * Array of all enumerated login implementations
 * {
 * 	// unique among its own
 * 	key:0,
 * 	title:0,
 * 	icon:0,
 * }
 */
var knownTypesArray = AbstractAuthType.knownTypesArray = [
	//
	{
		key		: 'email',
		title	: 'Email (forgot my password recovery through e-mail)',
		icon	: undefined
	},
	{
		
	}
];

/**
 * Map of all enumerated login implementations
 */
AbstractAuthType.knownTypes = {
};

knownTypesArray.forEach(function(authType){
	knownTypes[authType.key] = authType
});

AbstractAuthType.prototype = {
	buildAcmAuthCallbackUrl : function buildAcmAuthCallbackUrl(authType, returnLocation){
		return encodeURI(
				Runtime.ENTRANCE + 
				'/login.user?tp=aatype&__auth_type=' + 
				authType + 
				'&login=1&back=' + 
				encodeURIComponent(returnLocation || '/')
			);
	},
	getCurrentUser : function(networkId, networkUid){
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
	},
	getLoginLocation : function loginLocation(returnLocation) {
		var startContext = {
			url : null
		};
		if(!this.startAuth(startContext, returnLocation)){
			throw "Cannot initiate autentication process!";
		}
		return startContext.url;
	},
	startAuthentication : function startAuthentication(checkContext, authType, returnLocation, parameters){
		throw "Abstract implementation must be overridden!";
	},
	checkAuthentication : function serveAuthentication(checkContext, parameters){
		throw "Abstract implementation must be overridden!";
	},
};

module.exports = AbstractAuthType;
