// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Frame || (parent.Layouts && (Layouts.Frame = parent.Layouts.Frame)) || (
	// v 0.0
	//
	//	-= MyX =-
	//
	//	var frame = new Layouts.Frame( targetDiv, definition )
	//
	//	frame : extends Layouts.Layout {
	//		definition	: definition used to create this frame object
	//		location	: last requested location
	//		navigate	: function( location )
	//		window		: window object of the frame IF ACCESSIBLE (cross site scripting, you know)
	//		document	: document object of the frame IF ACCESSIBLE (cross site scripting, you know)
	//	}
	//
	//	definition : {
	//		location: location to navigate initially if any
	//		onLoad	: function(frame)
	//	}
	//
	//
	
Layouts.Frame = function(target, def){
	this.self = this;
	
	with(this){
		init1_target(target, def, "frame");
		init2_layers();
		init3_finish();
		this.location = definition.location || dummy;
	}
},
Layouts.Frame.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Frame.prototype.putAll({
	//dummy : new String("javascript:''"), // dummy url // ???? Safari opens last navigated site there! WTF!
	dummy : new String("about:blank"), // dummy url
	location : null, // url
	window : null, // window object if accessible
	document : null, // document object if accessible
	container : null,
	navigate : function(location){
	},
	onAfterRebuild : function(sender){
		with(this){
			this.location = definition.location || dummy;
			if(!container){
				var html = inner.ownerDocument.createElement("div");
				// in IE7 - programatically set onload frame property doesn't work!!!
				html.innerHTML = '<iframe src="'+dummy+'" onload="this.loaded()" style="padding:0;margin:0;border:0;height:100%;width:100%;overflow:hidden" frameborder="0" leftmargin="0" topmargin="0" rightmargin="0" bottommargin="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>'; 
				this.container = html.firstChild;
				container.style.overflow = "auto";
				container.scrolling = "yes";
				container.loaded = function(){
					try{
						self.window = (this.contentWindow || this.contentDocument || this);
						self.document = self.window.document;
						top.debug && top.debug("frame: loaded, src=" + this.src + (self.document.URL != this.src ? ", location=" + self.document.URL : ""));
					}catch(e){
						self.window = self.document = null;
						top.debug && top.debug("frame: loaded, content inaccessible, src=" + this.src);
					}
					definition.onLoad 
						&& this.src !== dummy 
						&& setTimeout(function(){ // happens immidiately on 'javascript:', 'about:' and so on
							definition.onLoad && definition.onLoad(self)
						},1); 
				};
				inner.appendChild(container);
			}
			location != dummy && (
				container.src = location,
				top.debug && top.debug("frame: created, location=" + location)
			);
			return true;
		}
	},
	toString : function(){
		with(this){
			return "[Frame, outer=" + (outer ? outer.nodeName : null) + "]";
		}
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Frame) // <%/FORMAT%>