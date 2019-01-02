module.exports = require('ae3.web/IndexPage').create({
	title : "ACM::developer/index (Developer Pages)", 
	commands : {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "Developer Pages",
			access : "public",
		},
		"../":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		error:{
			icon : "stop",
			title : "Nice Error",
			run : [ require, './Error' ],
			access : "public",
			ui : true,
			api : true,
		},
		other:{
			icon : "bullet_go",
			title : "Other Places",
			run : require('ae3.web/IndexPage').create({ 
				title : "ACM::developer/other (Related Pages)", 
				commands : {
					'/!/skin/skin-acmcms-info/' : {
						icon : "bullet_go",
						title : "Skin: ACMCMS Info",
						access : "public",
						ui : true,
					},
					'/!/skin/skin-ae3-info/' : {
						icon : "bullet_go",
						title : "Skin: AE3 Info",
						run : require('ae3.web/IndexPage').create({
							title : "fake group", 
							commands : {
								'/!/public/resources/lib/ru.myx.ae3.manual/QuickReference.xml' : {
									icon : "help",
									title : "AE3: Quick Reference (coding examples)",
									access : "public",
									ui : true,
								},
								'/__i/famfamfam.com/silk/readme.html' : {
									icon : "world_edit",
									title : "FamFamFam Silk Icon Set: Preview and License",
									access : "public",
									ui : true,
								},
							}
						}),
						group : true,
						access : "public",
						ui : true,
					},
					'/!/skin/skin-jsclient/' : {
						icon : "bullet_go",
						title : "Skin: JS Client",
						run : require('ae3.web/IndexPage').create({
							title : "fake group", 
							commands : {
								'/!/skin/skin-jsclient/test/lib/charcode.html' : {
									icon : "table_multiple",
									title : "Skin: JS Client: Unicode Character Browser",
									access : "public",
									ui : true,
								},
							}
						}),
						group : true,
						access : "public",
						ui : true,
					},
					'/!/skin/skin-standard-html/' : {
						icon : "bullet_go",
						title : "Skin: Standard HTML",
						access : "public",
						ui : true,
					},
					'/!/skin/skin-standard-xml/' : {
						icon : "bullet_go",
						title : "Skin: Standard XML",
						access : "public",
						ui : true,
					},
				}
			}),
			group : true,
			access : "public",
			ui : true,
		},
		"exampleResponse/brands/readBrand-1.xml":{
			icon : "star",
			title : "Read Brand #1",
			// ui : true,
			api : true,
		},
		"exampleResponse/products/readProduct-1.xml":{
			icon : "star",
			title : "Read Product #1",
			// ui : true,
			api : true,
		},
		exampleResponse:{
			icon : "error",
			title : "Example Response Accessor",
			run : [ require, './ExampleResponse' ],
			access : "public",
			api : true,
		},
	
		/**
		 * synthetic
		 */
		"../resource/documentation.xml":{
			icon : "help",
			title : "Documentation",
			ui : true,
		}
	}
});
