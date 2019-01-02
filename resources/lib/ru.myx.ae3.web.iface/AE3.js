const vfs = require("ae3/vfs");
const vfsDataRoot = vfs.ROOT.relativeFolderEnsure("storage/data/ae3");
const vfsClients = vfsDataRoot.relativeFolderEnsure("clients");
const auth = require("ae3.util/AuthVfs").create(vfsClients);

module.exports = {
	authConsoleCommand : auth.consoleCommand.bind(auth),
	authCheckQuery : auth.checkQuery.bind(auth),
	authRequireQuery : auth.requireQuery.bind(auth),
	authCheckMembership : auth.checkMembership.bind(auth),
	authGetEmail : auth.getEmail.bind(auth),
	authCheckUser : auth.checkUser.bind(auth),
	authCheckGroup : auth.checkGroup.bind(auth),

	authListAccounts : auth.listUsers.bind(auth),
	authListGroups : auth.listGroups.bind(auth),
	authListUserGroups : auth.listUserGroups.bind(auth),
	authGetUserInfo : auth.getUserInfo.bind(auth),
	authGetGroupInfo : auth.getGroupInfo.bind(auth),
	authListUserLogins : auth.listUserLogins.bind(auth),
	authCheckLoginPassword : auth.checkLoginPassword.bind(auth),
	authAddUser : auth.addUser.bind(auth),
	authAddGroup : auth.addGroup.bind(auth),
	authDropUser : auth.dropUser.bind(auth),
	authDropGroup : auth.dropGroup.bind(auth),
	authAddMembership : auth.addMembership.bind(auth),
	authDropMembership : auth.dropMembership.bind(auth),
	authSetPassword : auth.setPassword.bind(auth),
	authSetEmail : auth.setEmail.bind(auth),
};