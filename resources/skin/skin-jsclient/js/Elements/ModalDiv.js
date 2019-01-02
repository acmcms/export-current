// <%FORMAT: 'js' %>
(window.Elements || (Elements = parent.Elements) || (Elements = {})) &&
Elements.ModalDiv || (parent.Elements && (Elements.ModalDiv = parent.Elements.ModalDiv)) || (
	// v 0.1d
	//
	//	-= MyX =-
	//
	// uses CSS:
	//		.shadow - shadow plane,
	//		.dialog-window - dialog container,
	//		.dialog-caption - dialog caption within container,
	//		.dialog-surface - internal dialog surface
	//
	// API:
	//		close()
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//
	//
	// Properties:
	//	onSubmit	: function() // for enter key
	//	onCancel	: function() // for esc key
	//	screen		: 'ignore' / 'block' / 'flee'
	//	cssClass	: css class name for modal surface, 'ui-popup' is default
	//	cssStyle	: css style for modal surface (additional)
	//	focus		: element to focus by default and when clicking on the empty space
	//
	//
Elements.ModalDiv = function(element, properties){
	var d = element ? element.ownerDocument : window.document,
		de = d.documentElement,
		t = this,
		shadow = t.shadow = d.createElement("div"),
		modal = t.modal = d.createElement("div"),
		properties = t.properties = properties || (properties = {}),
		mode = {block:'block',flee:'flee'}[properties.screen] || 'ignore',
		screen,
		cell;
	if(mode !== 'ignore') {
		shadow.className = "shadow";
		shadow.style.position = "fixed";
		shadow.style.left = 0;
		shadow.style.top = 0;
		shadow.style.width = "100%";
		shadow.style.height = "100%";
	}
	
	t.d = d;
	
	modal.className = properties.cssClass || "ui-popup";
	properties.cssStyle && (modal.style.cssText = properties.cssStyle);
	if(!element){
		/**
		 * center / middle
		 */
		screen = t.screen = d.createElement("table");
		screen.style.position = "fixed";
		screen.style.left = 0;
		screen.style.top = 0;
		screen.style.width = "100%";
		screen.style.height = "100%";
		
		cell = screen.insertRow(-1).insertCell(-1);
		cell.style.width = "100%";
		cell.style.height = "100%";
		cell.style.paddingBottom = "15%";
		cell.style.verticalAlign = "middle";
		cell.style.textAlign = "center";

		modal.style.position = "relative";
		modal.style.width = (de.clientWidth / 2 || 310) + "px";
	}else{
		var c = new Utils.Coordinates(element).relativeToTopmost(),
			a1;
		t.debug("relative: coordinates = " + c);
		screen = t.screen = d.createElement("div");
		screen.style.position = "absolute";
		screen.style.left = 0;
		screen.style.top = 0;
		screen.style.width = "100%";
		screen.style.height = "100%";
		
		a1 = d.createElement("div");
		a1.style.position = "absolute";
		(c.ty > c.by)
			? a1.style.bottom = c.by + c.h + "px"
			: a1.style.top = c.ty + c.h + "px";
		(c.lx > c.rx)
			? a1.style.right = c.rx + "px"
			: a1.style.left = c.lx + "px";
		a1.style.width = 0;
		a1.style.height = 0;
		a1.style.overflow = "visible";

		cell = d.createElement("div");
		cell.style.position = "absolute";
		
		cell.style[c.ty > c.by ? 'bottom' : 'top'] = 0;
		cell.style[c.lx > c.rx ? 'right' : 'left'] = 0;
		
		/**
		 * width & height must not be specified. This DIV supposed to take
		 * whatever size needed to contain its contents.
		 */
		cell.style.overflow = "visible";
		/**
		 * important: Opera needs it somehow for right-floated windows
		 * otherwise they are not properly positioned if contents are
		 * smaller (in width) than this minWidth value specified.
		 */
		cell.style.minWidth = (element.clientWidth || 80) + "px";

		modal.style.float = cell.style.float = a1.style.textAlign = ((c.lx > c.rx)
			? "right"
			: "left");

		a1.appendChild(cell);
		screen.appendChild(a1);
		
		
		modal.style.position = "relative";
		modal.style.minWidth = (element.clientWidth || 80) + "px";
		modal.style.maxWidth = Math.ceil(de.clientWidth / 2 || 250) + "px";
	}
	
	modal.style.minHeight = "60px";
	modal.style.maxHeight = Math.ceil(de.clientHeight / 2 || 250) + "px";
	modal.style.border = "1px solid #aaa";
	modal.style.backgroundColor = "white";
	cell.appendChild(modal);
	
	shadow.style.zIndex = 2345;
	shadow.setAttribute("info", "Elements.ModalDiv::shadow");
	screen.style.zIndex = 2345;
	screen.setAttribute("info", "Elements.ModalDiv::screen");

	t.onCancel = properties.onCancel || t.close;
	t.onSubmit = properties.onSubmit || null;
	
	mode === 'ignore' || d.body.appendChild(shadow);
	d.body.appendChild(screen);
	
	t.keyup = d.body.onkeyup;
	t.keydown = d.body.onkeydown;
	t.keypress = d.body.onkeypress;

	/**
	 * Handling ESC and ENTER
	 * 
	 * @param e
	 * @returns
	 */
	d.body.onkeyup = function onkeyup(e){
		e || (e = window.event);
		if(!e){
			return true;
		}
		if(e.keyCode === 27){ // esc
			setTimeout(function(){
				/**
				 * this.onCancel defaults to close()
				 */
				t.onCancel();
			}, 10);
			return t.dummy(e);
		}
		if(e.keyCode === 13){ // enter
			t.onSubmit && setTimeout(function(){
				t.onSubmit();
			}, 10);
			return t.dummy(e);
		}
		return true;
	};
	/**
	 * Shadowing ESC and ENTER
	 * 
	 * @param e
	 * @returns
	 */
	d.body.onkeydown = d.body.onkeypress = function keydown(e){
		e || (e = window.event);
		if(!e){
			return true;
		}
		if(e.keyCode === 27){ // esc
			return t.dummy(e);
		}
		if(e.keyCode === 13){ // enter
			return t.dummy(e);
		}
		return true;
	}
	
	{
		/**
		 * don't try with(properties) here - it is not working in IE
		 */
		var focus = properties.focus;
		t.setEvents(modal, focus 
			? function(e){
				/**
				 * needs deferred execution to kill blur event.
				 */
				focus && setTimeout(function(){
					focus.focus();
					Utils.Event.fire(focus, "focus");
				},0);
				return t.local(e);
			}
			: t.local
		);
	}
	if(mode !== 'ignore'){
		var f = mode === 'block' 
			? t.dummy 
			: function(e){
				return (t.onCancel(), t.dummy(e));
			}
		;
		t.setEvents(shadow, f);
		t.setEvents(screen, f);
	}
},
Elements.ModalDiv.prototype = {
	events : ['onclick','ondblclick','ondragstart','onmousedown','onmouseup','onscroll'],
	
	setEvents : function(element, handler){
		var t = this, e = t.events, i;
		for(i = e.length-1; i >= 0; --i){
			element[e[i]] = handler;
		}
	},
	
	busy : function(){
		if(this.busy){
			return;
		}
	},
	ready : function(){
		if(!this.busy){
			return;
		}
	},
	close : function(){
		var t = this, d = t.d;
		d.body.onkeyup = t.keyup;
		d.body.onkeydown = t.keydown;
		d.body.onkeypress = t.keypress;
		t.shadow.parentNode && t.shadow.parentNode.removeChild(t.shadow);
		t.screen.parentNode && t.screen.parentNode.removeChild(t.screen);
	},
	local : function(e){
		return (e || (e = window.event)) && (
			e.cancelBubble = true, /* Microsoft */
			e.stopPropagation && e.stopPropagation(), /* W3C */
			true
		);
	},
	dummy : function(e){
		return (e || (e = window.event)) && (
			e.cancelBubble = true, /* Microsoft */
			e.returnValue = false, /* Microsoft */
			e.stopPropagation && e.stopPropagation(), /* W3C */
			e.preventDefault && e.preventDefault(),
			false
		);
	},
	debug : function(text){
		text && top.debug && top.debug("Elements.ModalDiv: " + text);
	}
},
// we still have to return a class we just defined, implemented and initialized 8-)
Elements.ModalDiv) // <%/FORMAT%>