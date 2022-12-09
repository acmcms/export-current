/**
 * 
 * @param props : {
 * 	pathPrefix
 * 	systemName
 * 	
 * }
 */
function SystemToolsPage(props){
	this.IndexPage();
	this.systemName = props.systemName || 'AE3';
	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'tools/';
	this.link && !this.link.endsWith('/') && (this.link += '/');
	
	this.pageTitle = (this.systemName) + "::" + this.link + "index (System Tools)";
	
	const WapiCliBridgeClass = require("ru.myx.ae3.internal/web/system-tools/CliBridge");
	const WapiWatchLogsClass = require("ru.myx.ae3.internal/web/system-tools/CliBridge");
	const WapiVfsBrowseClass = require("ru.myx.ae3.internal/web/system-tools/CliBridge");

	this.commands = {
		/**
		 * interface
		 */
		"index" : {
			icon : "wrench_orange",
			title : "System Tools",
			run : this,
			access : "admin",
		},
		"../index" : {
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		"cliBridge" : {
			icon : "image_edit",
			title : "CLI Bridge Console",
			run : new WapiCliBridgeClass(this, this.systemName, this.link),
			access : "admin",
			ui : true,
		},
		"watchLog" : {
			icon : "eye",
			title : "Watch Log Messages",
			run : new WapiWatchLogsClass(this, this.systemName, this.link),
			access : "admin",
			ui : true,
		},
		"vfsBrowser" : {
			icon : "application_side_tree",
			title : "VFS Navigator",
			run : new WapiVfsBrowseClass(this, this.systemName, this.link),
			access : "admin",
			ui : true,
		},
	};
	this.run = this;

	/**
	 * TODO: menu and links break otherwise when embedded deep
	 */
	this.link && !this.link.startsWith('/') && (this.link = '/' + this.link);
	
	return this;
}

SystemToolsPage.prototype = Object.create(require('./IndexPage').prototype, {
	"icon" : {
		value : "wrench_orange"
	},
	"title" : {
		value : "System Tools"
	},
	"access" : {
		value : "admin"
	},
	"ui" : {
		value : true
	},
	"group" : {
		value : true
	},
	"toString" : {
		value : function(){
			return '[SystemToolsPage]';
		}
	}
});


Object.defineProperties(SystemToolsPage, {
	"create" : {
		value : function createSystemTools(props, auth){
			const Index = new SystemToolsPage(props);
			
			auth ||= props.auth;
			auth && (Index.auth = auth);

			return Index;
		}
	},
	"toString" : {
		value : function(){
			return '[SystemToolsPageClass]';
		}
	}
});


module.exports = SystemToolsPage;