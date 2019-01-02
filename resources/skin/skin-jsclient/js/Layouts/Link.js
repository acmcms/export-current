// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Link || (parent.Layouts && (Layouts.Link = parent.Layouts.Link)) || (
	// v 1.5
	//
	//	-= MyX =-
	//
	//	Text is a simple layout, whose idea is to take whole available space 
	//	as a text for its contents.
	//
	//
	//	Usage:
	//		var link = new Layouts.Link( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	link : extends Layouts.Layout {
	//		title	: title, optional
	//		href	: url
	//	}
	//
	//	definition : {
	//		content	: full layout definition to build contents inline
	//	}
	
Layouts.Link = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null), "link");
		init2_layers();
		init3_finish();
	}
},
Layouts.Link.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Link.prototype.putAll({
	valueHref		: null,
	valueText		: null,
	isComponentText	: true,
	className		: undefined,
	environment		: { 
		zoom	: "compact"
	},
	onAfterRebuild : function(sender){
		with(this){
			var prevClassName = className;
			setClassName(this.className = (zoom == zoom_compact
							? "ui-link-compact"
							: zoom == zoom_wide
								? "ui-link-block"
								: "ui-link-screen"));
			var prevText = valueText;
			var prevHref = valueHref;
			this.valueHref = hrefValue() || '\u2002';
			this.valueText = textValue() || valueHref;
			if(prevText != valueText || prefHref != valueHref){
				// for HTML: 
				// 		inner.innerHTML = this.value = textValue() || definition.title || '&nbsp;';
				inner.innerHTML = "";
				var link = inner.ownerDocument.createElement('a');
				link.setAttribute("href", valueHref);
				link.innerText = valueText;
				inner.appendChild(link);
			}
			return valueText != prevText || className != prevClassName;
		} 
	},
	textValue : function(){
		with(this){
			return definition.title && (typeof definition.title == "function"
						? definition.title(this)
						// 8195 (2003 hex) - non breaking space, long one
						: definition.title.replace(/^\s/, '\u2003').replace(/\u2003\s/g, '\u2003\u2003').replace(/\u2003\s/g, '\u2003\u2003'));
		}
	},
	hrefValue : function(){
		with(this){
			return definition.href && typeof definition.href == "function"
						? definition.href(this)
						: definition.href;
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-link{"+
				"position:relative;"+
				"vertical-align:top;"+
				"text-wrap:normal;"+
				"word-wrap:normal;"+
				"white-space:normal;"+
			"}"+
			".ui-link-compact{"+
				"display:inline-block;"+
			"}"+
			".ui-link-block{"+
				"display:block;"+
			"}"+
			".ui-link-screen{"+
				"display:block;"+
				"height:100%;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Link) // <%/FORMAT%>