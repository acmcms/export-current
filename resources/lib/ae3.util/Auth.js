const ae3 = require("ae3")
const vfs = ae3.vfs;
const Reply = ae3.Reply;

const AuthUtils = require("java.class/ru.myx.auth.AuthUtils");

function authCheckQuery(query, required) {
	var credentials = AuthUtils.squeezeCredentials(query);
	if(!credentials){
		if(required){
			throw Reply.exception(
					Reply.object( "auth", query, { code : Reply.CD_UNAUTHORIZED, layout : "message", content : "Authentication Required" } ).setCode( Reply.CD_UNAUTHORIZED ).setPrivate()
//					Reply.string( "auth", query, "Authentication Required" ).setCode( Reply.CD_UNAUTHORIZED ).setPrivate()
					// Reply.stringUnauthorized("auth", query, "Authentication Required")
					);
		}
		return false;
	}
	var userId = this.checkLoginPassword(credentials.login, credentials.password);
	if(!userId){
		if(required){
			throw Reply.exception(
					Reply.object( "auth", query, { code : Reply.CD_UNAUTHORIZED, layout : "message", content : "Authentication Required" } ).setCode( Reply.CD_UNAUTHORIZED ).setPrivate()
//					Reply.string( "auth", query, "Authentication Required" ).setCode( Reply.CD_UNAUTHORIZED ).setPrivate()
					// Reply.stringUnauthorized("auth", query, "Authentication Required")
					);
		}
		return false;
	}
	this.updateLogged(userId, query);
	/**
	 * 'sudo'
	 */
	var authUserId = query.parameters.authUserId;
	// TODO 'admin' and 'def.supervisor'... maybe instance parameter
	if(authUserId && (this.checkMembership(userId, 'admin') || this.checkMembership(userId, 'def.supervisor'))){
		if(!this.checkUser(authUserId)){
			throw Reply.exception(
					Reply.string( "auth", query, "(su) User unknown: " + authUserId ).setCode( Reply.CD_UNAUTHORIZED ).setPrivate()
					// Reply.stringUnauthorized("auth", query, "(su) User unknown: " + authUserId)
					);
		}
		authUserId = new String(authUserId);
		authUserId.userId = userId;
		userId = authUserId;
	}
	/**
	 * update query
	 */
	if(this.track){
		query.setAttribute('User-Id', userId);
	}
	return userId;
}

function authRequireQuery(query) {
	return this.checkQuery(query, true);
}

var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function(self, args, auth, options) {
			var s = "command syntax:\n";
			for(var k in commands){
				s += "\t\t " + self + " " + k + " " + commands[k].args + "\n\t\t\t " + commands[k].help + "\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
	users : {
		args : "",
		help : "display list of known users",
		run : function(self, args, auth, options) {
			for(var k of auth.listUsers()){
				console.sendMessage(k);
			}
			return true;
		}
	},
	groups : {
		args : [
		        "",
		        "<username>", 
		       ],
		help : "display list of all known groups or user's groups",
		run : function(self, args, auth, options) {
			var argument = args.shift();
			var groups = argument 
				? auth.listUserGroups(argument) 
				: auth.listGroups();
			for(var k of groups){
				console.sendMessage(k);
			}
			return true;
		}
	},
	add : {
		args : "[--silent ]<username>",
		help : "add user",
		run : function(self, args, auth, options){
			var silent = options?.silent;
			var username;
			for(var i of args){
				if(i === '--silent'){
					if(silent === undefined){
						silent = true;
						continue;
					}
					return console.fail("invalid syntax, use 'help' for help.");
				}
				if(username){
					return console.fail("invalid syntax, use 'help' for help.");
				}
				username = i;
			}
			var result = auth.addUser(username, silent);
			if(!result){
				return silent || console.fail('failed');
			}
			console.sendMessage("user created.");
			return true;
		}
	},
	passwd : {
		args : [
		        "<username>", 
		        "<username> <password>", 
		        "<username> --login <login> <password>",
		        "<username> --login <login> --hash <password>",
		        "<username> --remove <login>", 
		       ],
		help : "set password",
		run : function(self, args, auth, options){
			for(var username, login, hash, password;;){
				var argument = args.shift();
				if(argument?.startsWith("--")){
					if(argument == "--login"){
						login = args.shift();
						if(!login){
							return console.fail("invalid syntax ('login' expected), use 'help' for help.");
						}
						continue;
					}
					if(argument == "--hash"){
						hash = true;
						password = args.shift();
						if(!login){
							return console.fail("invalid syntax ('password-hash' expected), use 'help' for help.");
						}
						continue;
					}
					if(argument == "--remove"){
						login = args.shift();
						if(args.length > 0){
							return console.fail("invalid syntax (extra arguments), use 'help' for help.");
						}
						var result = auth.removePassword(username, login);
						return true;
					}
					options[argument.substr(2)] = true;
					continue;
				}
				if(!username){
					if(!argument){
						return console.fail("invalid syntax ('username' expected), use 'help' for help.");
					}
					username = argument;
					continue;
				}
				if(args.length > 0){
					return console.fail("invalid syntax (extra arguments), use 'help' for help.");
				}
				/**
				 * list?
				 */
				if(!login){
					for(var login of auth.listUserLogins(username)){
						console.sendMessage(login);
					}
					return true;
				}
				if(argument){
					password = argument;
				}else{
					password ||= console.readPassword("new password");
				}
				var result = hash
					? auth.setPasswordHash(username, login, password)
					: auth.setPassword(username, login, password);
				if(!result){
					return console.fail('failed');
				}
				console.sendMessage("password set.");
				return true;
			}
		}
	},
	check : {
		args : [ "<login>", "<login> <password>" ],
		help : "check auth",
		run : function(self, args, auth, options){
			var login = args.shift();
			if(!login){
				return console.fail("invalid syntax ('login' expected), use 'help' for help.");
			}
			var password = args.shift();
			if(!password){
				password = console.readPassword("password");
			}
			
			if(args.length > 0){
				return console.fail("invalid syntax (extra arguments), use 'help' for help.");
			}
			var result = auth.checkLoginPassword(login, password);
			if(!result){
				return console.fail('failed');
			}
			console.sendMessage("check ok: " + result);
			return true;
		}
	},
	remove : {
		args : "<username>",
		help : "remove user",
		run : function(self, args, auth, options){
			var silent = options?.silent;
			var username;
			for(var i of args){
				if(i === '--silent'){
					if(silent === undefined){
						silent = true;
						continue;
					}
					return console.fail("invalid syntax, use 'help' for help.");
				}
				if(username){
					return console.fail("invalid syntax, use 'help' for help.");
				}
				username = i;
			}
			var result = auth.dropUser(username);
			if(!result){
				return console.fail('failed');
			}
			console.sendMessage("user dropped.");
			return true;
		}
	},
	addGroup : {
		args : "[--silent ]<groupname>",
		help : "add group",
		run : function(self, args, auth, options){
			var silent = options?.silent;
			var groupname;
			for(var i of args){
				if(i === '--silent'){
					if(silent === undefined){
						silent = true;
						continue;
					}
					return console.fail("invalid syntax, use 'help' for help.");
				}
				if(groupname){
					return console.fail("invalid syntax, use 'help' for help.");
				}
				groupname = i;
			}
			var result = auth.addGroup(groupname, silent);
			if(!result){
				return console.fail('failed');
			}
			console.sendMessage("group created.");
			return true;
		}
	},
	dropGroup : {
		args : "<groupname>",
		help : "remove group",
		run : function(self, args, auth, options){
			if(args.length != 1){
				return console.fail("invalid syntax, use 'help' for help.");
			}
			var groupname = args.shift();
			var result = auth.dropGroup(groupname);
			if(!result){
				return console.fail('failed');
			}
			console.sendMessage("group dropped.");
			return true;
		}
	},
	addMembership : {
		args : "<username> <groupname>",
		help : "add group membership",
		run : function(self, args, auth, options){
			if(args.length != 2){
				return console.fail("invalid syntax, use 'help' for help.");
			}
			var username = args.shift();
			var groupname = args.shift();
			var result = auth.addMembership(username, groupname);
			if(!result){
				return console.fail('failed');
			}
			console.sendMessage("group membership applied.");
			return true;
		}
	},
	dropMembership : {
		args : "<username> <groupname>",
		help : "remove group membership",
		run : function(self, args, auth, options){
			if(args.length != 2){
				return console.fail("invalid syntax, use 'help' for help.");
			}
			var username = args.shift();
			var groupname = args.shift();
			var result = auth.dropMembership(username, groupname);
			if(!result){
				return console.fail('failed');
			}
			console.sendMessage("group membership dropped.");
			return true;
		}
	},
	email : {
		args : ["<username>", "<username> <email>", "<username> none"],
		help : "get/set user's email, use 'none' to remove email.",
		run : function(self, args, auth, options){
			if(args.length != 1 && args.length != 2){
				return console.fail("invalid syntax, use 'help' for help.");
			}
			var username = args.shift();
			var email = args.shift();
			if(email === undefined){
				console.sendMessage(auth.getEmail(username));
				return true;
			}
			var result = auth.setEmail(username, email == 'none' ? null : email);
			if(!result){
				return console.fail('failed');
			}
			console.sendMessage(email == 'none' ? "email cleared." : "new email set.");
			return true;
		}
	},
	dump : {
		args : "--format=<js, json or cli>",
		help : "exports user management configuration in format specified",
		run : function(self, args, auth, options){
			var email, groups, users, i, j;
			groups = auth.listGroups();
			for(j of groups){
				console.sendMessage(self + " --silent addGroup " + j);
			}
			users = auth.listUsers();
			for(i of users){
				console.sendMessage(self + " --silent add " + i);
				email = auth.getEmail(i);
				if(email){
					console.sendMessage(self + " email " + i + " " + email);
				}
				groups = auth.listUserGroups(i);
				for(j of groups){
					console.sendMessage(self + " --silent addMembership " + i + " " + j);
				}
				for(j of auth.listUserLogins(i)){
					console.sendMessage(self + " passwd " + i + " --login " + j + " --hash " + auth.getUserLoginHash(i, j));
				}
			}
			return true;
		}
	},
	error : {
		args : "",
		help : "generate an error.",
		run : function(args, auth, options){
			throw "error!";
		}
	},
};







const Auth = module.exports = ae3.Class.create(
	/* name */
	"Auth",
	/* inherit */
	undefined,
	/* constructor */
	function() {
		return this;
	},
	/* instance */
	{
		consoleCommand : { 
			value : function() {
				var args = arguments;
				if(args.length < 2){
					return console.fail("invalid syntax, use 'help' for help.");
				}

				// clone/create a normal Array
				args = Array.prototype.slice.call(args);

				var selfName = args.shift();

				for(var options = {};;) {
					var commandName = args.shift();
					if (commandName.startsWith("--")) {
						options[commandName.substr(2)] = true;
						continue;
					}
					var command = commands[commandName];
					if (!command) {
						return console.fail("unsupported command: %s", commandName);
					}

					return command.run(selfName, args, this, options);
				}
			}
		},
			
		requireQuery : { 
			value : authRequireQuery 
		},
		authRequireQuery : { 
			value : authRequireQuery 
		},
		
		checkQuery : { 
			value : authCheckQuery 
		},
		authCheckQuery : { 
			value : authCheckQuery 
		},

		checkUser : { 
			value : function(username){
				throw new Error("Not Implemented");
			}
		},
		checkGroup : { 
			value : function(groupname){
				throw new Error("Not Implemented");
			}
		},

		checkLoginPassword : { 
			value : function(login, password) {
				throw new Error("Not Implemented");
			}
		},
		checkAdmin : { 
			value : function(login, password){
				/**
				 * actually: userId
				 */
				password = this.checkLoginPassword(login, password);
				return password && this.checkMembership(password, "admin");
			}
		},
		updateLogged : { 
			value : function(userId, query) {
				// dummy, does nothing
			}
		},

		getUserLoginHash : { 
			value : function(username, login) {
				throw new Error("Not Implemented");
			}
		},

		setPassword : { 
			value : function(username, login, password){
				throw new Error("Not Implemented");
			}
		},
		setPasswordHash : { 
			value : function(username, login, passwordHash){
				throw new Error("Not Implemented");
			}
		},
		removePassword : { 
			value : function(username, login){
				throw new Error("Not Implemented");
			}
		},
		
		getEmail : { 
			value : function(username){
				throw new Error("Not Implemented");
			}
		},
		setEmail : { 
			value : function(username, email){
				throw new Error("Not Implemented");
			}
		},
		
		getLastAddress : { 
			value : function(username){
				throw new Error("Not Implemented");
			}
		},
		getLastLogged : { 
			value : function(username){
				throw new Error("Not Implemented");
			}
		},

		listUsers : { 
			value : function(){
				throw new Error("Not Implemented");
			}
		},
		addUser : { 
			value : function(username, silent){
				if(silent){
					return false;
				}
				throw new Error("Not Implemented");
			}
		},
		dropUser : { 
			value : function(username, silent){
				if(silent){
					return false;
				}
				throw new Error("Not Implemented");
			}
		},
		
		listGroups : { 
			value : function(){
				throw new Error("Not Implemented");
			}
		},
		addGroup : { 
			value : function(groupname){
				throw new Error("Not Implemented");
			}
		},
		dropGroup : { 
			value : function(groupname){
				throw new Error("Not Implemented");
			}
		},

		checkMembership : { 
			value : function(username, groupname) {
				throw new Error("Not Implemented");
			}
		},
		authCheckMembership : { 
			value : function(){ 
				return this.checkMembership.apply(this, arguments);
			}
		},
		
		addMembership : { 
			value : function(username, groupname){
				throw new Error("Not Implemented");
			}
		},
		dropMembership : { 
			value : function(username, groupname){
				throw new Error("Not Implemented");
			}
		},

		getUserInfo : { 
			value : function(username){
				return {
					"id"				: username,
					"key"			: username,
					"admin"			: this.checkMembership(username, 'admin') || this.checkMembership(username, 'def.supervisor'),
					"email"			: this.getEmail(username),
					"lastAddress"	: this.getLastAddress(username),
					"lastLogged"		: this.getLastLogged(username),
				};
			}
		},
		getGroupInfo : { 
			value : function(groupname){
				return {
					"id"			: groupname,
					"key"		: groupname,
					"admin"		: groupname === 'admin' || groupname === 'def.supervisor',
				};
			}
		},

		listUserLogins : { 
			value : function(username){
				throw new Error("Not Implemented");
			}
		},
		listUserGroups : { 
			value : function(username){
				return this.listGroups().filter(function f(group){ 
					return this.checkMembership(username, group); 
				}, this);
			}
		},
	},
	/* static */
	{
		"compareHashToLoginAndPassword" : {
			value : AuthUtils.checkPasswordHash
		},
		"makeHashForLoginAndPassword" : {
			value : AuthUtils.hashPassword
		}
	}
);
