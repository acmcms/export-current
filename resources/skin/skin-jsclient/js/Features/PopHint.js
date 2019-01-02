// <%FORMAT: 'js' %>
(window.Features || (Features = parent.Features) || (Features = {})) &&
Features.PopHint || (parent.Features && (Features.PopHint = parent.Features.PopHint)) || (
	// v 0.3b
	//
	//	-= MyX =-
	//
	// element:
	//		popHint - an empty element with popup parameters which lies inside
	//					of the container you wish to enrich with a popup hint.
	//
	// to mark a container add:
	//		<popHint ...attrs...></popHint> inside that container. Container 
	//					(parent element) will be augumented to display popup hint
	//					Implementation will look for 'title' attribute of parent 
	//					element if it cannot deduct hint contents from popHint 
	//					element attributes.
	//
	// attributes:
	//		html
	//		text
	//		src
	//		src_expression
	//
	//		width
	//		height
	//		width_expression
	//		height_expression
	//
	// uses CSS:
	//		.shadow-plane - shadow plane,
	//
	// Usage:
	//		Features.PopHint.initAllElements([document]) - to find and attach to all popHint elements in current [given] document.
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//
	// properties {
	//	clearElement
	//	src
	//	srcExpression
	// }
	//
	// properties are also working like defaults to what is supposed to be found
	//	in element attributes.
	//

Features.PopHint = function(hint, props){
	var hldr = props && props.hldr || hint.parentElement || hint.parentNode,
		t = this,
		p = Features.PopHint.prototype,
		d = hldr.ownerDocument;

	t.p = p;
	t.hint = hint;
	t.hldr = hldr;
	t.props = props || {};

	hint.instance = t;

	p.listen(hldr, 
		function/* over*/(e){
			p.over(e,t);
		}, 
		function/* out*/(e){
			p.out(e,t);
		} 
	);

	t.update();
},
Features.PopHint.initAllElements = function(target){
	var doc = (target && ((target.createElement && target) || target.ownerDocument)) || document;
	var win = document.defaultView || window;
	// IE7 workaround - stupid bastard requires the following to work with DOM!
	// have to do this again cause it may be not yet initialized in given document
	win.PHInitialized || (
		document.createElement("popHint"),
		document.createElementNS && document.createElementNS("myx","ph"),
		Utils.Event.listen(win, "resize", Features.PopHint.prototype.resizeHandler), 
		win.PHInitialized = 1
	);
	[
		doc.getElementsByTagName("popHint"), 
		doc.getElementsByTagNameNS && doc.getElementsByTagNameNS("myx","ph")
	].forEach(function(nodes){
		if(nodes) for(var i = nodes.length-1; i>=0; --i){
			var hldr = nodes[i];
			hldr.instance || (new Features.PopHint(hldr), hldr.instance.update());
		}
	});
},
Features.PopHint.createFrame = function(window, url){
	with(window){
		document.open("text/html");
		document.write('<html><head><style>html,body,popHint{position:relative;padding:0;margin:0;width:100%;height:100%;}</style><base href="'+opener.document.location.href+'" /></head><body onresize="PopHint.resizeHandler();"></body></html>');
		document.close();
		// makes IE work as well
		var hldr = document.createElement("popHint");
		// <popHint style="height:${chartHeight}px" src="floodchart?flood=${flood.id}&type=${chart.type}&ttz=${timeZoneName}&width=492&height=${chartHeight}"></popHint>
		hldr.setAttribute("src", url);
		document.body.appendChild(hldr);
		window.PopHint = {
			resizeHandlerImpl: function(){
				top.debug && top.debug("PopHint: resize handler impl");
				hldr.instance.update();
			},
			resizeHandler: function(){
				clearTimeout(PopHint.resizeHandler.timer);
				PopHint.resizeHandler.timer = setTimeout(function(){
					PopHint.resizeHandlerImpl();
				}, 500);
			}
		};
		(new (this)(hldr)).update(); // update() call needed for Opera10 to display an image initially 
		this.prototype.resizeHandler();
	}
},
Features.PopHint.prototype = {
	/**
	 * currently shown hint
	 */
	shown	: 0,
	/**
	 * timer used for all the events statically
	 */
	timer	: 0,
	/**
	 * static DIV used for all hints' contents (for now)
	 */
	div		: 0,
	/**
	 * static DIV used for all hints' positioning (for now)
	 */
	dot		: 0,
	/**
	 * mouse coordinates
	 */
	mx		: 0,
	my		: 0,
	
	resizeHandlerImpl: function(){
		top.debug && top.debug("PopHint: resize handler impl");
		with(Features.PopHint.prototype){
			var nodes = document.getElementsByTagName("popHint");
			for(var i = nodes.length-1; i>=0; --i){
				var hldr = nodes[i];
				hldr.instance && hldr.instance.update();
			}
		}
	},
	resizeHandler: function(){
		with(Features.PopHint.prototype){
			clearTimeout(resizeHandler.timer);
			resizeHandler.timer = setTimeout(function(){
				resizeHandlerImpl();
			}, 250);
		}
	},
	listen : function(hldr, over, out){
		over && Utils.Event.listen(hldr, ["mousemove", "mouseover", "mouseenter"], over);
		out && Utils.Event.listen(hldr, ["click", "dblclick", "mouseout", "mouseleave"], out);
	},
	over : function(e, t){
		var p = this; // called for Features.PopHint.prototype;
		(e || (e = window.event)) && e.type == 'mousemove' && (p.mx = e.clientX, p.my = e.clientY);
		p.timer && clearTimeout(p.timer);
		/**
		 * if currently shown (if any) popup hint is not ours we going to show ours
		 */
		!t || p.shown == t || (
			/**
			 * we need to take care of container's tooltip so it won't suddenly
			 * appear.
			 */
			t.hldr.getAttribute("title") && (
				t.hldr.setAttribute("title_hint", t.hldr.getAttribute("title")),
				t.hldr.removeAttribute("title"),
				t.hldr.title = '',
				e.cancelBubble = true,
				e.returnValue = false,
				e.preventDefault && e.preventDefault()
			),
			/**
			 * delay an action
			 */
			p.timer = setTimeout(
				function(){
					/**
					 * show it
					 */
					p.show.call(t);
				},
				/**
				 * this delay should be shorter that 'out' delay - otherwise hint will 
				 * blink in FireFox.
				 */
				200
			)
		);
	},
	out : function(){
		var p = this, // called for Features.PopHint.prototype
			t = p.shown;
		p.timer && clearTimeout(p.timer);
		/**
		 * if any popup hint is shown we going to hide it
		 */
		t && (p.timer = setTimeout(function(){
			p.hide.call(t);
		}, 250));
	},
	show : function(){
		var t = this,
			p = t.p,
			d = t.hldr.ownerDocument,
			ce = !!t.props.clearElement;
		p.shown = t;
		if(!p.dot){
			var dot = p.dot = d.createElement("div"),
				rel = d.createElement("div"),
				div = p.div = d.createElement("div");
			
			dot.style.position = "absolute";
			dot.style.width = 0;
			dot.style.height = 0;
			dot.style.overflow = "visible";
			dot.style.zIndex = "2345";
			dot.style.visibility = "hidden";

			rel.style.position = "relative";
			
			div.className = "ui-popup popHint-container";
			div.style.position = "absolute";
			div.style.overflow = "visible";
			// div.style.zIndex = "2345";
			// div.style.visibility = "hidden";
			
			p.listen(dot, 
				function/* over*/(e){
					p.over(e);
				}, 
				function/* out*/(e){
					p.out(e);
				} 
			);
			// listen(dot);
			// listen(rel);
			// listen(div);
			
			rel.appendChild(div);
			dot.appendChild(rel);
			d.body.appendChild(dot);
			
			t.debug("div created");
		}
		var de = d.documentElement,
			db = d.body,
			dsl = de.scrollLeft + db.scrollLeft,
			dst = de.scrollTop + db.scrollTop,
			dcw = de.clientWidth,
			c = ce ? new Utils.Coordinates(hldr).relativeToBody() : { lx : p.mx + dsl, ty : p.my + dst },
			al = (dcw / 2) > c.lx - dsl,
			at = (de.clientHeight / 2) > c.ty - dst,
			x = al ? c.lx : (ce ? c.rx : (dcw - c.lx)),
			y = !ce || at ? c.ty : c.by,
			l = 'left',
			r = 'right',
			b = 'bottom';
		
		t.debug(">>>>> show: al=" + al + ", at=" + at + ", x=" + x + ", y=" + y);
		
		/**
		 * Without this - contents always do have a minimal width. 
		 */
		p.dot.style.width = Math.floor(dcw / 2 - 1) + "px";

		p.dot.style[ al ? l : r ] = x + "px";
		p.dot.style[ al ? r : l ] = '';
		
		p.dot.style[ !ce || at ? "top" : b ] = y + "px";
		p.dot.style[ !ce || at ? b : "top" ] = '';
		
		p.div.style[ al ? l : r ] = 0;
		p.div.style[ al ? r : l ] = '';
		
		p.div.style[ at ? "top" : b ] = 0;
		p.div.style[ at ? b : "top" ] = '';
		
		t.makeContent(p.div);
		
		p.dot.style.visibility = "";
	},
	hide : function(){
		var t = this, 
			p = t.p;
		
		p.shown = 0;
		t.debug(">>>>> hide");
		p.div.innerHTML = "";
		p.dot.style.visibility = "hidden";
	},
	makeContent : function(div){
		var t = this,
			s = t.props;

		/**
		 * remove size constraints which could be set by 'deferred' popup hint 
		 * content
		 */
		div.style.minWidth = div.style.minHeight = "";
		
		if(s.html || s.text) {
			div.innerHTML = s.html || s.text;
			return;
		}
		{
			var a1 = t.hint.getAttribute("html"),
				a2 = a1 || t.hint.getAttribute("text"),
				a3 = a1 || t.hldr.getAttribute("title_hint");
			if(a1 || a2 || a3){
				div.innerHTML = a1 || a2 || a3;
				return;
			}
		}
		{
			var s1 = s.src,
				s2 = s1 || t.hint.getAttribute("src");
			if(s1 || s2){
				if(!Utils.Comms && !(window.require && require("Utils.Comms"))){
					s1 = String(s1 || s2);
					div.innerHTML = "Utils.Comms module is not available to load the source specified: <br />" + s1.link(s1);
					return;
				}
				if(Effects.Busy){
					div.innerHTML = "&nbsp;";
					div.busy = new Effects.Busy(div);
					div.style.minWidth = "32px";
					div.style.minHeight = "32px";
				}else{
					div.innerHTML = "Loading...";
				}
				
				Utils.Comms.queryXmlAsync(s1 || s2, function(status, element, text){
					switch(status){
					case 200:
						t.makeContentAsyncHtml.call(t, div, text);
						return;
					default:
						alert("done: " + status + ", e=" + element + ", t=" + text);
					}
				});
				return;
			}
		}
		{
			div.innerHTML = "no hint";
			return;
		}
	},
	makeContentAsyncHtml : function(div, html){
		if(this.shown !== this){
			this.debug("update skipped, hint is not shown anymore.");
			return;
		}
		/**
		 * set the actual HTML
		 */
		div.innerHTML = html;
		/**
		 * remove size constraints which could be set by 'deferred' popup hint 
		 * content
		 */
		div.style.minWidth = div.style.minHeight = "";
	},
	update : function(){
		/**
		with(this){
			var we = hldr.getAttribute("width_expression"),
				he = hldr.getAttribute("height_expression"),
				w = hldr.getAttribute("width") || hldr.clientWidth || hldr.innerWidth || Math.min(hldr.offsetWidth, image.offsetWidth),
				h = hldr.getAttribute("height") || hldr.clientHeight || hldr.innerHeight || Math.min(hldr.offsetHeight, image.offsetHeight),
				rw = parameters.width = we && (function(){ return eval(we); }).call(hldr) || w,
				rh = parameters.height = he && (function(){ return eval(he); }).call(hldr) || h;
			rw != w && (hldr.style.width = rw + "px");
			rh != h && (hldr.style.height = rh + "px");
			var href = Utils.Comms.buildUrl( baseUrl, '?', parameters );
			if(src == href){
				top.debug && top.debug("PopHint: same src, src=" + href);
				return;
			}
			top.debug && top.debug("PopHint: src change, new=" + href + ", old=" + src);
			image.indicator && (image.indicator.style.display = "block");
			src = href;
			image.src = src;
		}
		*/
	},
	debug : function(text){
		text && top.debug && top.debug("Features.PopHint: " + text);
	}
},
// IE7 workaround - stupid bastard requires the following to work with DOM!
document.createElement("popHint"),
document.createElementNS && document.createElementNS("myx","ph"),
// we still have to return a class we just defined, implemented and initialized 8-)
Features.PopHint) // <%/FORMAT%>