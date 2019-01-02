exports.translatePassword = function translate_password_auth_login(authType, uniqueKey, authData, mixin){
	return hashCode(uniqueKey.toLowerCase()) ^ hashCode(authData);
};

exports.startAuth = function startAuth(startContext, returnLocation) {
	startContext.url = '/login.user?tp=lnorm&__auth_type=login_normal&back=' + encodeURIComponent(returnLocation);
	return true;
};

exports.checkAuth = function checkAuth(checkContext, parameters) {
	var login = parameters.login, 
		password = parameters.password;
	if(!login || !password){
		return false;
	}
	var user = UserManagerAPI.getUserByLogin(login, false);
	if(!user){
		return false;
	}
	var passwordType = require('java.class/ru.myx.ae1.access.PasswordType').NORMAL,
		checkResult = user.checkPassword(password, passwordType);
	if(!checkResult){
		return false;
	}
	checkContext.userId = user.getKey();
	return true;
};