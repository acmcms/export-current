(window.BUI || (BUI = parent.BUI) || (BUI = {})) &&
BUI.Settings || (parent.Settings && (BUI.Settings = parent.BUI.Settings)) || (
	// v 2.0
	//
	//	-= MyX =-
	//

BUI.Settings = {
	definition : {
		layout	: "button",
		icon : "wrench",
		title : "Settings",
		submenu : []
	},
	menu : function(){
		with(this) {
			if(!definition.submenu.length){
				definition.submenu.push(require("Layouts.LayoutConfigMenu"));
				definition.submenu.push(require("Effects.BusyConfigMenu"));
				definition.submenu.push(require("Effects.TransitionConfigMenu"));
				definition.submenu.push(require("Effects.ShadowConfigMenu"));
			}
			return definition;
		}
	},
	register : function(menudef){
		with(this){
			menu().submenu.push(menudef);
		}
	}
});