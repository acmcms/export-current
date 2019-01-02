// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.String || (parent.Layouts && (Layouts.String = parent.Layouts.String)) || (
	// v 1.5c
	//
	//	-= MyX =-
	//
	//	Text is a simple layout, whose idea is to take whole available space 
	//	as a text for its contents.
	//
	//
	//	Usage:
	//		var string = new Layouts.String( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	string : extends Layouts.Layout {
	//		value : string
	//	}
	//
	//	definition : {
	//		content	: full layout definition to build contents inline
	//	}
	
Layouts.String = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null), "string");
		init2_layers();
		init3_finish();
	}
},
Layouts.String.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.String.prototype.putAll({
	value				: null,
	isComponentTerminal	: true,
	isComponentContainer: false,
	isComponentSequence	: false,
	isComponentString	: true,
	className			: undefined,
	environment			: { 
		zoom	: "compact"
	},
	onAfterRebuild : function(sender){
		with(this){
			var prevClassName = className;
			setClassName(this.className = (zoom == zoom_compact
							? "ui-string-compact"
							: zoom == zoom_wide
								? "ui-string-block"
								: "ui-string-screen"));
			var prevText = value;
			// for HTML: 
			// 		inner.innerHTML = this.value = textValue() || definition.title || '&nbsp;';
			// 8194 (2002 hex) - non breaking space
			
			// Doesn't work in FF
			// inner.innerText = this.value = textValue() || definition.title || '\u2002'; 
			var text = canvas.ownerDocument.createTextNode(this.value = textValue() || definition.title || '\u2002');
			canvas.firstChild 
				? canvas.replaceChild(text, canvas.firstChild)
				: canvas.appendChild(text);
			return value != prevText || className != prevClassName;
		} 
	},
	textValue : function(){
		with(this){
			return definition.value && (
					(typeof definition.value == "function"
						? definition.value(this)
						// 8195 (2003 hex) - non breaking space, long one
						: definition.value).replace(/^\s/, '\u2003').replace(/\u2003\s/g, '\u2003\u2003').replace(/\u2003\s/g, '\u2003\u2003')
			) || '';
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-string{"+
				"position:relative;"+
				"vertical-align:top;"+
				"text-wrap:normal;"+
				"word-wrap:normal;"+
				"white-space:normal;"+
			"}"+
			".ui-string-compact{"+
				"display:inline-block;"+
			"}"+
			".ui-string-block{"+
				"display:block;"+
			"}"+
			".ui-string-screen{"+
				"display:block;"+
				"height:100%;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.String) // <%/FORMAT%>