// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Toolbar || (parent.Layouts && (Layouts.Toolbar = parent.Layouts.Toolbar)) || (
	// v 0.1b
	//
	//	-= MyX =-
	//
	//	Toolbar is a simple layout, whose idea is to take whole available space 
	//	as a toolbar for its contents.
	//
	//
	//	Usage:
	//		var toolbar = new Layouts.Toolbar( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	toolbar : extends Layouts.Sequence {
	//	}
	//
	//	definition : {
	//		environment	: envoronment definition
	//		content		: full layout definition to build contents inline
	//	}
	
Layouts.Toolbar = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, defaultDefinition), "toolbar");
		init2_layers();
		
		environment = extend(environment);
		environment.zoom || (environment.zoom = "compact");

		this.div = document.createElement("table");
		this.row = div.insertRow(-1);
		div.className = "ui-toolbar-table toolbar-self";
		div.cellPadding = 0;
		div.cellSpacing = 0;
		
		init3_finish();
	}
},
Layouts.Toolbar.prototype = new ((window.Layouts && (Layouts.Sequence || (window.require && require("Layouts.Sequence")))) || function(){})(),
Layouts.Toolbar.prototype.putAll({
	isComponentToolbar	: true,
	defaultDefinition	: { 
	},
	connectNext : function(element){
		with(this){
			// do nothing
		}
	},
	createNext : function(){
		with(this){
			// -1 is not actually supported by IE6 & IE7 (acts like 0) in this particular case
			var target = row.insertCell(row.cells.length); 
			target.className = "ui-toolbar-cell";
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
			this.button = canvas;
			button.className || (button.className = "toolbar-self");
			button.style.position = "relative";
			button.button = this;
			button.appendChild(div);
			return onAfterRebuildSequence(sender);
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-toolbar{"+
				"display:block;"+
				"vertical-align:middle;"+
			"}"+
			".ui-zoom-row ui-toolbar{"+
				"display:block;"+
			"}"+
			".ui-zoom-compact ui-toolbar{"+
				"display:inline-block;"+
			"}"+
			".ui-toolbar-table{"+
				"position:relative;"+
				"white-space:nowrap;"+
				"vertical-align:middle;"+
			"}"+
			".ui-toolbar-cell{"+
				"position:relative;"+
				"white-space:nowrap;"+
				"vertical-align:middle;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Toolbar) // <%/FORMAT%>