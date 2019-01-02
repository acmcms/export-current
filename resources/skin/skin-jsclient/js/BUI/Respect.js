(window.BUI || (BUI = parent.BUI) || (BUI = {})) &&
BUI.Respect || (parent.Respect && (BUI.Respect = parent.BUI.Respect)) || (
	// v 2.0
	//
	//	-= MyX =-
	//

BUI.Respect = {
	definition : {
		layout	: "button",
		icon : "star",
		title : "Respect",
		submenu : [
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://famfamfam.com", 
				title : "Mark James @ http://famfamfam.com", 
				text : "<font style='font-weight:bold;background-color:white'>&nbsp;<font color=#FF0040>FAM</font><font color=#00C6FF>FAM</font><font color=#95FF00>FAM</font>&nbsp;</font><small><br>http://famfamfam.com</small>" 
			},
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://quirksmode.org/",
				title : "Peter-Paul Koch @ http://quirksmode.org/",
				text : "<font style='font-weight:bold'><font face=courier>[quir</font><small>]</small>{<font face=courier>smode]</font></font><small><br>http://quirksmode.org</small>" 
			},
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://myx.ru/",
				title : "http://myx.ru/",
				text : "<font style='font-weight:bold;font-family:courier new, courier, monospace'>-= MyX =-</font><small><br>http://myx.ru</small>" 
			},
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://berezkina.blogspot.com/",
				title : "http://berezkina.blogspot.com/",
				text : "<font style='font-weight:bold'>Берёзкина</font><small><br>http://berezkina.blogspot.com/</small>" 
			},
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://streetlevel.ru/",
				title : "http://streetlevel.ru/",
				text : "<font style='font-weight:bold;font-family:courier new, courier, monospace'>KeFF</font><small><br>http://streetlevel.ru</small>" 
			},
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://vlapan.com/",
				title : "http://vlapan.com/",
				text : "<font style='font-weight:bold;font-family:courier new, courier, monospace'>vlapan</font><small><br>http://vlapan.com</small>" 
			},
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://salber.ru/",
				title : "http://salber.ru/",
				text : "<font style='font-weight:bold'>Salber</font><small><br>http://salber.ru</small>" 
			},
			{ 
				layout	: "button",
				icon : "link_go", 
				href : "http://mmsource.ru/",
				title : "http://mmsource.ru/",
				text : "<font style='font-weight:bold'>mmsource</font><small><br>http://mmsource.ru</small>" 
			}
		]
	},
	menu : function(){
		with(this) {
			return definition;
		}
	},
	register : function(menudef){
		with(this){
			menu().submenu.push(menudef);
		}
	}
});