// <%FORMAT: 'js' %>
(window.Inputs || (Inputs = parent.Inputs) || (Inputs = {})) &&
Inputs.DropSelect || (parent.Inputs && (Inputs.DropSelect = parent.Inputs.DropSelect)) || (
	// v 0.2e
	//
	//	-= MyX =-
	//
	// uses CSS:
	//		.drop-select-container - select control plane container,
	//		.drop-select-arrow - select control arrow,
	//		.drop-select-plane - whole select control plane,
	//		.drop-select-item - unchecked selected item row,
	//		.drop-select-item-active - checked selected item row
	//		.drop-select-item TD, .drop-select-item-active TD - select control item cells,
	//		.drop-select-plane img - item icon
	//
	//	Please use 'option.setAttribute("selected", x)' instead on 'option.selected=x' for redraw feedback to work properly.
	//	Cross-browser way to check selected option is: '"true" == String(option.getAttribute("selected"))'
	//	or just: 'option.selected' - but your reflection of your changes may be delayed then.
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

Inputs.DropSelect = function(target, id, contents, properties){
	target && target.inner && (target = target.inner);
	var document = target.ownerDocument,
		t = this,
		container = document.createElement("div"),
		select = (target.name||'').toLowerCase() === 'select' ? target : document.createElement("select"),
		plane = document.createElement("div"),
		table = t.table = document.createElement("table"),
		tbody = document.createElement("tbody"),
		tr = document.createElement("tr"),
		td1 = t.td1 = document.createElement("td"),
		td2 = t.td2 = document.createElement("td"),
		arrow = document.createElement("div"),
		properties = t.properties = properties || (properties = {});

	select === target && (target = target.parentNode);
	
	id || (id = select.getAttribute('name'));
	
	container.tr = tr;
	container.select = select;

	t.target = target;
	t.container = container;
	t.select = select;

	t.contents = contents;
	t.dropped = null;
	t.inputFocused = false;
	t.redrawRequested = false;
	
	container.DropSelect = select.DropSelect = t;

	select.setAttribute("id", id);
	select.setAttribute("name", id);
	select.style.position = "absolute";
	select.style.left = "0"; // ie6 - select box is always on top
	select.style.top = "0"; // ie6 - select box is always on top
	select.style.width = "1px"; // ie6 - select box is always on top, WebKit doesn't like 0 surface
	select.style.height = "1px"; // ie6 - select box is always on top, WebKit doesn't like 0 surface
	select.style.overflow = "hidden";
	select.style.zIndex = -2; // no need with zero size
	// select.style.visibility = "hidden"; // - can't get focus & IE produces error.
	// select.style.display = "none"; // same shit happens
	select.style.border = 0;
	select.style.outline = 0;

	t.id = id;
	
	target.type = "select-one";

	plane.className = "drop-select-plane";
	plane.style.position = "absolute";
	plane.style.width = "100%";
	plane.style.overflow = "hidden";
	
	table.cellPadding = 0;
	table.cellSpacing = 0;
	td1.innerHTML = '';
	tr.appendChild(td1);
	td2.width = "100%";
	td2.innerHTML = '';
	tr.appendChild(td2);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	
	plane.appendChild(table);
	
	container.className = "drop-select-container ui-input";
	container.style.position = "relative";
	container.style.overflow = "hidden";
	
	container.appendChild(select);
	
	container.appendChild(plane);
	
	arrow.className = "drop-select-arrow";
	arrow.innerHTML = "&#x25BC;"; // x2335
	arrow.style.position = "absolute";
	arrow.style.top = 0;
	arrow.style.right = 0;
	arrow.style.width = "1em";
	arrow.style.overflow = "hidden";
	/** not used - click on the target instead
	arrow.onclick = function(){
		select.DropSelect.drop();
	};
	*/
	
	container.appendChild(arrow);
	
	container.appendChild(document.createTextNode("\u00a0"));

	/**
	 * implementation for timer - no 'this' value accessible
	 */
	t.deferredRedraw = function(){
		t.redrawRequested = false;
		t.redraw();
	};

	target.appendChild(container);

	/**
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=126379
	 * FF is a bug, but we have to supports it - on change is not working on this
	 * particular type of element. (select, drop-down, single line, using keyboard)
	 */
	Utils.Event.listen(select, ["change", "keypress", "keyup", "keydown"], function(e){
		e || (e = window.event);
		switch(e.keyCode || 0){
		case 13: 
			/**
		 	 * prevent underlying implementation from dropping original control
		 	 */
			t.debug("enter key: type=" + e.type);
			return t.dropped
				? true
				: (
					e.returnValue = false, /* Microsoft */
					e.preventDefault && e.preventDefault(), /* W3C */
					false
				)
			;
		case 32: 
			/**
		 	 * prevent underlying implementation from dropping original control
		 	 */
			t.debug("space key: type=" + e.type);
			return (
				t.dropped || setTimeout(function(){t.drop()},0),
				e.cancelBubble = true, /* Microsoft */
				e.returnValue = false, /* Microsoft */
				e.stopPropagation && e.stopPropagation(), /* W3C */
				e.preventDefault && e.preventDefault(), /* W3C */
				false
			);
		case 38:
		case 40:
			/**
			 * it works so differently natively, we'll implement this ourselves.
			 */
			if(t.dropped){
				return true;
			}
			return (
					e.type === "keydown" && (
						e.altKey || e.shiftKey || e.ctrlKey
						? setTimeout(function(){
							t.drop();
						}, 0)
						: (
							(e.keyCode == 38 
								? select.selectedIndex > 0 && --select.selectedIndex
								: select.selectedIndex < select.options.length - 1 && ++select.selectedIndex
							),
							t.deferRedraw("key navigation"),
							setTimeout(function(){
								Utils.Event.fire(select, "change");
							}, 0)
						)
					),
					e.cancelBubble = true, /* Microsoft */
					e.returnValue = false, /* Microsoft */
					e.stopPropagation && e.stopPropagation(), /* W3C */
					e.preventDefault && e.preventDefault(), /* W3C */
					false
				);
		default: // other keys or event just onChange event
			// e.type === "change" && collapse();
			/**
			 * this one is for updates, we skip some events to reduce the
			 * number of updates, 'keyup' event is here to fight original 
			 * select being dropped down by chrome. 'keypress' and 'keyup' 
			 * attached to change for FF as well, cause it is not firing 'change'
			 * for this particular type of input elements (according to stupid
			 * w3c specification).
			 */
			e.type === "change" && t.deferRedraw("change event");
		}
	});

	/**
	 * after 'change' handler
	 */
	contents && t.redefine(contents);

	container.onmousedown = t.hpMouseDown;
	container.onclick = t.hpMouseClick;

	Utils.Event.listen(select, ["focus", "focusin", "DOMFocusIn"], function(){
		t.inputFocused || (t.inputFocused = true, t.deferRedraw("focus"));
	});
	
	Utils.Event.listen(select, ["blur", "focusout", "DOMFocusOut"], function(){
		t.inputFocused && (t.inputFocused = false, t.deferRedraw("blur"));
	});

	if((document.implementation.hasFeature("MutationEvents", "2.0") || window.MutationEvent)){
		Utils.Event.listen(select, ["DOMSubtreeModified", "DOMAttrModified"], function(e){
			Inputs.DropSelect.prototype.domConfirmed || ((Inputs.DropSelect.prototype.domConfirmed = true) && t.debug("selectattached: dom confirmation passed"));
			e.target.tr && e.attrName === "selected" && t.deferRedraw("dom changes");
		});
		if(Inputs.DropSelect.prototype.domConfirmed){
			t.debug("attached: real select feedback method: DOM Mutation Events");
		}else{
			select.setAttribute("domConfirmation", "passed");
			t.debug("attached: real select feedback method: DOM Mutation Events, dom confirmation pending");
		}
	}
	
	target.onresize = function(){
		t.debug("contianer resized!");
	};
	if(!Inputs.DropSelect.prototype.domConfirmed){
		t.debug("attached: real select feedback method: timer polling");
		var timerPoller = function(){
			Inputs.DropSelect.prototype.domConfirmed || (t.deferRedraw("timer"), container.parentNode === target && setTimeout(timerPoller, 2000));
		};
		setTimeout(timerPoller, 2000);
	}
	/**
	 * public API
	 */
	select.redefine = function(contents){
		t.debug("redefine");
		t.redefine(contents);
	};
	// end of public API

	return select;
},
Inputs.DropSelect.prototype = {
	// instance properties
	/**
	 * field id
	 */
	id : null,
	
	// static properties
	domConfirmed : false,

	drop : function(){
		var t = this;
		if(!t.dropped){
			t.select.focus();
			Utils.Event.fire(t.select, "focus");
			var modalDiv = new Elements.ModalDiv(t.container, {
					screen	: "flee",
					cssStyle: "overflow: auto; overflow-x: hidden;",
					onSubmit: function(){
						t.collapse();
						t.deferRedraw("onSubmit - enter key when dropped");
					},
					onCancel: function(){
						t.collapse();
						t.deferRedraw("onCancel - escape key when dropped");
					}/*,
					focus	: t.select*/
				}),
				selectBox = new Inputs.BoxSelect(modalDiv.modal, t.select, t.contents, { 
					multiple	: false,
					scroll		: modalDiv.modal,
					cssClass	: "ui-none",
					onItemClick	: function(){
						t.collapse();
						t.deferRedraw("onclick - item clicked in dropped list");
					}
				});
			t.dropped = {
				modal	: modalDiv,
				select	: selectBox.BoxSelect
			};
			t.redraw();
		}
	},
	
	collapse : function(){
		var t = this, d = t.dropped;
		if(d){
			t.dropped = null;
			d.select.destroy();
			d.modal.close();
		}
	},
	
	hpMouseDown : function(){
		this.select.focus();
		Utils.Event.fire(this.select, "focus");
		return false;
	},
	
	hpMouseClick : function(){
		this.DropSelect.drop();
		return false;
	},
	
	deferRedraw : function(cause){
		var t = this;
		t.redrawRequested || (
			t.redrawRequested = true, 
			setTimeout(t.deferredRedraw, 25),
			t.debug(cause + ": " + t.select.value + ", redraw enqueued")
		);
	},
	
	redraw : function(){
		with(this){
			debug("redraw selectedIndex=" + select.selectedIndex);
			var r;
			
			var element = select.options.length
				? select.options[select.selectedIndex].definition
				: {};
				
			td1.innerHTML === (
				r = element.icon ? '<img src="'+element.icon+'">' : ''
			) || (td1.innerHTML = r);
			
			td2.innerHTML === (
				r = element.title
			) || (td2.innerHTML = r);
			
			td2.className === (
				r = element.cssClass || ''
			) || (td2.className = r);
			
			td2.style.cssText === (
				r = element.cssStyle || '' 
			) || (td2.style.cssText = r);
			
			table.className = "drop-select-item" + (inputFocused 
				? dropped
					? "" 
					: "-active"
				/**
				 * not focused anymore!
				 */
				: (dropped && collapse(), "")
				);
			
			container.title === (
					r = element.description || ''
				) || (container.title = r);
		}
	},
	
	/**
	 * update contents definition, remove removed options, create new ones and so on.
	 */
	redefine : function(contents){
		var t = this, redefined = {}, changed = 0;
		/**
		 * put all items from definition, mapped by value (suppose value is unique)
		 */
		for(var i = 0; contents && contents.list && i < contents.list.length; ++i){
			var item = contents.list[i];
			item && (redefined['k_' + item.value] = { item : item });
		}
		/**
		 * traverse all options currently defined on our select element
		 */
		for(var i = t.select.options.length - 1; i >= 0; --i){
			var option = t.select.options[i];
			redefined['k_' + option.value] 
				/**
				 * associate an option with an item
				 */
				? redefined['k_' + option.value].existing = option
				/**
				 * remove an option from select box for non-existing item
				 */
				: t.select.removeChild(option);
		}
		/**
		 * 
		 */
		for(var i in redefined){
			var record = redefined[i];
			if(!record){
				continue;
			}
			changed ++;
			t.select.appendChild(record.existing
				? t.select.removeChild(record.existing)
				: t.createOption(record.item)
			);
		}
		/**
		 * 
		 */
		t.contents = contents;
		/**
		 * finally, fire 'onchange' event for all undisclosed listeners (if any)
		 */
		changed && Utils.Event.fire(t.select, "change");
	},

	createOption : function(element){
		with(Inputs.DropSelect.prototype){
			var option = document.createElement("option");
			option.definition = element;
			option.value = element.value;
			option.selected = Boolean(element.selected);
			/**
			 * 1) no need for DOM feedback on an option and, 
			 * 2) 'selected' property works on all DOM2 browsers
			 */
			// option.selected ? option.setAttribute("selected", true) : option.removeAttribute("selected");
			option.innerText = element.title;
			element.description && (option.title = element.description);
			return option;
		}
	},
	
	debug : function(text){
		top.debug && top.debug( this.toString() + ": " + text );
	},
	
	toString : function(){
		return "Inputs.DropSelect" + (this.id ? "('"+this.id+"')" : "");
	},
	// just to enable comma on the upper string!
	undefined:undefined
},
// we still have to return a class we just defined, implemented and initialized 8-)
Inputs.DropSelect) // <%/FORMAT%>