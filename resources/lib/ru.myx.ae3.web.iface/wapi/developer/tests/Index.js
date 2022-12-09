module.exports = require('ae3.web/IndexPage').create({
	title : "AE3::developer/tests/index (System [Self-]Tests)", 
	commands : {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "System [Self-]Tests",
			run : Index,
			access : "admin",
		},
		"../index":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		xmlSimpleRequest:{
			icon : "key",
			title : "Simple XML Request",
			run : [ require, './XmlSimpleRequest' ],
			access : "admin",
			ui : true,
			api : true,
		},
		xmlMultipleRequest:{
			icon : "key",
			title : "Multiple XML Request",
			run : [ require, './XmlMultipleRequest' ],
			access : "admin",
			ui : true,
			api : true,
		},
	}
});
