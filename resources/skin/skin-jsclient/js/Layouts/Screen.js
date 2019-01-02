// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Screen || (parent.Layouts && (Layouts.Screen = parent.Layouts.Screen)) || (
	// v 0.2a
	//
	//	-= MyX =-
	//
	//	Screen is a simple layout, whose idea is to take whole available space 
	//	as a screen for its contents.
	//
	//
	//	Usage:
	//		var screen = new Layouts.Screen( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	screen : extends Layouts.Layout {
	//	}
	//
	//	definition : {
	//		content	: full layout definition to build contents inline
	//	}
	
Layouts.Screen = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null, environment), "screen");
		init2_layers();
		init3_finish();
	}
},
Layouts.Screen.prototype = new ((window.Layouts && (Layouts.Container || (window.require && require("Layouts.Container")))) || function(){})(),
Layouts.Screen.prototype.putAll({
	isComponentScreen	: true,
	environment			: { 
		zoom	: "screen"
	},
	setupDocument : function(document){
		var source = 
			"ui-screen{"+
				"display:block;"+
				"position:absolute;"+
				"width:100%;"+
				"height:100%;"+
				"left:0;"+
				"top:0;"+
				"vertical-align:top;"+
			"}"+
			".ui-screen-inner-screen{"+
				"display:block;"+
				"width:100%;"+
				"height:100%;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Screen) // <%/FORMAT%>