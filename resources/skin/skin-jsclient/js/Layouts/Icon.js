// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Icon || (parent.Layouts && (Layouts.Icon = parent.Layouts.Icon)) || (
	// v 0.9j
	//
	//	-= MyX =-
	//
	//	Icon is a simple layout, whose idea is to take whole available space 
	//	as a icon for its contents.
	//
	//
	//	Usage:
	//		var icon = new Layouts.Icon( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	icon : extends Layouts.Layout {
	//		icon : icon
	//	}
	//
	//	definition : {
	//		content	: full layout definition to build contents inline
	//	}
	//
	//	customization:
	//		Layouts.Icon.prototype.defaultIconBase = "/images/icons/";
	//		Layouts.Icon.prototype.defaultIconType = ".png";
	//
	
Layouts.Icon = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null), "icon");
		init2_layers();
		init3_finish();
	}
},
Layouts.Icon.prototype = new ((window.Layouts && (Layouts.Image || (window.require && require("Layouts.Image")))) || function(){})(),
Layouts.Icon.prototype.putAll({
	icon			: null,
	iconSrc			: null,
	image			: null,
	isComponentIcon	: true,
	defaultIconBase	: "/images/icons/",
	defaultIconType	: ".png",
	environment		: { 
		zoom	: "compact"
	},
	onAfterRebuild : function(sender){
		with(this){
			var update = sender == this;
			image || (
				this.image = inner.ownerDocument.createElement("img"),
				image.style.border = "none",
				image.onload = imageOnLoad,
				image.onerror = imageOnError,
				image.onabort = imageOnAbort,
				image.className = "ui-icon-image",
				image.layout = this
			);
			outer.className = zoom == zoom_screen
								? "ui-icon-screen"
								: zoom == zoom_row
									? "ui-icon-row"
									: zoom == zoom_column
										? "ui-icon-column"
										: "ui-icon-normal";
			this.icon = iconValue() || null;
			var prevIcon = iconSrc;
			this.iconSrc = icon && (icon.indexOf('/') == -1 && icon.indexOf('.') == -1
										? defaultIconBase + icon + defaultIconType
										: icon);
			if(iconSrc != prevIcon){
				update = true;
				var w = Math.max(image.offsetWidth, image.clientWidth || 0, image.naturalWidth || 0, image.width || 0), 
					h = Math.max(image.offsetHeight, image.clientHeight || 0, image.naturalHeight || 0, image.height || 0);
				image.prevWidth = w;
				image.prevHeight = h;
				image.src = iconSrc;
				inner.appendChild(image);
			}
			return update;
		} 
	},
	imageOnLoad : function(){
		with(this.layout){
			image.visibility = "";
			var w = Math.max(image.offsetWidth, image.clientWidth || 0, image.naturalWidth || 0, image.width || 0), 
				h = Math.max(image.offsetHeight, image.clientHeight || 0, image.naturalHeight || 0, image.height || 0);
			if(image.prevWidth !== w && image.prevHeight !== h){
				top.debug && top.debug("Layouts.Icon: on image load: " + image.prevWidth + "x" + image.prevHeight + " -> " + w + "x" + h + ", src=" + iconSrc);
				image.prevWidth = w;
				image.prevHeight = h;
				var target = getContextParameter("onContentChange");
				target && setTimeout(function(){
					target(outer.component);
				},0);
			}else{
				top.debug && top.debug("Layouts.Icon: on image load: " + image.prevWidth + "x" + image.prevHeight + ", src=" + iconSrc);
			}
		}
	},
	imageOnError : function(){
		with(this.layout){
			image.visibility = "hidden";
			var w = 0, h = 0;
			if(image.prevWidth !== w && image.prevHeight !== h){
				top.debug && top.debug("Layouts.Icon: on image load error: " + image.prevWidth + "x" + image.prevHeight + " -> " + w + "x" + h + ", src=" + iconSrc);
				image.prevWidth = w;
				image.prevHeight = h;
				var target = getContextParameter("onContentChange");
				target && setTimeout(function(){
					target(outer.component);
				},0);
			}else{
				top.debug && top.debug("Layouts.Icon: on image load error: " + image.prevWidth + "x" + image.prevHeight + ", src=" + iconSrc);
			}
		}
	},
	imageOnAbort : function(){
		with(this.layout){
			image.visibility = "hidden";
			var w = 0, h = 0;
			if(image.prevWidth !== w && image.prevHeight !== h){
				top.debug && top.debug("Layouts.Icon: on image load abort: " + image.prevWidth + "x" + image.prevHeight + " -> " + w + "x" + h + ", src=" + iconSrc);
				image.prevWidth = w;
				image.prevHeight = h;
				var target = getContextParameter("onContentChange");
				target && setTimeout(function(){
					target(outer.component);
				},0);
			}else{
				top.debug && top.debug("Layouts.Icon: on image load abort: " + image.prevWidth + "x" + image.prevHeight + ", src=" + iconSrc);
			}
		}
	},
	iconValue : function(){
		with(this){
			return typeof definition.icon == "function"
						? definition.icon(this)
						: definition.icon;
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-icon{"+
				"position:relative;"+
			"}"+
			".ui-icon-normal{"+
				"display:inline-block;"+
			"}"+
			".ui-icon-row{"+
				"display:block;"+
				"width:100%;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
			".ui-icon-column{"+
				"display:inline-block;"+
				"height:100%;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
			".ui-icon-screen{"+
				"display:block;"+
				"position:absolute;"+
				"height:100%;"+
				"width:100%;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
			".ui-icon-inner-screen{"+
				"display:block;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
			".ui-icon-image{"+
				"margin:auto;"+
				"padding:1px;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Icon) // <%/FORMAT%>