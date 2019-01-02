// <%FORMAT: 'js' %>
(window.Features || (Features = parent.Features) || (Features = {})) &&
Features.MouseCapture || (parent.Features && (Features.MouseCapture = parent.Features.MouseCapture)) || (
	// v 0.1e
	//
	//	-= MyX =-
	//
	// Abstract class provides mouse capturing / release and abstract handlers for mouse events
	// NOT uses CSS:
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//

Features.MouseCapture = function(target){
	this.onDragLock = this.dummy;
	this.onDrag = this.dummy;
	this.onDragRelease = this.dummy;
	
	var document = target.ownerDocument;
	
	this.target = target.inner || target;
	this.plane = target.plane || target;
	
	with(this){
		plane.MouseCapture = target.MouseCapture = this;

		Utils.Event.listen(target, "mouseover", hpMouseOver);
		Utils.Event.listen(target, "mouseout", hpMouseOut);
		Utils.Event.listen(target, "mousedown", hpMouseDown);
	}
	
	return this;
},
Features.MouseCapture.prototype = {
	// instance fields
	target : null,
	plane : null,
	onDragLock : null,
	onDrag : null,
	onDragRelease : null,
	
	// instance variable 'target' plane
	// instance variable 'plane' plane

	mouseDown : false,
	mouseTarget : null,
	dragTimer : null,
	mouseDirection : 0,
	mouseCounter : 0,
	mouseX : 0,
	mouseY : 0,
	mouseCaptured : false,
	saveContextMenuTimer : null,
	saveContextMenuHandler : null,
	saveContextMenuSaved : false,
	activeTarget : null,
	
	/**
	 * Handlers for 'target' plane.
	 * 
	 * When mouse travels above targets this handler used to track mouse target.
	 */
	hpMouseOver : function(e){
		e || (e = window.event);
		// srcElement - real element in IE's setCaupture mode
		// toElement - .Net's 'the object toward which the user is moving the mouse pointer.'
		// target - FF's 'reference to the target to which the event was originally dispatched'
		// relatedTarget is opposite of what we need, so it is unused.
		for(var t = e.srcElement || e.toElement || e.target; t; t = t.parentNode){
			if(t.MouseCapture){
				with(Features.MouseCapture.prototype){
					saveContextMenuTimer && (clearTimeout(saveContextMenuTimer), saveContextMenuTimer = null);
					t = mouseTarget = t.MouseCapture;
					mouseDown || activeTarget == t || (
						t.coordinates = new Utils.Coordinates(t.target).relativeToTopmost(),
						activeTarget = t
					);
					if(!saveContextMenuSaved){
						saveContextMenuSaved = true;
						saveContextMenuHandler = window.document.oncontextmenu;
						window.document.oncontextmenu = dummy;
						debug("mouse over: set context menu handler");
					}
					if(t == activeTarget){
						return true;
					}
					break;
				}
			}
		}
		e.cancelBubble = true; /* Microsoft */
		e.stopPropagation && e.stopPropagation(); /* W3C */
		return false;
	},
	hpMouseOut : function(e){
		e || (e = window.event);
		// srcElement - real element in IE's setCaupture mode
		// fromElement - .Net's 'the object from which activation or the mouse pointer is exiting during the event'
		// target - FF's 'reference to the target to which the event was originally dispatched'
		// relatedTarget is opposite of what we need, so it is unused.
		for(var t = e.srcElement || e.fromElement || e.target; t; t = t.parentNode){
			if(t.MouseCapture){
				with(Features.MouseCapture.prototype){
					saveContextMenuSaved && (
						saveContextMenuTimer || (saveContextMenuTimer = setTimeout(fReleaseContext, 150))
					);
					if(t.MouseCapture == activeTarget){
						return true;
					}
					break;
				}
			}
		}
		e.cancelBubble = true; /* Microsoft */
		e.stopPropagation && e.stopPropagation(); /* W3C */
		return false;
	},
	hpMouseDown : function(e){
		e || (e = window.event);
		with(Features.MouseCapture.prototype){
			setTimeout(hClearSelection, 0);
			hpMouseOver(e);
			mouseDown = true;
			var	t = activeTarget.target, 
				h = window, // window.document is cool, but Opera doesn't like it
				d = h.document,
				c = (
						/* guys from FF made capture in FF4 but it is not working */
						!h.addEventListener &&
						/* capture methods */
						t.setCapture && d.releaseCapture
					) && d.body.appendChild(d.createElement("span"));
			h.addEventListener && !c
				? ( // non-IE thingy
					h.addEventListener("mouseup", hwMouseUp, true), 
					h.addEventListener("mousemove", hwMouseMove, true)
				)
				: c && ( // IE thingy
					c.onmouseup = hwMouseUp, 
					c.onmousemove = hwMouseMove,
					c.onmouseover = hpMouseOver,
					c.onmouseout = hpMouseOut,
					c.setCapture(true)
				);
			mouseCaptured = c || true;
			setTimeout(function(){
				t.MouseCapture.onDragLock();
			}, 0);
			dragTimer || (dragTimer = setInterval(hwDragTimer, 50));
			debug("mouse down: mouse captured, drag timer set, using: " + (c ? "IE capture" : "WND handler"));
		}
		return true;
	},
	/**
	 * 
	 */
	hClearSelection : function(){
		window.getSelection && getSelection() && (
				getSelection().isCollapsed || 
				getSelection().collapseToEnd && getSelection().collapseToEnd()
		);
	},
	/**
	 * when mouse up and not over
	 */
	fReleaseContext : function(){
		with(Features.MouseCapture.prototype){
			mouseTarget = null;
			if(saveContextMenuSaved && !mouseDown){
				saveContextMenuSaved = false;
				window.document.oncontextmenu = saveContextMenuHandler;
				saveContextMenuHandler = null;
				debug("release context: context menu handler restored");
			}
		}
	},
	fReleaseMouse : function(){
		with(Features.MouseCapture.prototype){
			if(mouseCaptured){
				/**
				 * clear drag timer
				 */
				dragTimer && (
					clearInterval(dragTimer),
					dragTimer = null
				);
				/**
				 * release capture indeed
				 */
				var	t = activeTarget.target, 
					h = window, // window.document is cool, but Opera doesn't like it
					d = h.document;
				t && (
					h.removeEventListener && !(
							/* guys from FF made capture in FF4 but it is not working */
							!h.addEventListener &&
							/* capture methods */
							d.releaseCapture && t.setCapture)
						? ( // non-IE thingy
							h.removeEventListener("mouseup", hwMouseUp, true),
							h.removeEventListener("mousemove", hwMouseMove, true)
						)
						: d.releaseCapture && ( // IE thingy
							d.releaseCapture(),
							mouseCaptured.parentNode.removeChild(mouseCaptured)
						),
					setTimeout(function(){
						t.MouseCapture.onDragRelease();
					}, 0), 
					activeTarget = null, 
					debug("release mouse: target released")
				);
				/**
				 * clear some state
				 */
				mouseCounter = 0;
				mouseCaptured = false;
				debug("release mouse: window mouseup handler restored");
			}
		}
	},
	/**
	 * Handlers for window
	 */
	hwMouseUp : function(e){
		e || (e = window.event);
		with(Features.MouseCapture.prototype){
			debug("mouse up: (window)");
			fReleaseMouse();
			mouseDown = false;
			mouseTarget || fReleaseContext();
		}
		e.cancelBubble = true; /* Microsoft */
		e.stopPropagation && e.stopPropagation(); /* W3C */
		return false;
	},
	/**
	 * timer for dragging events
	 */
	hwDragTimer : function(){
		with(Features.MouseCapture.prototype){
			if(!mouseDirection || (mouseTarget == activeTarget)){
				mouseCounter = 0;
				return;
			}
			if((mouseCounter++) % (5 - Math.abs(mouseDirection))){
				return;
			}
			debug("drag timer: (window) md=" + mouseDirection);
			activeTarget.onDrag(mouseDirection);
		}
	},
	/**
	 * Mouse move handler
	 */
	hwMouseMove : function(e){
		e || (e = window.event);
		with(Features.MouseCapture.prototype){
			/**
			 * clear selection anyway
			 */
			setTimeout(hClearSelection, 0);
			mouseX = e.clientX;
			mouseY = e.clientY;
			var c = activeTarget.coordinates;
			mouseDirection = mouseY <= c.ty
				? -Math.round(Math.min((c.ty - mouseY) / 24, 4))
				: mouseY >= c.ty + c.h
					? Math.round(Math.min((mouseY - c.ty - c.h) / 24, 4))
					: 0;
			debug("mouse move: (window) clientY=" + mouseY + ", targetTop=" + c.ty + ", targetBottom=" + (c.ty + c.h) + ", targetBottom2=" + (c.by) + ", md=" + mouseDirection);
			return !mouseDirection || (
					e.cancelBubble = true, /* Microsoft */
					e.stopPropagation && e.stopPropagation(), /* W3C */
					false
				);
		}
	},
	/**
	 * 
	 */
	debug : function(text){
		text && top.debug && top.debug("Features.MouseCapture: " + text);
	},
	
	toString : function(){
		with(this){
			return "Features.MouseCapture" + (target ? "(" + new Utils.Coordinates(target).relativeToTopmost() + ")" : "");
		}
	},
	
	dummy : function(){
		return false;
	}
},
// we still have to return a class we just defined, implemented and initialized 8-)
Features.MouseCapture) // <%/FORMAT%>