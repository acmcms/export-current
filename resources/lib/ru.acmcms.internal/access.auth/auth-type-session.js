/**
 * Auth type: session.
 */


exports.startAuth = function startAuth(startContext, returnLocation) {
	return false;
};

exports.checkAuth = function checkAuth(checkContext, parameters) {
	const sid = parameters.__sid;
	const session = require('java.class/ru.myx.ae1.session.SessionManager').sessionIfExists(sid);
	if(!session){
		return false;
	}
	const uid = session[''];
	if(!uid || !session[uid]){
		return false;
	}
	checkContext.sessionId = sid;
	checkContext.userId = uid;
	return true;
};