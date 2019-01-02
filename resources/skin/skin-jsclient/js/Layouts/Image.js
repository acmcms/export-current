// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Image || (parent.Layouts && (Layouts.Image = parent.Layouts.Image)) || (
	// v 0.9h
	//
	//	-= MyX =-
	//
	//	Image is a simple layout, whose idea is to take whole available space 
	//	as a image for its contents.
	//
	//
	//	Usage:
	//		var image = new Layouts.Image( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	image : extends Layouts.Layout {
	//		href : href
	//	}
	//
	//	definition : {
	//		content	: full layout definition to build contents inline
	//	}
	//
	//	customization:
	//
	
Layouts.Image = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null), "image");
		init2_layers();
		init3_finish();
	}
},
Layouts.Image.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Image.prototype.putAll({
	image			: null,
	imageSrc		: null,
	isComponentTerminal	: true,
	isComponentContainer: false,
	isComponentSequence	: false,
	isComponentImage: true,
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
				image.className = "ui-image-image",
				image.layout = this
			);
			outer.className = zoom == zoom_screen
								? "ui-image-screen"
								: zoom == zoom_row
									? "ui-image-row"
									: zoom == zoom_column
										? "ui-image-column"
										: "ui-image-normal";
			var prevImage = imageSrc;
			this.imageSrc = imageValue() || null;
			if(imageSrc != prevImage){
				update = true;
				var w = Math.max(image.offsetWidth, image.clientWidth || 0, image.naturalWidth || 0, image.width || 0), 
					h = Math.max(image.offsetHeight, image.clientHeight || 0, image.naturalHeight || 0, image.height || 0);
				image.prevWidth = w;
				image.prevHeight = h;
				image.src = imageSrc;
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
				top.debug && top.debug("Layouts.Image: on image load: " + image.prevWidth + "x" + image.prevHeight + " -> " + w + "x" + h + ", src=" + imageSrc);
				image.prevWidth = w;
				image.prevHeight = h;
				var target = getContextParameter("onContentChange");
				target && setTimeout(function(){
					target(outer.component);
				},0);
			}else{
				top.debug && top.debug("Layouts.Image: on image load: " + image.prevWidth + "x" + image.prevHeight + ", src=" + imageSrc);
			}
		}
	},
	imageOnError : function(){
		with(this.layout){
			image.visibility = "hidden";
			var w = 0, h = 0;
			if(image.prevWidth !== w && image.prevHeight !== h){
				top.debug && top.debug("Layouts.Image: on image load error: " + image.prevWidth + "x" + image.prevHeight + " -> " + w + "x" + h + ", src=" + imageSrc);
				image.prevWidth = w;
				image.prevHeight = h;
				var target = getContextParameter("onContentChange");
				target && setTimeout(function(){
					target(outer.component);
				},0);
			}else{
				top.debug && top.debug("Layouts.Image: on image load error: " + image.prevWidth + "x" + image.prevHeight + ", src=" + imageSrc);
			}
		}
	},
	imageOnAbort : function(){
		with(this.layout){
			image.visibility = "hidden";
			var w = 0, h = 0;
			if(image.prevWidth !== w && image.prevHeight !== h){
				top.debug && top.debug("Layouts.Image: on image load abort: " + image.prevWidth + "x" + image.prevHeight + " -> " + w + "x" + h + ", src=" + imageSrc);
				image.prevWidth = w;
				image.prevHeight = h;
				var target = getContextParameter("onContentChange");
				target && setTimeout(function(){
					target(outer.component);
				},0);
			}else{
				top.debug && top.debug("Layouts.Image: on image load abort: " + image.prevWidth + "x" + image.prevHeight + ", src=" + imageSrc);
			}
		}
	},
	imageValue : function(){
		with(this){
			definition.href || alert("IMAGE: " + Layouts.formatObject(definition));
			return typeof definition.href == "function"
						? definition.href(this)
						: definition.href;
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-image{"+
				"position:relative;"+
			"}"+
			".ui-image-normal{"+
				"display:inline-block;"+
			"}"+
			".ui-image-row{"+
				"display:block;"+
				"width:100%;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
			".ui-image-column{"+
				"display:inline-block;"+
				"height:100%;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
			".ui-image-screen{"+
				"display:block;"+
				"height:100%;"+
				"width:100%;"+
				"vertical-align:middle;"+
				"text-align:center;"+
			"}"+
			".ui-image-image{"+
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
Layouts.Image) // <%/FORMAT%>