var Auth = require('ru.acmcms.internal/util/AuthAcmAnyControllerJail');
var auth = new Auth();

module.exports = {
	authConsoleCommand : auth.consoleCommand.bind(auth),
	authCheckQuery : auth.checkQuery.bind(auth),
	authRequireQuery : auth.requireQuery.bind(auth),
	authCheckMembership : auth.checkMembership.bind(auth),

	authListAccounts : auth.listUsers.bind(auth),
	authListGroups : auth.listGroups.bind(auth),
	authListUserGroups : auth.listUserGroups.bind(auth),
	authAddUser : auth.addUser.bind(auth),
	authAddGroup : auth.addGroup.bind(auth),
	authDropUser : auth.dropUser.bind(auth),
	authDropGroup : auth.dropGroup.bind(auth),
	authGetUserInfo : auth.getUserInfo.bind(auth),
	authGetGroupInfo : auth.getGroupInfo.bind(auth),
	authListUserLogins : auth.listUserLogins.bind(auth),
};