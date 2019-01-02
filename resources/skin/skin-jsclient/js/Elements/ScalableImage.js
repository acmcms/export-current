// <%FORMAT: 'js' %>
(window.Elements || (Elements = parent.Elements) || (Elements = {})) &&
Elements.ScalableImage || (parent.Elements && (Elements.ScalableImage = parent.Elements.ScalableImage)) || (
	// v 0.1b
	//
	//	-= MyX =-
	//
	// element:
	//		scalableImage
	//
	// attributes:
	//		src
	//		src_expression
	//		width_expression
	//		height_expression
	//
	// uses CSS:
	//		.shadow-plane - shadow plane,
	//
	// Usage:
	//		Elements.ScalableImage.initAllElements([document]) - to find and attach to all scalableImage elements in current [given] document.
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//

Elements.ScalableImage = function(holder){
	this.holder = holder;
	this.parameters = {
		___rnd___ : Math.random()
	};
	this.baseUrl = holder.getAttribute("src") ||
		(function(){ return eval(holder.getAttribute("src_expression") || ''); }).call(holder) ||
		'';
	this.baseUrl = Utils.Comms.extractUrlParameters(this.baseUrl, '#', this.parameters);
	this.baseUrl = Utils.Comms.extractUrlParameters(this.baseUrl, '?', this.parameters);
	this.src = "";
	holder.instance = this;
	this.image = holder.ownerDocument.createElement("img");
	
	with(this){
		image.onload = function(){
			top.debug && top.debug("ScalableImage: loaded, src=" + this.src);
			this.indicator && (this.indicator.style.display = "none");
			return true;
		};

		holder.style.position = "relative";
		holder.style.display = "block";
		holder.style.overflow = "hidden";

		image.style.position = "absolute"
		image.style.left = 0;
		image.style.top = 0;			
		image.style.borderWidth = 0;
		image.style.width = "100%";
		image.style.height = "100%";
		
		holder.appendChild(image);
		
		if(Elements.ScalableImage.loading_img_src){
			var load = holder.ownerDocument.createElement("div");
			load.style.display = "none";
			load.style.position = "absolute";
			load.style.left = 0;
			load.style.top = 0;
			load.style.border = 0;
			load.style.width = "100%";
			load.style.height = "100%";
			load.style.textAlign = "center";
			load.style.verticalAlign = "middle";
			/**
			 * span needed for middle vertical alignment
			 */ 
			var span = holder.ownerDocument.createElement("span");
			span.style.position = "relative";
			span.style.display = "inline-block";
			span.style.width = "1px";
			span.style.height = "100%";
			span.style.textAlign = "center";
			span.style.verticalAlign = "middle";
			var icon = holder.ownerDocument.createElement("img");
			icon.style.borderWidth = 0;
			icon.style.verticalAlign = "middle";
			icon.src = Elements.ScalableImage.loading_img_src;
			load.appendChild(span);
			load.appendChild(icon);
			holder.appendChild(load);
			image.indicator = load;
		}
		update();
	}
},
Elements.ScalableImage.loading_img_src = null,
Elements.ScalableImage.initAllElements = function(target){
	var doc = (target && ((target.createElement && target) || target.ownerDocument)) || document;
	var win = document.defaultView || window;
	// IE7 workaround - stupid bastard requires the following to work with DOM!
	// have to do this again cause it may be not yet initialized in given document
	document.createElement("scalableImage");
	document.createElementNS && document.createElementNS("myx","si");
	win.SIInitialized || (Utils.Event.listen(win, "resize", Elements.ScalableImage.prototype.resizeHandler), win.SIInitialized = 1);
	var buffer;
	[
		doc.getElementsByTagName("scalableImage"),
		doc.getElementsByTagNameNS && doc.getElementsByTagNameNS("myx","si") || []
	].forEach(function(nodes){
		if(nodes) for(var i = nodes.length-1; i>=0; --i){
			var holder = nodes[i];
			holder.instance || (new Elements.ScalableImage(holder), holder.instance.update());
		}
	});
},
Elements.ScalableImage.createImage = function(window, url){
	with(window){
		document.open("text/html");
		document.write('<html><head><style>html,body,scalableImage{position:relative;padding:0;margin:0;width:100%;height:100%;}</style><base href="'+opener.document.location.href+'" /></head><body onresize="ScalableImage.resizeHandler();"></body></html>');
		window.stop ? window.stop() : document.close();
		// makes IE work as well
		var holder = document.createElement("scalableImage");
		// <scalableImage style="height:${chartHeight}px" src="floodchart?flood=${flood.id}&type=${chart.type}&ttz=${timeZoneName}&width=492&height=${chartHeight}"></scalableImage>
		holder.setAttribute("src", url);
		document.body.appendChild(holder);
		var s = window.ScalableImage = {
			resizeHandlerImpl: function(){
				top.debug && top.debug("ScalableImage: resize handler impl");
				holder.instance.update();
			},
			resizeHandler: function(){
				clearTimeout(s.resizeHandler.timer);
				s.resizeHandler.timer = setTimeout(function(){
					s.resizeHandlerImpl();
				}, 500);
			}
		};
		(new (this)(holder)).update(); // update() call needed for Opera10 to display an image initially 
		this.prototype.resizeHandler();
	}
},
Elements.ScalableImage.prototype = {
	resizeHandlerImpl: function(){
		debug("ScalableImage: resize handler impl");
		var nodes = document.getElementsByTagName("scalableImage");
		for(var i = nodes.length-1; i>=0; --i){
			var holder = nodes[i];
			holder.instance && holder.instance.update();
		}
	},
	resizeHandler: function(){
		var t = Elements.ScalableImage.prototype;
		clearTimeout(t.resizeHandler.timer);
		t.resizeHandler.timer = setTimeout(function(){
			t.resizeHandlerImpl();
		}, 250);
	},
	update : function(){
		with(this){
			var we = holder.getAttribute("width_expression"),
				he = holder.getAttribute("height_expression"),
				w = holder.clientWidth || holder.innerWidth || Math.min(holder.offsetWidth, image.offsetWidth),
				h = holder.clientHeight || holder.innerHeight || Math.min(holder.offsetHeight, image.offsetHeight),
				rw = parameters.width = we && (function(){ return eval(we); }).call(holder) || w,
				rh = parameters.height = he && (function(){ return eval(he); }).call(holder) || h;
			rw != w && (holder.style.width = rw + "px");
			rh != h && (holder.style.height = rh + "px");
			var href = Utils.Comms.buildUrl( baseUrl, '?', parameters );
			if(src == href){
				debug("same src, src=" + href);
				return;
			}
			debug("src change, new=" + href + ", old=" + src);
			image.indicator && (image.indicator.style.display = "block");
			src = href;
			image.src = src;
		}
	},
	debug : function(text){
		text && top.debug && top.debug("Elements.ScalableImage: " + text);
	}
},
// IE7 workaround - stupid bastard requires the following to work with DOM!
document.createElement("scalableImage"),
document.createElementNS && document.createElementNS("myx","si"),
// we still have to return a class we just defined, implemented and initialized 8-)
Elements.ScalableImage) // <%/FORMAT%>