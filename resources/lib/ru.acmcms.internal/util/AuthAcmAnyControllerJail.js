var ServerDomain = require("java.class/ru.myx.srv.acm.ServerDomain");
var Auth = require('ae3.util/Auth');


function authCheckLoginPassword(login, password) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	for each(var jail in jails){
		if(jail.isControllerServer()){
			var accessManager = jail.accessManager;
			var user = accessManager.getUserByLogin(login, false);
			if(user){
				if(user.checkPassword(password)){
					return jail.zoneId + '/' + user.key;
				}
			}
		}
	}
	return undefined;
}

function authCheckUser(username) {
	var pos = username.indexOf('/');
	if(pos == -1){
		return false;
	}
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[username.substring(0, pos)];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username.substring(pos + 1), false);
	return !!user;
}

function authGetUserInfo(username){
	var pos = username.indexOf('/');
	if(pos == -1){
		return false;
	}
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[username.substring(0, pos)];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username.substring(pos + 1), false);
	return {
		id			: username,
		key			: user.key,
		admin		: this.checkMembership(username, 'def.supervisor'),
		email		: user.email,
		lastAddress	: undefined,
		lastLogged	: undefined,
	};
}

function authCheckGroup(groupname) {
	var pos = groupname.indexOf('/');
	if(pos == -1){
		return false;
	}
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[groupname.substring(0, pos)];
	var accessManager = jail.accessManager;
	var group = accessManager.getGroup(groupname.substring(pos + 1), false);
	return !!group;
}

function authGetEmail(username) {
	var pos = username.indexOf('/');
	if(pos == -1){
		return false;
	}
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[username.substring(0, pos)];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username.substring(pos + 1), true);
	return user.email;
}

function authListUserLogins(username) {
	var pos = username.indexOf('/');
	if(pos == -1){
		return false;
	}
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[username.substring(0, pos)];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username.substring(pos + 1), true);
	// array
	return [ user.login ];
}

function authCheckMembership(username, groupname) {
	if(!username){
		return false;
	}
	var pos = username.indexOf('/');
	if(pos == -1){
		return false;
	}
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[username.substring(0, pos)];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username.substring(pos + 1), true);
	var group = accessManager.getGroup(groupname == 'admin' ? 'def.supervisor' : groupname, true);
	return accessManager.isInGroup(user, group);
}

function authListUsers(){
	var result = [];
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	for each(var jail in jails){
		if(jail.isControllerServer()){
			var accessManager = jail.accessManager;
			var users = accessManager.searchByMembership(['def.registered'], null);
			users.forEach(function internReduceAccessUserToKey(/*result, */item){
				result.push(jail.zoneId + '/' + item.key);
			});
		}
	}
	return result;
}

function authListGroups(){
	var result = [];
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	for each(var jail in jails){
		if(jail.isControllerServer()){
			var accessManager = jail.accessManager;
			var groups = accessManager.getAllGroups();
			groups.forEach(function internReduceAccessGroupToKey(/*result, */item){
				result.push(jail.zoneId + '/' + item.key);
			});
		}
	}
	return result;
}

function authListUserGroups(username) {
	var pos = username.indexOf('/');
	if(pos == -1){
		return false;
	}
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[username.substring(0, pos)];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username.substring(pos + 1), true);
	return accessManager.getGroups(user).map(function internReduceAccessGroupToKey(/*result, */item){
		return jail.zoneId + '/' + item.key;
	});
}


function AuthAcmAnyControllerJail() {
	auth = Auth.call(this);
	auth.track = true;
	return auth;
}

AuthAcmAnyControllerJail.prototype = Layouts.extend(Auth.prototype, {
	checkLoginPassword : authCheckLoginPassword,

	getUserInfo : authGetUserInfo,
	
	setPassword : authSetPassword,
	setPasswordHash : authSetPasswordHash,
	removePassword : authRemovePassword,
	
	checkUser : authCheckUser,
	checkGroup : authCheckGroup,

	getEmail : authGetEmail,
	setEmail : authSetEmail,
	
	getLastAddress : authGetLastAddress,
	getLastLogged : authGetLastLogged,

	listUsers : authListUsers,
	// addUser : authAddUser,
	// dropUser : authDropUser,
	
	listGroups : authListGroups,
	// addGroup : authAddGroup,
	// dropGroup : authDropGroup,

	listUserLogins : authListUserLogins,
	listUserGroups : authListUserGroups,
	
	checkMembership : authCheckMembership,
	// addMembership : authAddMembership,
	// dropMembership : authDropMembership,
});

module.exports = AuthAcmAnyControllerJail;