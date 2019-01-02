// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Grid || (parent.Layouts && (Layouts.Grid = parent.Layouts.Grid)) || (
	// v 0.1g
	//
	// -= MyX =-
	//
	// Grid is a 2D grid of cells.
	//
	//
	//	Usage:
	//		var grid = new Layouts.Grid( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	// grid : extends Layouts.Sequence {
	// }
	//
	// definition : {
	// environment : environment definition
	// width : number of columns
	// content : full layout definition to build contents inline
	// }
	
Layouts.Grid = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, defaultDefinition), "grid");
		init2_layers();
		
		environment = extend(environment, { zoom : "row" });

		this.div = document.createElement("table");
		div.className = "ui-grid-table grid-self";
		div.width = "100%";
		div.cellPadding = 0;
		div.cellSpacing = 0;
		div.setAttribute("border", definition.border ? 1 : 0);
		
		this.row = null;
		
		this.index = 0;
		this.width = definition.width || 1;
		
		var percent = Math.floor(100 / width);
		for(var i = width-1; i >= 0; --i){
			var col = document.createElement('col');
			col.width = (i == 0 
							? (100 - percent * (width - 1)) 
							: percent
						) + '%';
			div.appendChild(col);
		}
		
		init3_finish();
	}
},
Layouts.Grid.prototype = new ((window.Layouts && (Layouts.Sequence || (window.require && require("Layouts.Sequence")))) || function(){})(),
Layouts.Grid.prototype.putAll({
	isComponentContainer: false,
	isComponentGrid	: true,
	defaultDefinition	: {
		item	: "td"
	},
	connectNext : function(element){
		with(this){
			if((index++ % width) == 0){
				row = div.insertRow(-1);
			}
			element.className = element.className 
				? element.className + ' ' + "ui-grid-cell" 
				: "ui-grid-cell";
			return row.appendChild(element);
		}
	},
	onAfterRebuildSequence : Layouts.Sequence.prototype.onAfterRebuild,
	onAfterRebuild : function(sender){
		with(this){
			this.button = inner;
			button.className || (button.className = "grid-self");
			button.style.position = "relative";
			button.button = this;
			button.appendChild(div);
			return onAfterRebuildSequence(sender);
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-grid{"+
				"width:100%;"+
				"display:block;"+
				"vertical-align:middle;"+
			"}"+
			".ui-zoom-row ui-grid{"+
				"display:block;"+
			"}"+
			".ui-zoom-compact ui-grid{"+
				"display:inline-block;"+
			"}"+
			".ui-grid-table{"+
				"width:100%;"+
				"position:relative;"+
				"vertical-align:top;"+
			"}"+
			".ui-grid-cell{"+
				"position:relative;"+
				"vertical-align:top;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Grid) // <%/FORMAT%>