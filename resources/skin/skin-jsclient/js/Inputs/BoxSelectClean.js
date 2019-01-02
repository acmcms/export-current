// <%FORMAT: 'js' %>
(window.Inputs || (Inputs = parent.Inputs) || (Inputs = {})) &&
Inputs.BoxSelect || (parent.Inputs && (Inputs.BoxSelect = parent.Inputs.BoxSelect)) || (
	// v 0.1d
	//
	//	-= MyX =-
	//
	// uses CSS:
	//		.box-select-plane - whole select control plane,
	//		.box-select-item - unchecked selected item row,
	//		.box-select-item-active - checked selected item row
	//		.box-select-item TD, .box-select-item-active TD - select control item cells,
	//		.box-select-plane img - item icon
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

Inputs.BoxSelect = function(target, id, contents, multiple){
	target && target.inner && (target = target.inner);
	var document = target.ownerDocument;
	var container = document.createElement("div");
	var select = document.createElement("select");
	var plane = document.createElement("div");
	var table = document.createElement("table");
	var label = document.createElement("label");
	
	this.target = target;
	this.select = select;
	this.multiple = multiple;
	
	target.BoxSelect = select.BoxSelect = this.BoxSelect = this;

	multiple && select.setAttribute("multiple", true);
	select.setAttribute("id", id);
	select.setAttribute("name", id);
	select.style.position = "absolute";
	// select.style.width = Math.max(target.clientWidth, 80) + "px";
	// select.style.height = Math.max(target.clientHeight, 80) + "px";
	select.style.width = "0px"; // ie6 - select box is always on top
	select.style.height = "0px"; // ie6 - select box is always on top
	select.style.overflow = "hidden";
	// select.style.zIndex = -1; // no need with zero size
	// select.style.visibility = "hidden"; // - can't get focus & IE produces error.
	// select.style.display = "none"; // same shit happens
	plane.className = "box-select-plane";
	plane.style.position = "absolute";
	plane.style.width = "100%";
	plane.style.height = "100%";
	plane.style.overflow = "auto";
	plane.style.overflowX = "hidden";
	target.select = select;
	target.type = "select-" + (multiple ? "multiple" : "one");
	target.hoverItem = 0;
	target.focusItem = 0;
	target.plane = plane;
	target.onmouseover = this.hpMouseOver;
	target.onmouseout = this.hpMouseOut;
	table.cellPadding = 0;
	table.cellSpacing = 0;
	table.setAttribute("width", "100%");
	table.style.width = "100%";
	this.tbody = document.createElement("tbody");
	/**
	 * Goes before 'redefine' call - actually need 'itemIndex' field to be calculated
	 */
	target.ensureVisible = function(item){
		// this.BoxSelect.debug("ENSURE1: tst=" + (this.plane.scrollTop) + ", iot=" + (item.offsetTop) + ", ioh=" + (item.offsetHeight) + ", tch=" + (this.plane.clientHeight));
		this.plane.scrollTop = Math.max(Math.min(this.plane.scrollTop, item.offsetTop), item.offsetTop + item.offsetHeight - this.plane.clientHeight);
		// this.BoxSelect.debug("ENSURE2: tst=" + (this.plane.scrollTop) + ", iot=" + (item.offsetTop) + ", ioh=" + (item.offsetHeight) + ", tch=" + (this.plane.clientHeight));
	};
	target.redraw = function(){
		this.BoxSelect.debug("redraw" + (this.multiple
			? "."
			: ": selectedIndex=" + this.select.selectedIndex));
		for(var i = this.select.options.length - 1; i >= 0; --i){
			var option = this.select.options[i];
			option.tr.itemIndex = i; // update index %(
			option.tr.className = "box-select-item" + ((option.selected = multiple
					? (String(option.getAttribute("selected")) == "true")
					: i == this.select.selectedIndex)
				? "-active" 
				: "");
		}
		multiple || this.prevIndex == this.select.selectedIndex || 
			this.ensureVisible(this.select.options[this.prevIndex = this.select.selectedIndex].tr);
	};
	var deferredRedraw = function(){
		target.redrawRequested = false;
		target.redraw();
	};
	target.deferRedraw = function(cause){
		if(!this.redrawRequested){
			this.redrawRequested = true;
			setTimeout(deferredRedraw, 25);
		}
		this.BoxSelect.debug(cause + ": " + this.value + ", redraw requested");
	};
	Utils.Event.listen(select, "change", function(){
		target.deferRedraw("change event");
	});
	if((document.implementation.hasFeature("MutationEvents", "2.0") || window.MutationEvent)){
		Utils.Event.listen(select, ["DOMSubtreeModified", "DOMAttrModified"], function(e){
			Inputs.BoxSelect.prototype.domConfirmed || ((Inputs.BoxSelect.prototype.domConfirmed = true) && top.debug && top.debug("attached: dom confirmation passed"));
			e.target.tr && e.attrName == "selected" && target.deferRedraw("dom changes");
		});
		if(Inputs.BoxSelect.prototype.domConfirmed){
			this.BoxSelect.debug("attached: real select feedback method: DOM Mutation Events");
		}else{
			select.setAttribute("domConfirmation", "passed");
			this.BoxSelect.debug("attached: real select feedback method: DOM Mutation Events, dom confirmation pending");
		}
	}
	this.redefine(contents);
	table.appendChild(this.tbody);
	plane.appendChild(table);
	label.setAttribute("for", id);
	label.appendChild(plane);
	container.className = "box-select-container";
	container.style.position = "relative";
	container.style.overflow = "hidden";
	container.appendChild(select);
	container.appendChild(label);
	target.appendChild(container);
	target.onresize = function(){
		this.BoxSelect.debug("contianer resized!");
	};
	if(!Inputs.BoxSelect.prototype.domConfirmed){
		this.BoxSelect.debug("attached: real select feedback method: timer polling");
		var timerPoller = function(){
			Inputs.BoxSelect.prototype.domConfirmed || (target.redraw(), setTimeout(timerPoller, 2000));
		};
		setTimeout(timerPoller, 2000);
	}
	target.prevIndex = -1;
	/**
	 * public API
	 */
	select.redefine = function(contents){
		this.BoxSelect.debug("redefine");
		this.BoxSelect.redefine(contents);
	}
	// end of public API
	return select;
},
Inputs.BoxSelect.prototype = {
	// instance properties
	/**
	 * field id
	 */
	id : null,
	
	// static properties
	domConfirmed : false,
	mouseDown : false,
	mouseOver : false,
	mouseTarget : null,
	mouseMoveTimer : null,
	mouseMoveDirection : 0,
	mouseMoveCounter : 0,
	mouseClientX : 0,
	mouseClientY : 0,
	saveContextMenuTimer : null,
	saveContextMenuHandler : null,
	saveContextMenuSaved : false,
	saveWindowMouseUpHandler : null,
	saveWindowMouseMoveHandler : null,
	saveWindowMouseSaved : false,
	activeTarget : null,
	
	hClearSelection : function(){
		window.getSelection && window.getSelection() && (
				window.getSelection().isCollapsed || 
				window.getSelection().collapseToEnd && window.getSelection().collapseToEnd()
		);
	},
	hpMouseOver : function(){
		with(Inputs.BoxSelect.prototype){
			if(saveContextMenuTimer){
				clearTimeout(saveContextMenuTimer);
				saveContextMenuTimer = null;
			}
			mouseOver = true;
			mouseTarget = this;
			if(!mouseDown){
				fReleaseMouse();
				this.coordinates || (this.coordinates = Standard.calculateObjectCoordinates(this, true));
				activeTarget = this;
			}
			if(!saveContextMenuSaved){
				saveContextMenuSaved = true;
				saveContextMenuHandler = window.document.oncontextmenu;
				window.document.oncontextmenu = function(){
					return false;
				};
				debug("Set context menu handler");
			}
		}
	},
	fReleaseContext : function(){
		with(Inputs.BoxSelect.prototype){
			if(saveContextMenuSaved && !mouseDown){
				saveContextMenuSaved = false;
				window.document.oncontextmenu = saveContextMenuHandler;
				saveContextMenuHandler = null;
				activeTarget = null;
				debug("Restore context menu handler");
			}
			mouseOver = false;
			mouseTarget = null;
		}
	},
	fReleaseMouse : function(){
		with(Inputs.BoxSelect.prototype){
			if(saveWindowMouseSaved){
				mouseMoveTimer && clearTimeout(mouseMoveTimer);
				mouseMoveTimer = null;
				mouseMoveCounter = 0;
				window.document.onmouseup = saveWindowMouseUpHandler;
				saveWindowMouseUpHandler = null;
				window.document.onmousemove = saveWindowMouseMoveHandler;
				saveWindowMouseMoveHandler = null;
				saveWindowMouseSaved = false;
				Utils.Event.fire(activeTarget.select, "change");
				debug("Restore window mouseup handler");
			}
		}
	},
	hpMouseOut : function(){
		with(Inputs.BoxSelect.prototype){
			if(saveContextMenuSaved){
				saveContextMenuTimer = setTimeout(fReleaseContext, 150);
			}
		}
	},
	hwMouseUp : function(){
		with(Inputs.BoxSelect.prototype){
			debug("Mouse UP (window)");
			fReleaseMouse();
			mouseDown = false;
			mouseOver || fReleaseContext();
			return false;
		}
	},
	hwDragTimer : function(){
		with(Inputs.BoxSelect.prototype){
			if(!mouseMoveDirection || (mouseOver && mouseTarget == activeTarget)){
				return mouseMoveCounter = 0, undefined;
			}
			if((mouseMoveCounter++) % (5 - Math.abs(mouseMoveDirection))){
				return;
			}
			var item, i, t = activeTarget, m = t.BoxSelect.multiple;
			if(mouseMoveDirection > 0){
				for(i = 0; i < t.select.options.length; ++i){
					item = t.select.options[i].tr;
					if(t.plane.offsetHeight + t.plane.scrollTop >= item.offsetTop + item.offsetHeight){
						m && item.option.setAttribute("selected", item.option.selected = (i >= t.focusItem));
						continue;
					}
					break;
				}
			}else{
				for(i = t.select.options.length - 1; i >= 0; --i){
					item = t.select.options[i].tr;
					if(t.plane.scrollTop <= item.offsetTop){
						m && item.option.setAttribute("selected", item.option.selected = (i <= t.focusItem));
						continue;
					}
					break;
				}
			}
			if(m) {
				item.option.setAttribute("selected", item.option.selected = true);
				t.ensureVisible(item);
			}else{
				for(i = 0; i < t.select.options.length; ++i){
					var option = t.select.options[i];
					option.setAttribute("selected", option.selected = option == item.option);
				}
				t.select.selectedIndex = item.itemIndex;
			}
			Utils.Event.fire(t.select, "change");
			debug("Mouse Move Timer: " + mouseMoveDirection);
		}
	},
	hwMouseMove : function(e){
		e || (e = window.event);
		with(Inputs.BoxSelect.prototype){
			mouseClientX = e.clientX;
			mouseClientY = e.clientY;
			var target = activeTarget;
			if(target && target.select.options.length > 0){
				if(e.clientY <= target.coordinates.y){
					mouseMoveDirection = -Math.round(Math.min((target.coordinates.y - e.clientY) / target.select.options[0].tr.offsetHeight + 1, 4));
				}else
				if(e.clientY >= target.coordinates.y + target.plane.offsetHeight){
					mouseMoveDirection = Math.round(Math.min((e.clientY - target.coordinates.y - target.plane.offsetHeight) / target.select.options[0].tr.offsetHeight + 1, 4));
				}else{
					mouseMoveDirection = 0;
				}
				debug("Mouse Move: c=" + e.clientX + ":" + e.clientY + ", V=[" + target.coordinates.y + ".." + (target.coordinates.y + target.plane.offsetHeight) + "], md=" + mouseMoveDirection);
				setTimeout(hClearSelection, 0);
			}
		}
	},
	redefine : function(contents){
		var redefined = {};
		for(var i = 0; contents && contents.list && i < contents.list.length; ++i){
			var element = contents.list[i];
			element && (redefined['k_' + element.value] = element);
		}
		for(var i = this.select.options.length - 1; i >= 0; --i){
			var option = this.select.options[i];
			redefined['k_' + option.value] 
				? redefined['k_' + option.value].existing = option
				: (this.select.removeChild(option), this.tbody.removeChild(option.tr));
		}
		for(var i in redefined){
			var element = redefined[i];
			if(!element){
				continue;
			}
			var tr = element.existing
				? ((tr = element.existing.tr), this.select.removeChild(tr.option), this.tbody.removeChild(tr))
				: this.createTableRow(element);
			this.tbody.appendChild(tr);
			this.select.appendChild(tr.option);
		}
		this.target.prevIndex = -1;
		Utils.Event.fire(this.select, "change");
	},
	debug : function(text){
		top.debug && top.debug("Inputs.BoxSelect: " + text);
	},

	createTableRow : function(element){
		var target = this.target;
		var select = this.select;
		with(Inputs.BoxSelect.prototype){
			var option = document.createElement("option");
			var tr = document.createElement("tr");
			option.tr = tr;
			option.value = element.value;
			option.selected = Boolean(element.selected);
			/**
			 * 1) no need for DOM feedback on an option and, 
			 * 2) 'selected' property works on all DOM2 browsers
			 */
			// option.selected ? option.setAttribute("selected", true) : option.removeAttribute("selected");
			option.innerText = element.title;
			tr.option = option;
			tr.value = element.value;
			tr.itemHandled = false;
			tr.itemIndex = -1;
			tr.onmouseover = function(e){
				if(select.disabled || select.getAttribute("disabled")){
					return false;
				}
				e || (e = window.event);
				if(mouseDown && activeTarget == target){
					for(var i = select.options.length - 1; i >= 0; --i){
						select.options[i].setAttribute("selected", select.options[i].selected = target.BoxSelect.multiple
								? i >= Math.min(target.focusItem, this.itemIndex) && i <= Math.max(target.focusItem, this.itemIndex)
								: i == this.itemIndex);
					}
					target.hoverItem = this.itemIndex;
					target.BoxSelect.multiple || (select.selectedIndex = target.focusItem = this.itemIndex);
					target.ensureVisible(this);
					Utils.Event.fire(target.select, "change");
				}
				return false;
			};
			tr.onmouseout = function(){
				this.itemHandled = false;
				return false;
			};
			tr.onclick = tr.onselectstart = function(){
				return false;
			};
			tr.onmouseup = function(){
				if(select.disabled || select.getAttribute("disabled")){
					return false;
				}
				with(this){
					debug("Mouse UP (row)");
					fReleaseMouse();
					mouseDown = false;
					target.coordinates || (target.coordinates = Standard.calculateObjectCoordinates(target, true));
					activeTarget = target;
					return false;
				}
			};
			tr.onmousedown = function(e){
				if(select.disabled || select.getAttribute("disabled")){
					return false;
				}
				select.focus();
				with(this){
					mouseDown = true;
					saveWindowMouseUpHandler = window.document.onmouseup;
					saveWindowMouseMoveHandler = window.document.onmousemove;
					window.document.onmouseup = hwMouseUp;
					window.document.onmousemove = hwMouseMove;
					saveWindowMouseSaved = true;
					debug("mousedown: handlers saved!");
					this.itemHandled = true;
					e || (e = window.event);
					if(target.BoxSelect.multiple){
						if((e.ctrlKey || e.metaKey) && !e.shiftKey){
							target.focusItem = target.hoverItem = itemIndex;
							option.setAttribute("selected", option.selected = !option.selected);
						}else{
							if(!(e.ctrlKey || e.metaKey)){
								for(var i = select.options.length - 1; i >= 0; --i){
									select.options[i].setAttribute("selected", select.options[i].selected = false);
								}
							}
							if(e.shiftKey){
								for(var i = Math.min(target.focusItem, itemIndex); i <= Math.max(target.focusItem, itemIndex); ++i){
									select.options[i].setAttribute("selected", select.options[i].selected = true);
								}
							}else{
								target.focusItem = itemIndex;
								this.option.setAttribute("selected", option.selected = true);
							}
							target.hoverItem = itemIndex;
						}
					}else{
						option.setAttribute("selected", option.selected = true);
						select.selectedIndex = target.focusItem = target.hoverItem = itemIndex;
					}
					setTimeout(hClearSelection, 0);
					mouseMoveTimer || (mouseMoveTimer = setInterval(hwDragTimer, 50));
					target.ensureVisible(this);
					Utils.Event.fire(target.select, "change");
				}
			};
			var td1 = document.createElement("td");
			td1.innerHTML = element.icon ? '<img src="'+element.icon+'">' : '';
			tr.appendChild(td1);
			var td2 = document.createElement("td");
			td2.width = "100%";
			td2.innerHTML = element.title;
			element.cssClass && (td2.className = element.cssClass);
			element.cssStyle && (td2.style.cssText = element.cssStyle);
			tr.appendChild(td2);
			tr.className = "box-select-item" + (tr.option.selected ? "-active" : "");
			element.description && (tr.title = element.description);
			return tr;
		}
	},
	
	toString : function(){
		with(this){
			return "Inputs.BoxSelectClean" + (id ? "('"+id+"')" : "");
		} 
	},
	// just to enable comma on the upper string!
	undefined:undefined
},
// we still have to return a class we just defined, implemented and initialized 8-)
Inputs.BoxSelect) // <%/FORMAT%>