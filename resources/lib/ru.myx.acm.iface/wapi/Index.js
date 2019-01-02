const DiscoveryWebServiceClass;
try{
	DiscoveryWebServiceClass = require('ru.myx.ae3.internal/discovery/DiscoveryWebService');
}catch(e){
	// ignore
}

module.exports = require('ae3.web/IndexPage').create({ 
	title : "ACM::index (ACM.CMS Root Index Menu)", 
	commands : {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "Root index menu",
			access : "public",
		},

		"jails":{
			icon : "drive_network",
			link : "jails/",
			title : "Jails",
			run : [ require, 'ru.myx.acm.iface/jails/wapi/Index' ],
			ui : true,
			access : "admin",
			group : true,
		},
	
		"administration":{
			icon : "wrench_orange",
			link : "administration/",
			title : "Administration",
			run : [ require, './administration/Index' ],
			access : "admin",
			ui : true,
			group : true,
		},
		
		"discovery": DiscoveryWebServiceClass ? (new DiscoveryWebServiceClass({
			systemName : "ACM", 
			pathPrefix : "discovery/", 
		})) : undefined,
		
		"monitoring": require('ae3.web/StatsMonitoringPage').create({ 
			systemName : "ACM", 
			pathPrefix : "monitoring/", 
		}),
		
		"personal": require('ae3.web/AuthPersonalPage').create({ 
			systemName : "ACM", 
			pathPrefix : "personal/", 
		}),
		
		"developer":{
			icon : "user_red",
			link : "developer/",
			title : "Developer",
			run : [ require, './developer/Index' ],
			access : "public",
			ui : true,
			group : true,
		},
	
		resource:{
			title : "System: resource accessor",
			run : [ require, './Resource' ],
			access : "public",
			ui : false,
		},
		
		/**
		 * syntetic
		 */
		"resource/root-ca.crt":{
			icon : "shield_go",
			title : "Server's Root Certificate",
			access : "public",
			ui : false,
		},
	}
});

