const WapiStatsClass = require("./wapi/Stats");
const WapiDiscoverClass = require("./wapi/Discover");

/**
 * 
 * @param lib
 * @param props : {
 * 	pathPrefix
 * 	systemName
 * 	
 * }
 */
function DiscoveryWebIndex(lib, props){
	this.IndexPage();
	this.lib = lib;
	this.systemName = props.systemName || 'AE3';
	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'discovery/';
	this.link && !this.link.endsWith('/') && (this.link += '/');
	this.commands = {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "Discovery Subsystem",
			run : this,
			access : "admin",
		},
		"../":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		stats : {
			icon	: "table",
			title	: "Discovery Stats",
			run		: new WapiStatsClass(lib, this.systemName, this.link),
			access	: "admin",
			ui		: true,
		},
		discover : {
			icon	: "transmit_go",
			title	: "Discover Now",
			run		: new WapiDiscoverClass(lib, this.systemName, this.link),
			access	: "admin",
			ui		: true,
		},
		"discover?format=json" : {
			icon	: "transmit_go",
			title	: "Discover Now (JSON format)",
			access	: "admin",
		},
		"discover?format=text" : {
			icon	: "transmit_go",
			title	: "Discover Now (TEXT format)",
			access	: "admin",
		},
	};
	this.pageTitle = (this.systemName) + "::" + this.link + "index (Discovery Subsystem)";
	this.run = this;
	return this;
}

DiscoveryWebIndex.prototype = Object.create(require('ae3.web/IndexPage').prototype, {
	authRequired : {
		value : true
	},
	icon : {
		value : "transmit"
	},
	title : {
		value : "Discovery"
	},
	access : {
		value : "admin"
	},
	ui : {
		value : true
	},
	group : {
		value : true
	}
});

module.exports = DiscoveryWebIndex;
