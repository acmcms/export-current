// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Numbered || (parent.Layouts && (Layouts.Numbered = parent.Layouts.Numbered)) || (
	// v 0.0f
	//
	//	-= MyX =-
	//
	//	Numbered is a numbered list.
	//
	//
	//	Usage:
	//		var numbered = new Layouts.Numbered( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	numbered : extends Layouts.Sequence {
	//	}
	//
	//	definition : {
	//		environment	: environment definition
	//		content		: full layout definition to build contents inline
	//	}
	
Layouts.Numbered = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, defaultDefinition), "numbered");
		init2_layers();
		
		environment = extend(environment, { zoom : "wide" });

		this.div = document.createElement("table");
		div.className = "ui-numbered-table numbered-self";
		div.cellPadding = 0;
		div.cellSpacing = 0;
		
		var col1 = document.createElement("col");
		col1.width = "0";
		div.appendChild(col1);
		var col2 = document.createElement("col");
		col2.width = "100%";
		div.appendChild(col2);
		
		this.index = 0;
		
		init3_finish();
	}
},
Layouts.Numbered.prototype = new ((window.Layouts && (Layouts.Sequence || (window.require && require("Layouts.Sequence")))) || function(){})(),
Layouts.Numbered.prototype.putAll({
	isComponentContainer: false,
	isComponentNumbered	: true,
	defaultDefinition	: {
		item	: "td"
	},
	connectNext : function(element){
		with(this){
			var row = div.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "&nbsp;" + (++index) + ".&nbsp;";
			cell.className = "ui-numbered-cell";
			element.className = element.className 
				? element.className + ' ' + "ui-numbered-cell" 
				: "ui-numbered-cell";
			return row.appendChild(element);
		}
	},
	onAfterRebuildSequence : Layouts.Sequence.prototype.onAfterRebuild,
	onAfterRebuild : function(sender){
		with(this){
			this.button = inner;
			button.className || (button.className = "numbered-self");
			button.style.position = "relative";
			button.button = this;
			button.appendChild(div);
			return onAfterRebuildSequence(sender);
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-numbered{"+
				"display:block;"+
				"vertical-align:middle;"+
			"}"+
			".ui-zoom-row ui-numbered{"+
				"display:block;"+
			"}"+
			".ui-zoom-compact ui-numbered{"+
				"display:inline-block;"+
			"}"+
			".ui-numbered-table{"+
				"width:100%;"+
				"position:relative;"+
				"vertical-align:top;"+
			"}"+
			".ui-numbered-cell{"+
				"position:relative;"+
				"vertical-align:top;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Numbered) // <%/FORMAT%>