// <%FORMAT: 'js' %>
(window.Inputs || (Inputs = parent.Inputs) || (Inputs = {})) &&
Inputs.BoxSelect || (parent.Inputs && (Inputs.BoxSelect = parent.Inputs.BoxSelect)) || (
	// v 0.2p
	//
	//	-= MyX =-
	//
	// uses CSS:
	//		.box-select-container - whole select control container,
	//		.box-select-plane - whole select control plane,
	//		.box-select-item - unchecked selected item row,
	//		.box-select-item-active - checked selected item row
	//		.box-select-item TD, .box-select-item-active TD - select control item cells,
	//		.box-select-plane img - item icon
	//
	//	Please use 'option.setAttribute("selected", x)' instead on 'option.selected=x' for redraw feedback to work properly.
	//	Cross-browser way to check selected option is: 'option.selected' 
	//	(not: '"true" === String(option.getAttribute("selected"))' cause system is not setting them)
	//
	//
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//
	// item structure: { title : "item titie, required", icon : "item icon", value : "item value", cssClass : "class name", cssStyle : "style" }
	//
	//
	// Constructor:
	//	target, id/selectElement, contents, multipleBoolean/properties
	//
	// Properties:
	//	multiple	: true/false, default is false
	//	scroll		: element with scroll for this element - event will be attached and own scroller will not be created
	//	cssClass	: css class name for container surface, 'ui-input' is default
	//	onChange	: function(x)
	//	onItemClick	: function() - fired after onChange when there is distinct mouse click on non-multiple select box
	//	onKeyLoop	: function() - fired when keyboard navigation loops before first or after last option
	//	onKeyTab	: function() - fired when TAB key pressed while input is focused
	//
	//
Inputs.BoxSelect = function(target, id, contents, properties){
	target && target.inner && (target = target.inner);
	var document = target.ownerDocument,
		t = this,
		container = t.container = document.createElement("div"),
		select = t.select = ("string" === typeof id 
			? document.createElement("select")
			: id
		),
		plane = t.plane = document.createElement("div"),
		table = document.createElement("table"),
	//	label = document.createElement("label"),
		multiple = t.multiple = typeof properties === 'boolean' ? properties : properties.multiple,
		properties = t.properties = typeof properties === 'object' ? properties : {};
	
	t.target = target;

	table.select = select;
	table.plane = plane;

	table.BoxSelect = select.BoxSelect = t;

	if(select !== id) {
		multiple && select.setAttribute("multiple", true);
		select.setAttribute("id", id);
		select.setAttribute("name", id);
		select.style.position = "absolute";
		select.style.position = "fixed";
		// select.style.width = Math.max(target.clientWidth, 80) + "px";
		// select.style.height = Math.max(target.clientHeight, 80) + "px";
		select.style.width = "0px"; // ie6 - select box is always on top
		select.style.height = "0px"; // ie6 - select box is always on top
		select.style.overflow = "hidden";
		select.style.zIndex = -9; // no need with zero size
		// select.style.visibility = "hidden"; // - can't get focus & IE produces error.
		// select.style.display = "none"; // same shit happens
		select.style.border = 0;
		select.style.outline = 0;
		container.appendChild(select);
	}else{
		id = select.getAttribute("id") || select.getAttribute("name");
	}
	t.id = id;
	
	plane.className = "box-select-plane";
	plane.style.zoom = 1; // trigger hasLayout for IE
	if(!properties.scroll){
		// plane.style.position = "absolute";
		plane.style.width = "100%";
		plane.style.height = "100%";
		plane.style.overflow = "auto";
		plane.style.overflowX = "hidden";

		/**
		 * we don't want to scroll the whole page when we scrolling scrollable BoxSelect
		 */
		Utils.Event.listen(plane, ['DOMMouseScroll', 'mousewheel'], function(e){
			var delta = -e.detail || e.wheelDelta / 120, 
				top = plane.scrollTop, 
				frame = plane.clientHeight, 
				height = table.offsetHeight;
			return	(height <= frame) || 
					(delta > 0 && top > 0) || 
					(delta < 0 && top + frame < height) ||
			/**
			 * ...or we'd like to cancel the event, so page will not scroll
			 */
			(
				t.debug("plane mouse scroll cancel: type=" + e.type + ", delta=" + delta + ", scrollTop=" + top + ", offsetHeight=" + frame + ", tableHeight=" + table.offsetHeight),
				e.cancelBubble = true, /* Microsoft */
				e.returnValue = false, /* Microsoft */
				e.cancel = true,
				e.stopPropagation && e.stopPropagation(), /* W3C */
				e.preventDefault && e.preventDefault(), /* W3C */
				false
			);
		});
	}
	target.type = "select-" + (multiple ? "multiple" : "one");
	
	t.hoverItem = 0;
	t.focusItem = 0;
	
	var mouse = new Features.MouseCapture(properties.scroll || label);
	mouse.onDrag = t.onDragScroll;
	mouse.onDragLock = function(){
		/**
		 * needed to kill blur event.
		 * already deferred?
		 */
		setTimeout(function(){
			select.focus();
			Utils.Event.fire(select, "focus");
		},0);
	};
	mouse.onDragRelease = t.onDragScrollRelease;
	mouse.BoxSelect = t;
	
	table.cellPadding = 0;
	table.cellSpacing = 0;
	// table.setAttribute("width", "100%");
	table.style.width = "100%";
	t.tbody = document.createElement("tbody");
	t.deferredRedraw = function(){
		t.redrawRequested = false;
		container.parentNode === target && t.redraw();
	};
	
	table.appendChild(t.tbody);
	plane.appendChild(table);
	// label.setAttribute("for", id);
	// label.style.cssText = "width:100%;height:100%;zoom:1"; // zoom is to trigger hasLayout in IE
	// label.style.cssText = "width:100%;height:100%;position:absolute;left:0;top:0;";
	// label.appendChild(plane);
	container.className = "box-select-container " + (properties.cssClass || "ui-input");
	container.style.position = "relative";
	properties.scroll || (container.style.overflow = "hidden");
	// container.appendChild(label);
	container.appendChild(plane);
	
	Utils.Event.listen(select, "change", t.selectChange = function selectChange(){
		t.deferRedraw("change event");
		!multiple && 'function' === typeof properties.onChange && setTimeout(function(){
			properties.onChange.call(select, t.inputValue());
		},0);
	});
	
	/**
	 * if goes earlier - IE fires 'unspecified error', if later - FF will blink-redraw it.
	 * must me after 'change' handler
	 */
	t.redefine(contents);
	target.appendChild(container);
	target.onresize = function(){
		t.debug("contianer resized!");
	};
	
	Utils.Event.listen(select, ["keydown","keyup"], t.selectKey = function selectKey(e){
		e || (e = window.event);
		switch(e.keyCode || 0){
		case 9:
			if(e.type === 'keydown' && !e.altKey && !e.ctrlKey){
				'function' === typeof properties.onKeyTab && properties.onKeyTab.call(select);
			}
			return true;
		case 38:
			if(e.type === 'keydown' && !e.altKey && !e.shiftKey && !e.ctrlKey && !multiple){
				t.debug("onKeyScroll: UP, index=" + t.prevIndex);
				t.prevIndex > 0
					? Utils.Event.fire(select, "change")
					: 'function' === typeof properties.onKeyLoop && setTimeout(function(){
						properties.onKeyLoop.call(select);
					},0);
			}
			return true;
			/** 
			 * not working in FF, have to do it other way:
			 */
			//e.cancelBubble = true; /* Microsoft */
			//e.returnValue = false; /* Microsoft */
			//e.stopPropagation && e.stopPropagation(); /* W3C */
			//e.preventDefault && e.preventDefault();
			//return false;
		case 40:
			if(e.type === 'keydown' && !e.altKey && !e.shiftKey && !e.ctrlKey && !multiple){
				t.debug("onKeyScroll: DN, index=" + t.prevIndex);
				t.prevIndex < select.options.length - 1
					? Utils.Event.fire(select, "change")
					: 'function' === typeof properties.onKeyLoop && setTimeout(function(){
						properties.onKeyLoop.call(select);
					},0);
				Utils.Event.fire(select, "change");
			}
			return true;
			/** 
			 * not working in FF, have to do it other way:
			 */
			//e.cancelBubble = true; /* Microsoft */
			//e.returnValue = false; /* Microsoft */
			//e.stopPropagation && e.stopPropagation(); /* W3C */
			//e.preventDefault && e.preventDefault();
			//return false;
		}
	});
	
	if((document.implementation.hasFeature("MutationEvents", "2.0") || window.MutationEvent)){
		Utils.Event.listen(select, t.evtCtrl, t.domHandler = function(e){
			Inputs.BoxSelect.prototype.domConfirmed || ((Inputs.BoxSelect.prototype.domConfirmed = true) && t.debug("attached: dom confirmation passed"));
			/* e.target.tr && e.attrName === "selected" && */ t.deferRedraw("dom changes: " + e.type);
		});
		if(Inputs.BoxSelect.prototype.domConfirmed){
			t.debug("attached: real select feedback method: DOM Mutation Events");
		}else{
			select.setAttribute("domConfirmation", "check1");
			select.appendChild(document.createComment("domCheck"));
			t.debug("attached: real select feedback method: DOM Mutation Events, dom confirmation pending");
		}
	}
	if(!Inputs.BoxSelect.prototype.domConfirmed){
		t.debug("attached: real select feedback method: timer polling");
		var timerPoller = function(){
			Inputs.BoxSelect.prototype.domConfirmed || (t.deferRedraw("timer"), container.parentNode === target && setTimeout(timerPoller, 5000));
		};
		setTimeout(timerPoller, 5000);
	}
	t.prevIndex = -1;
	/**
	 * public API
	 */
	select.redefine = function(contents){
		t.debug("redefine");
		t.redefine(contents);
	}
	// end of public API
	return select;
},
Inputs.BoxSelect.prototype = {
	// constants 8-)
		/**
		 * TODO: "DOMSubtreeModified" is added for WebKit. Please, remove it when Chrome and 
		 * Safari will support "DOMAttrModified".
		 */
	evtCtrl : ["DOMNodeInserted", "DOMNodeRemoved", "DOMAttrModified", "DOMSubtreeModified"],
	/**
	 * TODO: "DOMSubtreeModified" is added for WebKit. Please, remove it when Chrome and 
	 * Safari will support "DOMAttrModified".
	 */
	evtItem : ["DOMCharacterDataModified", "DOMNodeInserted", "DOMNodeRemoved", "DOMAttrModified", "DOMSubtreeModified"],
	
	// instance properties
	/**
	 * field id
	 */
	id : null,
	
	// static properties
	domConfirmed : false,
	mouseDown : false,
	activeTarget : null,
	
	onDragScroll : function(mouseMoveDirection){
		if(!mouseMoveDirection){
			return undefined;
		}
		var item, i, t = this.BoxSelect, s = t.select, m = t.multiple, pane = t.properties.scroll || t.plane;
		if(mouseMoveDirection > 0){
			for(i = 0; i < s.options.length; ++i){
				item = s.options[i].tr;
				if(pane.offsetHeight + pane.scrollTop >= item.offsetTop + item.offsetHeight){
					m && (item.option.selected = (i >= t.focusItem));
					continue;
				}
				break;
			}
		}else{
			for(i = s.options.length - 1; i >= 0; --i){
				item = s.options[i].tr;
				if(pane.scrollTop <= item.offsetTop){
					m && (item.option.selected = (i <= t.focusItem));
					continue;
				}
				break;
			}
		}
		if(m) {
			item.option.selected = true;
			t.ensureVisible(item);
		}else{
			for(i = 0; i < s.options.length; ++i){
				var option = s.options[i];
				option.selected = option === item.option;
			}
			if(item.itemIndex < 0) throw "Bad Index";
			s.selectedIndex = item.itemIndex;
		}
		Utils.Event.fire(s, "change");
		t.debug("onDragScroll: " + mouseMoveDirection);
	},
	
	onDragScrollRelease : function(){
		Inputs.BoxSelect.prototype.mouseDown = false;
		Inputs.BoxSelect.prototype.activeTarget = null;
	},
	
	/**
	 * update contents definition, remove removed options, create new ones and so on.
	 */
	redefine : function(contents){
		var t = this, s = t.select, redefined = {}, changed = 0, i;
		/**
		 * put all items from definition, mapped by value (suppose value is unique)
		 */
		for(i = 0; contents && contents.list && i < contents.list.length; ++i){
			var item = contents.list[i];
			item && (redefined['k_' + item.value] = { item : item });
		}
		/**
		 * traverse all options currently defined on our select element
		 */
		for(i = s.options.length - 1; i >= 0; --i){
			var option = s.options[i];
			redefined['k_' + option.value] 
				/**
				 * associate an option with an item
				 */
				? redefined['k_' + option.value].existing = option
				/**
				 * remove an option from select box for non-existing item
				 */
				: (s.removeChild(option), option.tr && t.tbody.removeChild(option.tr));
		}
		/**
		 * 
		 */
		for(i in redefined){
			var record = redefined[i];
			if(!record){
				continue;
			}
			++changed;
			var tr = record.existing && record.existing.tr && record.existing.tr.BoxSelect === t
				? ((tr = record.existing.tr), s.removeChild(tr.option), t.tbody.removeChild(tr))
				: t.createTableRow(record);
			t.tbody.appendChild(tr);
			s.appendChild(tr.option);
		}
		/**
		 * 
		 */
		t.prevIndex = -1;
		/**
		 * finally, fire 'onchange' event for all undisclosed listeners (if any)
		 */
		changed && Utils.Event.fire(s, "change");
	},

	ensureVisible : function(item){
		var t = this,
			pane = t.properties.scroll || t.plane,
			otop = pane === t.plane ? item.offsetTop : (new Utils.Coordinates(item)).relativeTo(pane).ty;
		t.debug("ENSURE1: own=" + (pane === t.plane) + ", tst=" + (pane.scrollTop) + ", iot=" + (otop) + ", ioh=" + (item.offsetHeight) + ", tch=" + (pane.clientHeight));
		pane.scrollTop = Math.max(
			Math.min(pane.scrollTop, otop), 
			otop + item.offsetHeight - pane.clientHeight
		);
		t.debug("ENSURE2: own=" + (pane === t.plane) + ", tst=" + (pane.scrollTop) + ", iot=" + (otop) + ", ioh=" + (item.offsetHeight) + ", tch=" + (pane.clientHeight));
	},

	deferRedraw : function(cause){
		var t = this;
		t.redrawRequested || (
			t.redrawRequested = true, 
			setTimeout(t.deferredRedraw, 25),
			t.debug(cause + ": " + t.inputValue() + ", redraw enqueued")
		);
	},

	redraw : function(){
		var t = this, r, i, option,
			m = t.multiple,
			s = t.select, 
			o = s.options,
			si = (("function" === typeof t.properties.noHilight ? t.properties.noHilight.call(s) : 0)
				? -1
				: s.selectedIndex
			) ;
		t.debug("redraw" + (m
				? "."
				: ": selectedIndex=" + si + ", prevIndex=" + t.prevIndex));
		for(i = o.length - 1; i >= 0; --i){
			option = o[i];
			option.tr.itemIndex = i; // update index %(
			option.tr.className === (
				r = "box-select-item" + ((option.selected = m
						? option.selected
						: i === si)
					? "-active" 
					: "")
			) || (option.tr.className = r);
		}
		m || o.length === 0 || t.prevIndex === si ||
			(t.prevIndex = si) >= 0 && t.ensureVisible(o[si].tr);
	},
	
	inputValue : function(){
		var t = this, s = t.select, o = s.options, 
			r, i = s.selectedIndex;
		if(!t.multiple){
			return o.length && i >= 0
				? o[i].value
				: undefined;
		}
		r = [];
		for(i = 0; i < o.length; ++i){
			o[i].selected && r.push(o[i].value);
		}
		return r;
	},
	
	createTableRow : function(element){
		var t = this,
			p = Inputs.BoxSelect.prototype,
			target = t.target,
			select = t.select,
			tr = document.createElement("tr"),
			option;
		/**
		 * to check ownership later
		 */
		tr.BoxSelect = t;
		/**
		 * option must be reused (when attaching to existing select control)
		 */
		if(element.existing){
			option = element.existing;
			element = element.item;
		}else{
			option = document.createElement("option");
			element = element.item;
			option.value = element.value;
			option.selected = Boolean(element.selected);
			option.innerText = element.title;
			t.domHandler && Utils.Event.listen(option, t.evtItem, t.domHandler);
		}
		option.tr = tr;
		tr.option = option;
		tr.itemHandled = false;
		tr.itemIndex = -1;
		tr.onmouseover = function(e){
			if(select.disabled || select.getAttribute("disabled")){
				return false;
			}
			e || (e = window.event);
			if(p.mouseDown && p.activeTarget === target){
				for(var i = select.options.length - 1; i >= 0; --i){
					select.options[i].selected = t.multiple
							? i >= Math.min(t.focusItem, tr.itemIndex) && i <= Math.max(t.focusItem, tr.itemIndex)
							: i === tr.itemIndex;
				}
				t.hoverItem = tr.itemIndex;
				if(tr.itemIndex < 0) throw "Bad Index";
				t.multiple || (select.selectedIndex = t.focusItem = tr.itemIndex);
				t.ensureVisible(tr);
				Utils.Event.fire(select, "change");
			}
			return false;
		};
		tr.onmouseout = function(){
			tr.itemHandled = false;
			return false;
		};
		tr.onclick = function(){
			!t.multiple && ('function' === typeof t.properties.onItemClick)
				? t.properties.onItemClick.call(select)
				: select.focus();
			return false;
		};
		tr.onselectstart = function(){
			select.focus();
			return false;
		};
		tr.onmousedown = function(e){
			if(select.disabled || select.getAttribute("disabled")){
				return false;
			}
			select.focus();
			var itemIndex = tr.itemIndex;
			p.mouseDown = true;
			p.activeTarget = target;
			tr.itemHandled = true;
			e || (e = window.event);
			if(t.multiple){
				if((e.ctrlKey || e.metaKey) && !e.shiftKey){
					t.focusItem = t.hoverItem = itemIndex;
					option.selected = !option.selected;
				}else{
					if(!(e.ctrlKey || e.metaKey)){
						for(var i = select.options.length - 1; i >= 0; --i){
							select.options[i].selected = false;
						}
					}
					if(e.shiftKey){
						for(var i = Math.min(t.focusItem, itemIndex); i <= Math.max(t.focusItem, itemIndex); ++i){
							select.options[i].selected = true;
						}
					}else{
						t.focusItem = itemIndex;
						option.selected = true;
					}
					t.hoverItem = itemIndex;
				}
			}else{
				option.selected = true;
				if(itemIndex < 0) throw "Bad Index";
				select.selectedIndex = t.focusItem = t.hoverItem = itemIndex;
			}
			t.ensureVisible(tr);
			Utils.Event.fire(select, "change");
			setTimeout(function(){
				select.focus();
				Utils.Event.fire(select, "focus");
			},0)
			return false;
		};
		var td1 = document.createElement("td");
		td1.innerHTML = element.icon ? '<img src="'+element.icon+'">' : '';
		/**
		 * to compensate for not having td2.width = "100%"
		 * 
		 * ie doesn't like 0 there - throws 'Invalid Argument'
		 */
		td1.width = 1;
		tr.appendChild(td1);
		var td2 = document.createElement("td");
		/**
		 * chrome doesn't like it - makes wider than you want
		 */
		// td2.width = "100%"; 
		/**
		 * ie doesn't like it - throws 'Invalid Argument'
		 */
		// td2.width = "*";  
		td2.innerHTML = element.title;
		element.cssClass && (td2.className = element.cssClass);
		element.cssStyle && (td2.style.cssText = element.cssStyle);
		tr.appendChild(td2);
		tr.className = "box-select-item" + (tr.option.selected ? "-active" : "");
		element.description && (tr.title = element.description);
		return tr;
	},
	
	destroy : function(){
		var t = this;
		/**
		 * remove input itself, of course
		 */
		t.target.removeChild(t.container);
		try{
			delete t.select.BoxSelect;
		}catch(e){
			/**
			 * ie7/ie8 do not support 'delete' (at least on SELECT element)
			 */
			t.select.BoxSelect = undefined;
		}
		/**
		 * Have to unregister, this control supports externally provided input 
		 * whose life going to be longer than lifetime of BoxSelect.
		 */
		Utils.Event.remove(t.select, "change", t.selectChange);
		Utils.Event.remove(t.select, ["keydown","keyup"], t.selectKey);
		if(t.domHandler) { 
			Utils.Event.remove(t.select, t.evtCtrl, t.domHandler);
			for(var i = t.select.options.length-1; i >= 0; --i){
				Utils.Event.remove(t.select.options[i], t.evtItem, t.domHandler);
			}
		}
	},
	
	debug : function(text){
		top.debug && top.debug( this.toString() + ": " + text );
	},
	
	toString : function(){
		return "Inputs.BoxSelect" + (this.id ? "('"+this.id+"')" : "");
	},
	// just to enable comma on the upper string!
	undefined:undefined
},
// we still have to return a class we just defined, implemented and initialized 8-)
Inputs.BoxSelect) // <%/FORMAT%>