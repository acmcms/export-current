// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Document || (parent.Layouts && (Layouts.Document = parent.Layouts.Document)) || (
	// v 0.0f
	//
	//	-= MyX =-
	//
	//	Document is a simple layout, whose idea is to take whole available space 
	//	as a screen for its contents.
	//
	//
	//	Usage:
	//		var document = new Layouts.Document( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	document : extends Layouts.Layout {
	//	}
	//
	//	definition : {
	//		content	: full layout definition to build contents inline
	//	}
	
Layouts.Document = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null, environment), "document");
		init2_layers();
		init3_finish();
	}
},
Layouts.Document.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Document.prototype.putAll({
	isComponentContainer: true,
	isComponentDocument	: true,
	environment			: { 
		zoom	: "document"
	},
	setupDocument : function(document){
		var source = 
			"ui-document{"+
				"display:block;"+
				"position:absolute;"+
				"width:100%;"+
				"height:100%;"+
				"left:0;"+
				"top:0;"+
				"vertical-align:top;"+
				"overflow:auto;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Document) // <%/FORMAT%>