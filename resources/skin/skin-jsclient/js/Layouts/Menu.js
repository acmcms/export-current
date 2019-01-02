// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Menu || (parent.Layouts && (Layouts.Menu = parent.Layouts.Menu)) || (
	// v 0.0g
	//
	//	-= MyX =-
	//
	//	Usage:
	//		var menu = new Layouts.Menu( container, definition );
	//
	//	menu : extends Layouts.Sequence {
	//	}
	//
	//	definition : {
	//		type		: 'ui-menu' is the default, you don't need this normally 8-).
	//		width		: compact || normal || wide || full
	//						full is the default.
	//		elements	: [buttonDefinition, ...]
	//		environment	: environment for child elements, default value is : {
	//							width	: 'full'
	//						}
	//	}
	//
	// Customization:
	//		Menu.prototype.defaultWidth = "150px"
	//
	
Layouts.Menu = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null, (def && def.environment
					? extend(def.environment, environment)
					: environment)), "menu");
		init2_layers();

		this.div = document.createElement("table");
		div.className = "ui-menu-table menu-self";
		div.style.width = defaultWidth;
		div.cellPadding = 0;
		div.cellSpacing = 0;
		
		init3_finish();
	}


},
Layouts.Menu.prototype = new ((window.Layouts && (Layouts.Sequence || (window.require && require("Layouts.Sequence")))) || function(){})(),
Layouts.Menu.prototype.putAll({
	defaultWidth : "150px",
	environment			: { 
		zoom		: "row"
	},
	connectNext : function(element){
		with(this){
			// do nothing
		}
	},
	createNext : function(){
		with(this){
			var target = div.insertRow(-1).insertCell(-1);
			target.className = "ui-menu-cell";
			var itemStyle = definition.itemStyle || environment.itemStyle || getContextParameter("itemStyle");
			var itemClass = definition.itemClass || environment.itemClass || getContextParameter("itemClass");
			itemStyle && (target.style.cssText = itemStyle);
			itemClass && (target.className = itemClass);
			target.component = this;
			return target;
		} 
	},
	onAfterRebuildSequence : Layouts.Sequence.prototype.onAfterRebuild,
	onAfterRebuild : function(sender){
		with(this){
			this.button = inner;
			button.className = "menu-self";
			button.style.position = "relative";
			button.style.display = "inline-block";
			button.button = this;
			button.appendChild(div);
			return onAfterRebuildSequence(sender);
		}
	},
	toString : function(){
		with(this){
			return "{ layout : 'menu', elements : [" + elements + "] }";
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-menu{"+
			"}"+
			".ui-menu-table{"+
				"position:relative;"+
				"white-space:nowrap;"+
				"vertical-align:top;"+
			"}"+
			".ui-menu-cell{"+
				"position:relative;"+
				"white-space:nowrap;"+
				"vertical-align:top;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Menu) // <%/FORMAT%>