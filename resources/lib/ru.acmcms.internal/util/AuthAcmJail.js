var ServerDomain = require("java.class/ru.myx.srv.acm.ServerDomain");
var Auth = require('ae3.util/Auth');


function authCheckLoginPassword(login, password) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var user = accessManager.getUserByLogin(login, false);
	if(!user){
		return false;
	}
	if(user.checkPassword(password)){
		return user.key;
	}
	return undefined;
}

function authGetUserInfo(username){
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username, false);
	return {
		id			: username,
		key			: user.key,
		admin		: this.checkMembership(username, 'def.supervisor'),
		email		: user.email,
		lastAddress	: undefined,
		lastLogged	: undefined,
	};
}


function authCheckUser(username) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username, false);
	return !!user;
}

function authCheckGroup(username) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var group = accessManager.getGroup(groupname, false);
	return !!group;
}

function authGetEmail(username) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username, true);
	return user.email;
}

function authListUserLogins(username) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username, true);
	return user.login;
}

function authCheckMembership(username, groupname) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username, true);
	var group = accessManager.getGroup(groupname == 'admin' ? 'def.supervisor' : groupname, true);
	return accessManager.isInGroup(user, group);
}

function internMapAccessUserToKey(user/* , i, a */) {
	return user.key;
}

function authListUsers() {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var users = accessManager.searchByMembership(['def.registered'], null);
	return users.map(internMapAccessUserToKey);
}

function internMapAccessGroupToKey(group/* , i, a */) {
	return group.key;
}

function authListGroups() {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var groups = accessManager.getAllGroups();
	return groups.map(internMapAccessGroupToKey);
}

function authListUserGroups(username) {
	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jail = jails[this.acmJailName];
	var accessManager = jail.accessManager;
	var user = accessManager.getUser(username, true);
	return accessManager.getGroups(user).map(internMapAccessGroupToKey);
}

function AuthAcmJail(acmJailName) {
	var auth = Auth.call(this);
	auth.track = true;
	auth.acmJailName = acmJailName;
	return auth;
}

AuthAcmJail.prototype = Layouts.extend(Auth.prototype, {
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

module.exports = AuthAcmJail;