const ae3 = require("ae3");
const Auth = require('./Auth');



/**
 * internal, filters user logins from array of VFS entries
 * 
 * @param file
 * @returns boolean
 */
function internFilterFiles(file/* , i, a */) {
	return !file.isContainer();
}

/**
 * internal, filters users from array of VFS entries
 * 
 * @param file
 * @returns boolean
 */
function internFilterContainers(file/* , i, a */) {
	return file.isContainer();
}

/**
 * internal, converts a VFS entry to username.
 * 
 * @param file
 * @returns map
 */
function internMapFileName(file/* , i, a */) {
	return file.key;
}




const AuthVfs = module.exports = ae3.Class.create(
	/* name */
	"AuthVfs",
	/* inherit */
	Auth,
	/* constructor */
	function(folder) {
		if(!folder || !folder.isExist()){
			throw "vfs folder is required for data storage!";
		}
		
		// super constructor
		this.Auth();
		
		Object.defineProperties(this, {
			"vfsRoot" : {
				value : folder
			},
			"vfsAccounts" : {
				value : folder.relativeFolderEnsure("accounts")
			},
			"vfsGroups" : {
				value : folder.relativeFolderEnsure("groups")
			},
			"vfsPass" : {
				value : folder.relativeFolderEnsure("passwd")
			}
		});
		return this;
	},
	/* instance */
	{
		"checkLoginPassword" : { 
			value : function authCheckLoginPassword(login, password) {
				var passwd = this.vfsPass.relativeFolder(login);
				if(!passwd || !passwd.isExist()){
					return false;
				}
				var hash = passwd.getContentPrimitive("hash", null);
				if(!hash){
					return false;
				}
				var check = Auth.compareHashToLoginAndPassword(hash, login, password);
				if(!check){
					return false;
				}
				if(check != hash){
					passwd.setContentPublicTreePrimitive("hash", check);
				}
				return passwd.getContentPrimitive("user");
			}
		},
		"updateLogged" : { 
			value : function authUpdateLogged(username, query) {
				/**
				 * update address and date
				 */
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount || !vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				{
					var newLastAddress = query.sourceAddress || '';
					vfsAccount.updateRelativePrimitive("lastAddress", String(newLastAddress));
				}
				{
					var vfsLastLogged = vfsAccount.relativeFile("lastLogged");
					var newLastLogged = new Date();
					(newLastLogged - (vfsLastLogged.primitiveValue||0)) > 60000 && vfsLastLogged.doSetPrimitive(newLastLogged);
				}
			}
		},
		
		"getUserLoginHash" : { 
			value : function authGetUserLoginHash(username, login) {
				var passwd = this.vfsPass.relativeFolder(login);
				if(!passwd || !passwd.isExist()){
					return false;
				}
				return passwd.getContentPrimitive("hash", null);
			}
		},

		"setPassword" : { 
			value : function authSetPassword(username, login, password){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				if(!password){
					return this.removePassword(username, login);
				}
				var hash = Auth.makeHashForLoginAndPassword(login, password);
				return this.setPasswordHash.call(this, username, login, hash);
			}
		},
		"setPasswordHash" : { 
			value : function authSetPasswordHash(username, login, passwordHash){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				if(passwordHash === undefined || passwordHash === ''){
					return this.removePassword(username, login);
				}
				var vfsPasswd = this.vfsPass.relativeFolderEnsure(login);
				var vfsUser = vfsPasswd.relativeFile("user");
				var user = vfsUser.primitiveValue;
				if(user && user != username){
					throw "Login '"+login+"' is taken by another ('"+user+"') user!";
				}
				var vfsLogins = vfsAccount.relativeFolderEnsure("logins");
		
				vfsUser.doSetPrimitive(username);
				
				vfsPasswd.setContentPublicTreePrimitive("hash", passwordHash);
				vfsLogins.setContentPublicTreePrimitive(login, true);
				
				return true;
			}
		},
		"removePassword" : { 
			value : function authRemovePassword(username, login){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "User '"+username+"' is unknown!";
				}
				var vfsPasswd = this.vfsPass.relativeFolder(login);
				if(!vfsPasswd.isExist()){
					throw "Login '"+login+"' is unknown!";
				}
				var vfsUser = vfsPasswd.relativeFile("user");
				var user = vfsUser.primitiveValue;
				if(user && user != username){
					throw "Login '"+login+"' is taken by another ('"+user+"') user!";
				}
				var vfsLink = vfsAccount.relativeFolder("logins/" + login);
				var vfsHash = vfsPasswd.relativeFile("hash");
				
				vfsHash.doUnlink();
				vfsLink.doUnlink();
				vfsUser.doUnlink();
				vfsPasswd.doUnlink();
				return true;
			}
		},
		
		"checkUser" : { 
			value : function authCheckUser(username){
				return this.vfsAccounts.relativeFolder(username).isExist();
			}
		},
		"checkGroup" : { 
			value : function authCheckGroup(groupname){
				return this.vfsGroups.relativeFolder(groupname).isExist();
			}
		},

		"getEmail" : { 
			value : function authGetEmail(username){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				return vfsAccount.getContentPrimitive("email");
			}
		},
		"setEmail" : { 
			value : function authSetEmail(username, email){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				var vfsEmail = vfsAccount.relativeFile("email");
				if(email){
					vfsEmail.doSetPrimitive(String(email));
				}else{
					vfsEmail.doUnlink();
				}
				return true;
			}
		},
		
		"getLastAddress" : { 
			value : function authGetLastAddress(username){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				return vfsAccount.getContentPrimitive("lastAddress");
			}
		},
		"getLastLogged" : { 
			value : function authGetLastLogged(username){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				return vfsAccount.getContentPrimitive("lastLogged");
			}
		},

		"listUsers" : { 
			value : function authListUsers(){
				return this.vfsAccounts.getContentCollection(null).filter(internFilterContainers).map(internMapFileName);
			}
		},
		"addUser" : { 
			value : function authAddUser(username, silent){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(vfsAccount?.isExist()){
					if(silent){
						return false;
					}
					throw "Account '"+username+"' is already defined!";
				}
				vfsAccount.doSetContainer();
				return true;
			}
		},
		"dropUser" : { 
			value : function authDropUser(username, silent){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					if(silent){
						return false;
					}
					throw "Account '"+username+"' is unknown!";
				}
				var vfsLogins = vfsAccount.relativeFolder("logins");
				if(vfsLogins.isExist()){
					var logins = vfsLogins.getContentCollection(null);
					logins = logins.filter(internFilterFiles);
					logins = logins.map(internMapFileName);
					for(var i = logins.length - 1; i >= 0; --i){
						var vfsPasswd = this.vfsPass.relativeFolder(logins[i]);
						if(vfsPasswd.isExist()){
							vfsPasswd.unlinkRecursive();
						}
					}
				}
				return vfsAccount.unlinkRecursive();
			}
		},
		
		"listGroups" : { 
			value : function authListGroups(){
				return this.vfsGroups.getContentCollection(null).filter(internFilterContainers).map(internMapFileName);
			}
		},
		"addGroup" : { 
			value : function authAddGroup(groupname, silent){
				var vfsGroup = this.vfsGroups.relativeFolder(groupname);
				if(vfsGroup?.isExist()){
					if(silent){
						return false;
					}
					throw "Group '"+groupname+"' is already defined!";
				}
				vfsGroup.doSetContainer();
				return true;
			}
		},
		"dropGroup" : { 
			value : function authDropGroup(groupname){
				var vfsGroup = this.vfsGroups.relativeFolder(groupname);
				if(!vfsGroup.isExist()){
					throw "Group '"+groupname+"' is unknown!";
				}
				var vfsMembers = vfsGroup.relativeFolder("members");
				if(vfsMembers.isExist()){
					var members = vfsMembers.getContentCollection(null);
					members = members.filter(internFilterFiles);
					members = members.map(internMapFileName);
					for(var i = members.length - 1; i >= 0; --i){
						var vfsMembership = this.vfsAccounts.relativeFile(members[i] + "/membership/" + groupname);
						if(vfsMembership.isExist()){
							vfsMembership.unlinkRecursive();
						}
					}
				}
				return vfsGroup.unlinkRecursive();
			}
		},

		"listUserLogins" : { 
			value : function authListUserLogins(username) {
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount || !vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				var vfsLogins = vfsAccount.relativeFolder("logins");
				if(!vfsLogins || !vfsLogins.isExist()){
					return null;
				}
				var array = vfsLogins.getContentCollection(null);
				array = array.filter(internFilterFiles);
				array = array.map(internMapFileName);
				return array;
			}
		},
		"listUserGroups" : { 
			value : function authListUserGroups(username){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount || !vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				var vfsLogins = vfsAccount.relativeFolder("membership");
				if(!vfsLogins || !vfsLogins.isExist()){
					return [];
				}
				var array = vfsLogins.getContentCollection(null);
				array = array.filter(internFilterFiles);
				array = array.map(internMapFileName);
				return array;
			}
		},
		
		"checkMembership" : { 
			value : function authCheckMembership(username, groupname) {
				var vfsMembership = this.vfsAccounts.relative(username + "/membership/" + groupname, null);
				return vfsMembership?.isExist() || false;
			}
		},
		"addMembership" : { 
			value : function authAddMembership(username, groupname){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				var vfsGroup = this.vfsGroups.relativeFolder(groupname);
				if(!vfsGroup.isExist()){
					throw "Group '"+groupname+"' is unknown!";
				}
				var vfsMembership = vfsAccount.relativeFile("membership/" + groupname);
				var vfsMember = vfsGroup.relativeFile("members/" + username);
				vfsMembership.doSetPrimitive(true);
				vfsMember.doSetPrimitive(true);
				return true;
			}
		},
		"dropMembership" : { 
			value : function authDropMembership(username, groupname){
				var vfsAccount = this.vfsAccounts.relativeFolder(username);
				if(!vfsAccount.isExist()){
					throw "Account '"+username+"' is unknown!";
				}
				var vfsGroup = this.vfsGroups.relativeFolder(groupname);
				if(!vfsGroup.isExist()){
					throw "Group '"+groupname+"' is unknown!";
				}
				var vfsMembership = vfsAccount.relativeFile("membership/" + groupname);
				vfsMembership.isExist() && vfsMembership.doUnlink();
				var vfsMember = vfsGroup.relativeFile("members/" + username);
				vfsMember.isExist() && vfsMember.doUnlink();
				return true;
			}
		},
		"toString" : {
			value : function(){
				return '[object AuthVfs ('+this.vfsRoot+')]';
			}
		}
	},
	/* static */
	{
		"create" : {
			value : function(folder){
				return new AuthVfs(folder);
			}
		}
	}
);


