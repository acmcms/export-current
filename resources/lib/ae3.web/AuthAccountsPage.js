/**
 * 
 * @param lib
 * @param props : {
 * 	pathPrefix
 * 	systemName
 * 	
 * }
 */
function AuthAccountsPage(props){
	this.IndexPage();
	this.systemName = props.systemName || 'AE3';
	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'administration/';
	this.link && !this.link.endsWith('/') && (this.link += '/');
	
	this.pageTitle = (this.systemName) + "::" + this.link + "index (Accounts)";
	
	const WapiAddAccountClass = require("ru.myx.ae3.internal/web/auth-accounts/AddAccount");
	const WapiDropAccountClass = require("ru.myx.ae3.internal/web/auth-accounts/DropAccount");
	const WapiDropAccountLoginClass = require("ru.myx.ae3.internal/web/auth-accounts/DropAccountLogin");
	const WapiListAccountsClass = require("ru.myx.ae3.internal/web/auth-accounts/ListAccounts");
	const WapiReadAccountClass = require("ru.myx.ae3.internal/web/auth-accounts/ReadAccount");
	const WapiUpdateAccountClass = require("ru.myx.ae3.internal/web/auth-accounts/UpdateAccount");
	const WapiUpdateAccountEmailClass = require("ru.myx.ae3.internal/web/auth-accounts/UpdateAccountEmail");

	const WapiSetAccountLoginClass = require("ru.myx.ae3.internal/web/auth-accounts/SetAccountLogin");
	const WapiSetMembershipClass = require("ru.myx.ae3.internal/web/auth-accounts/SetMembership");

	const WapiDropMembershipClass = require("ru.myx.ae3.internal/web/auth-accounts/DropMembership");

	const WapiListGroupsClass = require("ru.myx.ae3.internal/web/auth-accounts/ListGroups");
	const WapiAddGroupClass = require("ru.myx.ae3.internal/web/auth-accounts/AddGroup");
	const WapiDropGroupClass = require("ru.myx.ae3.internal/web/auth-accounts/DropGroup");
	// const WapiReadGroupClass = require("ru.myx.ae3.internal/web/auth-accounts/ReadGroup");
	// const WapiUpdateGroupClass = require("ru.myx.ae3.internal/web/auth-accounts/UpdateGroup");

	this.commands = {
		/**
		 * interface
		 */
		index:{
			icon : "group",
			title : "Accounts",
			run : this,
			access : "admin",
		},
		"../index":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		addAccount:{
			icon : "user_add",
			title : "Add Account",
			run : new WapiAddAccountClass(this, this.systemName, this.link),
			access : "admin",
		},
		addGroup:{
			icon : "group_add",
			title : "Add Group",
			run : new WapiAddGroupClass(this, this.systemName, this.link),
			access : "admin",
		},
		dropAccount:{
			icon : "cross",
			title : "Delete User Account",
			run : new WapiDropAccountClass(this, this.systemName, this.link),
			access : "admin",
			api : true,
		},
		dropGroup:{
			icon : "cross",
			title : "Delete Group",
			run : new WapiDropGroupClass(this, this.systemName, this.link),
			access : "admin",
			api : true,
		},
		dropAccountLogin:{
			icon : "cross",
			title : "Delete User Account's Login",
			run : new WapiDropAccountLoginClass(this, this.systemName, this.link),
			access : "admin",
			api : true,
		},
		dropMembership:{
			icon : "cross",
			title : "Delete User Account's Group Membership",
			run : new WapiDropMembershipClass(this, this.systemName, this.link),
			access : "admin",
			api : true,
		},
		listAccounts:{
			icon : "user",
			title : "List Accounts",
			run : new WapiListAccountsClass(this, this.systemName, this.link),
			access : "admin",
			ui : true,
		},
		listGroups:{
			icon : "group",
			title : "List Groups",
			run : new WapiListGroupsClass(this, this.systemName, this.link),
			access : "admin",
			ui : true,
		},
		readAccount:{
			icon : "zoom",
			title : "Read Account",
			run : new WapiReadAccountClass(this, this.systemName, this.link),
			access : "admin",
		},
		setAccountLogin:{
			icon : "lock_add",
			title : "Add/Update User Account's Login",
			run : new WapiSetAccountLoginClass(this, this.systemName, this.link),
			access : "admin",
			api : true,
		},
		setMembership:{
			icon : "group_add",
			title : "Add/Update User Account's Group Membership",
			run : new WapiSetMembershipClass(this, this.systemName, this.link),
			access : "admin",
			api : true,
		},
		updateAccount:{
			icon : "user_edit",
			title : "Update Account",
			run : new WapiUpdateAccountClass(this, this.systemName, this.link),
			access : "admin",
		},
		updateAccountEmail:{
			icon : "user_edit",
			title : "Update Account's Email",
			run : new WapiUpdateAccountEmailClass(this, this.systemName, this.link),
			access : "admin",
		},
	};

	/**
	 * TODO: menu and links break otherwise when embedded deep
	 */
	this.link && !this.link.startsWith('/') && (this.link = '/' + this.link);
	
	this.run = this;
	return this;
}

AuthAccountsPage.prototype = Object.create(require('./IndexPage').prototype, {
	icon : {
		value : "group"
	},
	title : {
		value : "Accounts"
	},
	access : {
		value : "admin"
	},
	ui : {
		value : true
	},
	group : {
		value : true
	},
	toString : {
		value : function(){
			return '[AuthAccountsPage]';
		}
	}
});

Object.defineProperties(AuthAccountsPage, {
	create : {
		value : function createAuthAccounts(props, auth){
			const Index = new AuthAccountsPage(props);
			
			auth ||= props.auth;
			auth && (Index.auth = auth);

			return Index;
		}
	},
	toString : {
		value : function(){
			return '[AuthAccountsPageClass]';
		}
	}
});


module.exports = AuthAccountsPage;