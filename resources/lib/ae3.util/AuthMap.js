/**
 * <code>
 * 	map:{
 * 		"accounts" : {
 * 			"guest" : {
 * 				"logins" : {
 * 					"no-login" : 1
 * 				},
 * 			},
 * 			"example" : {
 * 				"membership" : {
 * 					"exampleGroup" : 1
 * 				},
 * 				"logins" : {},
 * 			},
 * 		},
 * 		"groups" : {
 * 			"exampleGroup" : {
 * 				"members" : {
 * 					"no-login2" : 1
 * 				}
 * 			}
 * 		},
 * 		"passwd" : {
 * 			"no-login" : {
 * 				"hash" : require('ae3.util/Auth').makeHashForLoginAndPassword("no-login", "no-password"),
 * 				"user" : "guest"
 * 			}
 * 		},
 * 	}
 * </code>
 */


const Auth = require('./Auth');




function AuthMap(map) {
	if(!map){
		throw "map is required to be an object!";
	}
	if(!map.accounts || !map.groups || !map.passwd){
		throw "map.accounts, map.groups and map.passwd properties must be defined even if they are supposed to be empty!";
	}
	Auth.call(this);
	Object.defineProperties(this, {
		"map" : {
			value : map
		}
	});
	return this;
}


AuthMap.prototype = Object.create(Auth.prototype, {
	"checkLoginPassword" : {
		value : function authCheckLoginPassword(login, password) {
			var passwd = this.map.passwd[login];
			if(!passwd){
				return false;
			}
			var hash = passwd.hash;
			if(!hash){
				return false;
			}
			var check = Auth.compareHashToLoginAndPassword(hash, login, password);
			if(!check){
				return false;
			}
			if(check != hash){
				passwd.hash = check;
			}
			return passwd.user;
		}
	},
	"updateLogged" : {
		value : function authUpdateLogged(username, query) {
			/**
			 * update address and date
			 */
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			account.lastAddress = query.sourceAddress;
			
			/**
			 * We don't want to trigger too many updates if our storage map is backed by
			 * a wrapped persistent storage.
			 */
			{
				var lastLogged = account.lastLogged;
				var newLastLogged = new Date();
				(newLastLogged - (lastLogged||0)) > 60000 && (account.lastLogged = newLastLogged);
			}
		}
	},
	"getUserLoginHash" : {
		value : function authGetUserLoginHash(username, login) {
			var passwd = this.map.passwd[login];
			if(!passwd){
				return false;
			}
			return passwd.hash;
		}
	},
	"setPassword" : {
		value : function authSetPassword(username, login, password){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			if(!password){
				return this.removePassword(username, login);
			}
			return this.setPasswordHash.call(
				this, 
				username, 
				login, 
				Auth.makeHashForLoginAndPassword(login, password)
			);
		}
	},
	"setPasswordHash" : {
		value : function authSetPasswordHash(username, login, passwordHash){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			if(passwordHash === undefined || passwordHash === ''){
				return this.removePassword(username, login);
			}

			var passwd = this.map.passwd[login];
			if(passwd){
				var user = passwd.user;
				if(user && user != username){
					throw "Login '"+login+"' is taken by another ('"+user+"') user!";
				}
			}else{
				passwd = this.map.passwd[login] = {
					user : username
				};
				(account.logins ||= {})[login] = true;
			}
			
			passwd.hash = passwordHash;
			
			return true;
		}
	},
	"removePassword" : {
		value : function authRemovePassword(username, login){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			var passwd = this.map.passwd[login];
			if(!passwd){
				throw "Login '"+login+"' is unknown!";
			}
			var user = passwd.user;
			if(user && user != username){
				throw "Login '"+login+"' is taken by another ('"+user+"') user!";
			}
			
			var logins = account.logins;
			logins && (delete logins[login]);
			return (delete this.map.passwd[login]);
		}
	},
	"checkUser" : {
		value : function authCheckUser(username){
			return !!this.map.accounts[username];
		}
	},
	"checkGroup" : {
		value : function authCheckGroup(groupname){
			return !!this.map.groups[groupname];
		}
	},
	"getEmail" : {
		value : function authGetEmail(username){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			return account.email;
		}
	},
	"setEmail" : {
		value : function authSetEmail(username, email){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			if(email){
				account.email = String(email);
			}else{
				delete account.email;
			}
			return true;
		}
	},
	"getLastAddress" : {
		value : function authGetLastAddress(username){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			return account.lastAddress;
		}
	},
	"getLastLogged" : {
		value : function authGetLastLogged(username){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			return account.lastLogged
		}
	},
	"listUsers" : {
		value : function authListUsers(){
			return Object.keys(this.map.accounts);
		}
	},
	"addUser" : {
		value : function authAddUser(username, silent){
			var account = this.map.accounts[username];
			if(account){
				if(silent){
					return false;
				}
				throw "Account '"+username+"' is already defined!";
			}
			this.map.accounts[username] = {};
			return true;
		}
	},
	"dropUser" : {
		value : function authDropUser(username, silent){
			var account = this.map.accounts[username];
			if(!account){
				if(silent){
					return false;
				}
				throw "Account '"+username+"' is unknown!";
			}
			var logins = account.logins;
			if(logins){
				logins = Object.keys(logins);
				for(var login of logins){
					var passwd = this.map.passwd[login];
					if(passwd && passwd.user == username){
						delete this.map.passwd[login];
					}
				}
			}
			return (delete this.map.accounts[username]);
		}
	},
	"listGroups" : {
		value : function authListGroups(){
			var array = this.vfsGroups.getContentCollection(null);
			array = array.filter(internFilterContainers);
			array = array.map(internMapFileName);
			return array;
		}
	},
	"addGroup" : {
		value : function authAddGroup(groupname){
			var group = this.map.groups[groupname];
			if(group){
				throw "Group '"+groupname+"' is already defined!";
			}
			this.map.groups[groupname] = {};
			return true;
		}
	},
	"dropGroup" : {
		value : function authDropGroup(groupname){
			var group = this.map.groups[groupname];
			if(!group){
				throw "Group '"+groupname+"' is unknown!";
			}
			var members = group.members;
			if(members){
				for(var i of members){
					var user = map.accounts[i];
					if(!user){
						continue;
					}
					var membership = user.membership;
					membership && (delete membership[groupname]);
				}
			}
			return (delete this.map.groups[groupname]);
		}
	},
	"listUserLogins" : {
		value : function authListUserLogins(username) {
			var user = this.map.accounts[username];
			if(!user){
				throw "User '"+username+"' is unknown!";
			}
			var logins = user.logins;
			if(!logins){
				
			}
			return Object.keys(logins);
		}
	},
	"listUserGroups" : {
		value : function authListUserGroups(username) {
			var user = this.map.accounts[username];
			if(!user){
				return false;
			}
			var membership = user.membership;
			if(!membership){
				return [];
			}
			return Object.keys(membership);
		}
	},
	"checkMembership" : {
		value : function authCheckMembership(username, groupname) {
			var user = this.map.accounts[username];
			if(!user){
				return false;
			}
			var membership = user.membership;
			if(!membership){
				return false;
			}
			return membership[groupname] || false;
		}
	},
	"addMembership" : {
		value : function authAddMembership(username, groupname){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			var group = this.map.groups[groupname];
			if(!group){
				throw "Group '"+groupname+"' is unknown!";
			}
			(account.membership ||= {})[groupname] = true;
			(group.members ||= {})[username] = true;
			return true;
		}
	},
	"dropMembership" : {
		value : function authDropMembership(username, groupname){
			var account = this.map.accounts[username];
			if(!account){
				throw "Account '"+username+"' is unknown!";
			}
			var group = this.map.groups[groupname];
			if(!group){
				throw "Group '"+groupname+"' is unknown!";
			}
			var membership = account.membership;
			var members = group.members;
			membership && (delete membership[groupname]);
			members && (delete members[username]);
			return true;
		}
	},
	"toString" : {
		value : function(){
			return '[object AuthMap]';
		}
	}
});

Object.defineProperties(AuthMap, {
	"create" : {
		value : function(map){
			return new AuthMap(map);
		}
	},
	"toString" : {
		value : function(){
			return '[class AuthMap]';
		}
	}
});

module.exports = AuthMap;