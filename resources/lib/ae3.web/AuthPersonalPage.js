/**
 * 
 * @param props : {
 * 	pathPrefix
 * 	systemName
 * 	
 * }
 */
function AuthPersonalPage(props){
	this.IndexPage();
	this.systemName = props.systemName || 'AE3';
	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'personal/';
	this.link && !this.link.endsWith('/') && (this.link += '/');

	this.pageTitle = (this.systemName) + "::" + this.link + "index (Personal Settings)";

	const WapiChangeEmailClass = require("ru.myx.ae3.internal/web/auth-personal/ChangeEmail");
	const WapiChangePasswordClass = require("ru.myx.ae3.internal/web/auth-personal/ChangePassword");

	this.commands = {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "Personal Settings",
			run : this,
			access : "user",
		},
		"../":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		changePassword:{
			icon : "key",
			title : "Change password",
			run : new WapiChangePasswordClass(this.systemName, this.link),
			access : "user",
			ui : true,
		},
		changeEmail:{
			icon : "email",
			title : "Change e-mail",
			run : new WapiChangeEmailClass(this.systemName, this.link),
			access : "user",
			ui : true,
		}
	};
	this.run = this;

	/**
	 * TODO: menu and links break otherwise when embedded deep
	 */
	this.link && !this.link.startsWith('/') && (this.link = '/' + this.link);
	
	return this;
}

AuthPersonalPage.prototype = Object.create(require('./IndexPage').prototype, {
	icon : {
		value : "user"
	},
	title : {
		value : "Personal"
	},
	access : {
		value : "user"
	},
	ui : {
		value : true
	},
	group : {
		value : true
	},
	toString : {
		value : function(){
			return '[AuthPersonalPage]';
		}
	}
});

Object.defineProperties(AuthPersonalPage, {
	create : {
		value : function createAuthPersonal(props, auth){
			const Index = new AuthPersonalPage(props);
			
			auth ||= props.auth;
			auth && (Index.auth = auth);

			return Index;
		}
	},
	toString : {
		value : function(){
			return '[AuthPersonalPageClass]';
		}
	}
});

module.exports = AuthPersonalPage;