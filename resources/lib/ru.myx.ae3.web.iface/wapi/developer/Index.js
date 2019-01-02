module.exports = require('ae3.web/IndexPage').create({
	title : "AE3::developer/index (Developer Pages)", 
	commands : {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "Developer Pages",
			run : Index,
			access : "public",
		},
		"../":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		tests:{
			icon : "bug_error",
			link : "tests/",
			title : "System [self-]Tests",
			run : [ require, './tests/Index' ],
			ui : true,
			group : true,
			access : "admin",
		},
		error:{
			icon : "stop",
			title : "Nice Error",
			run : [ require, './Error' ],
			access : "public",
			ui : true,
			api : true,
		},
		exception:{
			icon : "exclamation",
			title : "Nice Exception",
			run : [ require, './Exception' ],
			access : "public",
			ui : true,
			api : true,
		},
		authenticate:{
			icon : "key",
			title : "Authenticate",
			run : [ require, './Authenticate' ],
			access : "public",
			ui : true,
			api : true,
		},
		authenticationFailed:{
			icon : "key_delete",
			title : "Authentication Failed",
			run : [ require, './AuthenticationFailed' ],
			access : "public",
			ui : true,
			api : true,
		},
		authenticationSuccess:{
			icon : "key_go",
			title : "Authentication Success",
			run : [ require, './AuthenticationSuccess' ],
			access : "public",
			ui : true,
			api : true,
		},
		denied:{
			icon : "delete",
			title : "Access Denied",
			run : [ require, './Denied' ],
			access : "public",
			ui : true,
			api : true,
		},
		date:{
			icon : "clock",
			title : "Date",
			run : [ require, './Date' ],
			access : "public",
			ui : true,
			api : true,
		},
		other:{
			icon : "bullet_go",
			title : "Other Places",
			depthLimit : 2,
			run : require('ae3.web/IndexPage').create({ 
				title : "AE3::developer/other (Related Pages)", 
				commands : {
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
								'/!/skin/skin-ae3-info/layouts.jsld' : {
									icon : "layout_content",
									title : "Layout Render's Introduction / Example",
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
					'/!/skin/skin-developer-tools/' : {
						icon : "bullet_go",
						title : "Skin: Developer Tools",
						run : require('ae3.web/IndexPage').create({
							title : "fake group", 
							commands : {
								'/!/skin/skin-developer-tools/client-js/try-key-events.htm' : {
									icon : "keyboard_magnify",
									title : "Try-It-Yourself Browser's keyboard event properties",
									access : "public",
									ui : true,
								},
								'/!/skin/skin-developer-tools/try-formatJsString.htm' : {
									icon : "page_white_gear",
									title : "Format Text as JS String",
									access : "public",
									ui : true,
								},
								'/!/skin/skin-developer-tools/try-formatStringAsUtf8Base64.htm' : {
									icon : "page_white_gear",
									title : "Format Text as (UTF8) Base64",
									access : "public",
									ui : true,
								},
							}
						}),
						group : true,
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
			ui : true,
			api : true,
		},
		"exampleResponse/products/readProduct-1.xml":{
			icon : "star",
			title : "Read Product #1",
			ui : true,
			api : true,
		},
		'vm-vliw' : {
			link : "vm-vliw/",
			icon : "cog",
			title : "AE3 VLIW VM Detail",
			depthLimit: 1,
			run : [ require, 'ru.myx.ae3.sys/vm/VmVliwInfoWebShare' ],
			group : true,
			access : "public",
			ui : true,
		},
		exampleResponse:{
			icon : "error",
			title : "Example Response Accessor",
			run : [ require, './ExampleResponse' ],
			access : "public",
			api : true,
		},
	}
});
