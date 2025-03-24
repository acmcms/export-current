// <%FORMAT: 'js' %>
window.ae3 || (ae3 = parent.ae3) || (ae3 = function(target){
	//
	//	v 0.1a
	//
	//	var app = new ae3();
	//	... setup all you need ...
	//	app.display();
	//
	//
	//	ae3.prototype.defaultIconBase = "/__i/famfamfam.com/silk/";
	//
	//
	/////////////////////////////////////////////////////////////////////////////////
	
	if(!window.require){
		throw "require.js is essential, please ensure it is loaded!";
	}
	// manual preload kinda
	// <%IGNORE%> // do need this with TPL
	setTimeout(function(){
		require.source("Layouts/Attachment.js");
		require.source("Layouts/Container.js");
		require.source("Layouts/Sequence.js");
		require.source("Layouts/Screen.js");
		require.source("Layouts/Image.js");
		require.source("Layouts/Icon.js");
		require.source("Layouts/String.js");
	},0);
	// <%/IGNORE%>
	
	this.target = target || window.document.body;
	with(this){
		var Layout = require("Layouts.Layout");
		target = new Layout(target, {
			layout	: "screen",
			cssClass: "ButtonFace"
		});
		target.pushLayout("padding");
		target.setBusy();
		this.menubar = target.attachNorth({
			spacing		: true,
			environment : {
				itemStyle	: "margin:0 5px"
			}
		});
	}
	document.close();
},
ae3.prototype = {
	frame	: null, // isolation frame - allows to reload everything w/o resetting 'require' caches
	target	: null, // inner target
	menubar	: null, // menu bar
	topmenu	: null, // menu bar
	traybar	: null, // tray bar
	tray	: null, // tray bar
	appbar	: null, // active application bar
	apps	: null, // active application bar
	
	defaultIconBase	: null,
	
	display : function(){
		with(this){
			top.debug?.("ae3.init2: start");
			
			defaultIconBase && (require("Layouts.Icon").prototype.defaultIconBase = defaultIconBase);
			
			target.pushLayout("inset");
			
			/*
			this.qmenubar = target.attachEast({
				size		: 156,
				decoration	: false
			});
			qmenubar.pushLayout(["outset","padding","inset"]);
			*/
			
			this.traybar = menubar.attachEast({
			});
	
			this.tray = traybar.pushLayout({
				layout	: "toolbar",
				width	: "compact",
				comment	: "System Tray"
			});
			
			tray.addElement({
				layout		: "clock",
				timezones	: "/__sys/timezones"
			});

			tray.addElement({
				layout		: "language",
				icons		: "/__i/flags16x16/",
				language	: "ru",
				languages	: {
					ru : "Russian / Русский",
					en : "English"
				}
			});
			
			this.topmenu = menubar.pushLayout({
				layout	: "toolbar",
				environment:{
					zoom : "wide"
				},
				elements: [
					{
						layout	: "button", 
						icon	: "asterisk_yellow", 
						text	: "Menu", 
						submenu	: [
							require("BUI.Settings").menu(),
							require("BUI.Respect").menu(),
							{
								layout	: "spacer"
							},
							{
								layout	: "button",
								icon : "lock_go",
								text : "Quit",
								onClick : function(){
									var Transition = require("Effects.Transition");
									var save = Transition.prototype.limit;
									var body = window.top.document.body;
									Transition.prototype.limit = 2000;
									new Transition("disappear", body, function(){
										confirm("Close?") && window.top.window.close();
										body.style.visibility = "hidden";
										setTimeout(function(){
											new Transition("appear", body, function(){
												body.style.visibility = "";
												setTimeout(function(){
													Transition.prototype.limit = save;
												}, 2000);
											});
										},50);
									});
								}
							}
						]
					},
					{
						layout			: "sequence",
						title			: "Application Menu",
						onAfterCreate	: function(){
							topmenu = this;
						}
					},
					{
						layout	: "button",
						title	: "Tree Browser",
						text	: "Tree Browser"
					},
					{
						layout	: "button",
						icon	: "asterisk_yellow", 
						title	: "Tree Browser",
						text	: "Tree Browser"
					},
					{
						layout	: "button",
						title	: "View Menu",
						text	: "View",
						submenu : [
							{
								layout	: "button",
								title	: "Tree Browser",
								text	: "Tree Browser"
							},
							{
								layout	: "button",
								title	: "Tree Browser",
								text	: "Tree Browser"
							},
							{
								layout	: "button",
								title	: "Tree Browser",
								text	: "Tree Browser"
							}
						]
					},
					{
						layout	: "button",
						title	: "Window Menu",
						text	: "Window"
					}
				]
			});
			
			/*
			this.apps = target.pushLayout({
				layout	: "tabble",
				comment	: "Application Bar",
				content	: [
					{
						layout	: "string",
						title	: "text1",
						value	: "value1"
					},
					{
						layout	: "string",
						title	: "text2",
						value	: "value2"
					},
					{
						layout	: "string",
						title	: "text3",
						value	: "value3"
					}
				]
			});
			*/
			target.setReady();
		}
	},
	toString : function(){
		return "[ae3]";
	}
},
ae3.prototype.init = function(){
	// preprocessor helper hints - their support is optional.
	//
	// these scripts could be definitely included here cause all of them will be used on
	// initial creation sequence of an interface.
	//
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Layout.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Effects/Busy.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Container.js'	%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Screen.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Sequence.js'	%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Attachment.js'	%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Toolbar.js'	%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Image.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/String.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Icon.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Date.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Clock.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Layouts/Button.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Utils/Event.js'		%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Utils/Coordinates.js'	%><%= '\n;' %>
	// <%= '\n' %><%INCLUDE: 'js/Utils/Cookies.js'		%><%= '\n;' %>
},
ae3.prototype.init(),
// we still have to return a class we just defined, implemented and initialized 8-)
ae3) // <%/FORMAT%>