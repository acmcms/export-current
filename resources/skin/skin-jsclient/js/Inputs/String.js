// <%FORMAT: 'js' %>
(window.Inputs || (Inputs = parent.Inputs) || (Inputs = {})) &&
Inputs.String || (parent.Inputs && (Inputs.String = parent.Inputs.String)) || (
	// v 0.2e
	//
	// -= MyX =-
	//
	// uses CSS:
	// .input-string-container - select control plane container,
	// .input-string-icon - associated icon,
	// .input-string-cross - clear button (shown when field is not empty and
	// editable),
	//
	// .input-string-item - unchecked selected item row,
	// .input-string-item-active - checked selected item row
	// .input-string-item TD, .input-string-item-active TD - select control item
	// cells,
	//
	// Please use 'input.setAttribute("value", x)' instead on 'input.value = x'
	// for redraw feedback to work properly.
	//
	// Suggestion box:
	// properties.suggestionsFn = function(text){
	// return [
	// item1, item2 ... itemN
	// ];
	// }
	//
	// Item structure: {
	// title : "item titie, required",
	// icon : "item icon",
	// value : "item value",
	// cssClass : "class name",
	// cssStyle : "style"
	// }
	//
	// properties can also contain same fields as item structure to define input
	// field general looks, tooltip and so on.

Inputs.String = function(target, id, properties){
	target && target.inner && (target = target.inner);
	var document = target.ownerDocument,
		t = this,
		container = t.container = document.createElement("div"),
		holder = document.createElement("div"),
		input = t.input = ("string" === typeof id 
				? document.createElement("input")
				: id),
		table = t.table = document.createElement("table"),
		tbody = document.createElement("tbody"),
		tr = document.createElement("tr"),
		td1 = t.td1 = document.createElement("td"),
		td2 = t.td2 = document.createElement("td"),
		td3 = t.td3 = document.createElement("td");

	container.tr = tr;
	container.input = input;

	t.target = target;

	t.properties = properties = properties || (properties = {});
	t.dropped = null;
	t.inputFocused = false;
	t.redrawRequested = false;
	
	container.String = input.String = t;

	container.className = "input-string-container ui-input";
	container.style.cssText = target.childNodes.length > 1
		// zoom:1; triggers hasLayout in IE, *display:inline; triggers
		// 'inline-block' for 'div'
		? "position:relative; overflow:hidden; display:-moz-inline-stack; display:inline-block; zoom:1; *display:inline;"
		: "position:relative; overflow:hidden;"; // width:100%; - DIV is
													// already 100%, ain't it?

	input.style.overflow = "hidden";
	input.style.left = 0; // ie6 - select box is always on top
	input.style.top = 0; // ie6 - select box is always on top
	input.style.border = 0;
	input.style.outline = 0;
	input.style.padding = 0;
	input.style.margin = 0;
	
	if(input !== id) {
		input.setAttribute("type", "text");
		input.setAttribute("id", id);
		input.setAttribute("name", id);
		t.id = id;
	}else{
		t.id = input.getAttribute("id") || input.getAttribute("name");
		/**
		 * in other case it is just appended later
		 */
		target.replaceChild(container, input);
	}
	
	var clone = input.cloneNode(false);
	clone.setAttribute("id", "");
	clone.setAttribute("name", "");
	clone.setAttribute("disabled", "true");
	clone.setAttribute("value", "icq:2206241");
	/**
	 * to prevent re-acquisition
	 */
	clone.setAttribute("skip", "true");
	clone.className = "input-string-item"; // should be set explicitly - not
											// there before redraw()
	clone.style.position = "relative";
	// clone.style.visibility = "hidden";
	// /// clone.style.marginRight = "36px";
	clone.style.zIndex = -10;

	input.style.position = "absolute";
	input.style.minWidth = "100%"; // ie6 - select box is always on top, WebKit
									// doesn't like 0 surface
	input.style.width = "100%"; // ie6 - select box is always on top, WebKit
								// doesn't like 0 surface
	input.style.height = "100%"; // ie6 - select box is always on top, WebKit
									// doesn't like 0 surface
	// select.style.zIndex = -2; // no need with zero size
	// select.style.visibility = "hidden"; // - can't get focus & IE produces
	// error.
	// select.style.display = "none"; // same shit happens
	
	/**
	 * to maintain dimensions
	 */
	container.appendChild(clone);

	table.style.position = "absolute";
	table.style.padding = 0;
	table.style.margin = 0;
	table.style.border = 0;
	table.style.minWidth = "100%";
	table.style.left = 0;
	table.style.top = 0;
	table.style.width = "100%";
	table.style.height = "100%";
	table.style.tableLayout = "auto";
	table.style.emptyCells="show";
	table.cellPadding = 0;
	table.cellSpacing = 0;
	table.border = 0;
	
	td1.style.position = "relative";
	td1.style.padding = 0;
	td1.style.margin = 0;
	td1.style.verticalAlign = "middle";
	td1.style.textAlign = "center";
	td1.innerHTML = '';
	tr.appendChild(td1);
	
	holder.style.position = "relative";
	holder.style.height = "100%";
	holder.style.overflow = "hidden";
	
	/**
	 * to maintain dimensions (2nd time)
	 */
	clone = clone.cloneNode(false);
	clone.style.minWidth = "100%";
	clone.style.width = "100%";
	clone.style.marginRight = "-36px";
	holder.appendChild(clone);
	holder.appendChild(input);

	td2.style.position = "relative";
	td2.style.padding = 0;
	td2.style.margin = 0;
	td2.style.verticalAlign = "middle";
	td2.style.textAlign = "left";
	td2.style.width = "100%";
	td2.width = "100%";
	td2.appendChild(holder);
	tr.appendChild(td2);
	
	
	/**
	 * cant do this - to let CSS class work
	 */
	// td3.style.position = "relative";
	// td3.style.padding = 0;
	// td3.style.margin = 0;
	// td3.style.verticalAlign = "middle";
	// td3.style.textAlign = "center";
	/**
	 * end of 'cannot do this'
	 */
	td3.innerHTML = '';
	td3.className = "input-string-nocross";
	tr.appendChild(td3);
	

	tbody.appendChild(tr);
	table.appendChild(tbody);
	
	container.appendChild(table);
	
	// no whitespace needed - not an absolute control
	// container.appendChild(document.createTextNode("\u00a0"));

	input !== id && target.appendChild(container);

	td3.onclick = function(){
		t.debug("'clear' cross clicked.");
		input.value = "";
		input.focus();
		t.collapse();
		Utils.Event.fire(input, ["focus","change"]);
		return false;
	};

	/**
	 * implementation for timer
	 */
	t.deferredRedraw = function(){
		t.redrawRequested = false;
		t.redraw();
	};
	
	t.prevValue = input.value;
	
	t.deferredChange = new Features.DeferredChange(input, {
		onChange	: function(){
			t.prevValue === input.value || (t.prevValue = input.value, t.deferRedraw("change event"),
				t.inputFocused && properties.suggestionsFn && setTimeout(function(){
					t.input.value ? t.drop() : t.collapse();
				},50)
			);
		}
	});

	/**
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=126379 FF is a bug, but we
	 * have to supports it - on change is not working on this particular type of
	 * element. (select, drop-down, single line, using keyboard)
	 */
	Utils.Event.listen(input, ["keypress", "keyup", "keydown"], function(e){
		e || (e = window.event);
		switch(e.keyCode){
		case 27:
		case 13:
		case 9:
			setTimeout(function(){
				t.deferredChange.cancel();
				t.collapse();
			},0);
			return true;
		case 38:
		case 40:
			return !properties.suggestionsFn || e.altKey || e.shiftKey || e.ctrlKey || (
				e.type === 'keydown' && (t.dropped
					? !t.dropped.select || t.dropped.enabled && (
						t.dropped.select.selectedIndex = (e.keyCode === 40 
							? t.inputFocused 
								? 0 
								: t.dropped.select.selectedIndex + 1
							: t.inputFocused 
								? t.dropped.select.options.length - 1 
								: t.dropped.select.selectedIndex - 1
						),
						t.inputFocused = false,
						/**
						 * FF needs it to be asynchronous
						 */
						setTimeout(function(){
							t.dropped.select.focus();
							Utils.Event.fire(t.dropped.select, ["focus","change"]);
							t.deferRedraw("key blur");
						},0)
					)
					: t.drop()
				),
				e.cancelBubble = true, /* Microsoft */
				e.stopPropagation && e.stopPropagation(), /* W3C */
				e.preventDefault && e.preventDefault(),
				false
			);
		}
	});
	
	Utils.Event.listen(input, ["focus", "focusin", "DOMFocusIn"], function(){
		t.inputFocused || (t.inputFocused = true, t.deferRedraw("focus"));
	});
	
	Utils.Event.listen(input, ["blur", "focusout", "DOMFocusOut"], function(){
		t.inputFocused && (t.inputFocused = false, t.deferRedraw("blur"));
	});

	/**
	 * we are interested in DOMAttrModified event only, which is 'supported' as
	 * onPropertyChange event in MSIE, which is not one of DOM Mutation Events.
	 * 
	 * TODO: "DOMSubtreeModified" is added for WebKit. Please, remove it when
	 * Chrome and Safari will support "DOMAttrModified".
	 */
	/*
	 * if((document.implementation.hasFeature("MutationEvents", "2.0") ||
	 * window.MutationEvent))
	 */{
		Utils.Event.listen(input, ["DOMAttrModified", "DOMSubtreeModified", "propertychange"], function(e){
			Inputs.String.prototype.domConfirmed || ((Inputs.String.prototype.domConfirmed = true) && t.debug("attached: dom confirmation passed"));
			t.deferRedraw("dom changes");
		});
		if(Inputs.String.prototype.domConfirmed){
			t.debug("attached: real select feedback method: DOM Mutation Events");
		}else{
			input.setAttribute("domConfirmation", "passed");
			t.debug("attached: real select feedback method: DOM Mutation Events, dom confirmation pending");
		}
	}
	
	target.onresize = function(){
		t.debug("contianer resized!");
	};
	if(!Inputs.String.prototype.domConfirmed){
		t.debug("attached: real select feedback method: timer polling");
		var timerPoller = function(){
			Inputs.String.prototype.domConfirmed || (t.deferRedraw("timer"), container.parentNode === target && setTimeout(timerPoller, 10000));
		};
		setTimeout(timerPoller, 10000);
	}
	/**
	 * public API
	 */
	input.redefine = function(properties){
		t.debug("redefine");
		t.redefine(properties);
	};
	// end of public API
	/**
	 * redraw?
	 */
	t.deferRedraw("initial");

	return input;
},
Inputs.String.prototype = {
	// instance properties
	/**
	 * field id
	 */
	id : null,
	
	// static properties
	domConfirmed : false,

	drop : function(){
		with(this) {
			var text = input.value;
			if(!dropped){
				// input.focus();
				// Utils.Event.fire(input, "focus");
				var modal = new Elements.ModalDiv(container, {
						screen	: "flee", // "ignore",
						cssStyle: "overflow: auto; overflow-x: hidden;",
						onSubmit: function(){
							prevValue = input.value;
							collapse();
							inputFocused = true;
							input.focus();
							Utils.Event.fire(input, "focus");
							deferRedraw("onSubmit - enter key when dropped");
						},
						onCancel: function(){
							prevValue = input.value = text;
							collapse();
							inputFocused = true;
							input.focus();
							Utils.Event.fire(input, "focus");
							deferRedraw("onCancel - escape key when dropped");
						}/*
							 * , focus : input
							 */
					}),
					busy = new Effects.Busy(modal.modal);
				dropped = {
					modal	: modal,
					text	: text,
					busy	: busy,
					select	: null
				};
				// fall-through
			}else //
			if(text !== dropped.text){
				dropped.text = text;
				dropped.busy && (dropped.busy.destroy(), dropped.busy = null);
				dropped.busy = new Effects.Busy(dropped.modal.modal);
				// fall-through
			}else{
				return;
			}
			redraw();
			setTimeout(function(){
				var contents = properties.suggestionsFn(text);
				if(!contents){
					debug("suggestionsFn returned no suggestions");
					collapse();
					return;
				}
				dropSuggestionsReady(text, {
					title	: "Suggestions selector box", 
					list	: contents
				});
			}, 10);
		}
	},
	
	dropSuggestionsReady : function(text, contents){
		with(this) if(dropped && dropped.text === text){
			dropped.select && (dropped.select.BoxSelect.destroy(), dropped.select = null);
			dropped.busy && (dropped.busy.destroy(), dropped.busy = null);
			dropped.enabled = contents && contents.list && (contents.list.length > 1 || contents.list.length == 1 && contents.list[0].value);
			dropped.select = new Inputs.BoxSelect(dropped.modal.modal, this.id + "--completion--", contents, { 
				multiple	: false,
				scroll		: dropped.modal.modal,
				cssClass	: "ui-none",
				onChange	: dropped.enabled && function(x){
					if(!inputFocused && x !== input.value){
						input.value = x;
						Utils.Event.fire(input, "change");
					}
				},
				onItemClick	: dropped.enabled && function(){
					prevValue = input.value;
					collapse();
					input.focus();
					Utils.Event.fire(input, "focus");
				},
				onKeyLoop	: dropped.enabled && function(){
					input.value = text;
					dropped.select.selectedIndex = 0;
					inputFocused = true;
					input.focus();
					Utils.Event.fire(dropped.select, "change");
					Utils.Event.fire(input, "focus");
					deferRedraw("key focus");
				},
				onKeyTab	: dropped.enabled && function(){
					prevValue = input.value;
					collapse();
					input.focus();
					Utils.Event.fire(input, "focus");
				},
				noHilight	: function(){
					return inputFocused;
				}
			});
			redraw();
		}
	},
	
	collapse : function(){
		var t = this, d = t.dropped;
		if(d){
			t.dropped = null;
			d.select && (d.select.BoxSelect.destroy(), d.select = null);
			d.busy && (d.busy.destroy(), d.busy = null);
			d.modal.close();
		}
	},
	
	deferRedraw : function(cause){
		var t = this;
		t.redrawRequested || (
			t.redrawRequested = true, 
			setTimeout(t.deferredRedraw, 25),
			t.debug(cause + ": " + t.input.value + ", redraw enqueued")
		);
	},
	
	redefine : function(properties){
		
	},
	
	redraw : function(){
		with(this){
			debug("redraw, value=" + input.value);
			var t;
			
			td1.innerHTML === (
				t = properties.icon ? '<img class="input-string-icon" src="'+properties.icon+'">' : ''
			) || (td1.innerHTML = t) ;
			
			td2.className === (
				t = properties.cssClass || ''
			) || (td2.className = t);
			
			td2.style.cssText === (
				t = properties.cssStyle || '' 
			) || (td2.style.cssText = t);
			
			// keyboard: x2328
			td3.innerHTML === (
				t = input.value ? "X" : '<img width="0" height="2" style="width:0;height:2px;">'
				// x2169 x2297 x2573 (pseudographic) x2612 x2613 __x2715__ x2716
				// x2717 x2718
			) || (td3.innerHTML = t);

			td3.className === (
				t = input.value ? "input-string-cross" : "input-string-nocross"
			) || (td3.className = t);
			
			table.className === (
				t = "input-string-item" + (inputFocused
						? "-active"
						: ""
// ? dropped
// ? ""
// : "-active"
// /**
// * not focused anymore!
// */
// : (true || dropped || collapse(), "")
					)
			) && input.className === t || (table.className = input.className = t);
				
			container.title === (
				t = properties.description || ''
			) || (container.title = t);
		}
	},
	
	debug : function(text){
		top.debug && top.debug( this.toString() + ": " + text );
	},
	
	toString : function(){
		return "Inputs.String" + (this.id ? "('"+this.id+"')" : "");
	},
	// just to enable comma on the upper string!
	undefined:undefined
},
/**
 * input - text string input to acquire, it will be moved in structure.
 * 
 * properties - optional properties for input to use, if whole 'properties'
 * argument is not specified or a single property is not specified it will be
 * taken from input attributes.
 * 
 * input attributes: 'icon' - for icon 'title' - for title 'value' - for value
 * 'class' - for cssClass 'style' - for cssStyle 'suggestionsFnName' - name of
 * suggestions function accessible through global scope and having exactly one
 * parameter for current field value which supposed to be used to generate
 * suggestions.
 */
Inputs.String.acquire = function(input, properties){
	var props = properties 
		? (function(){
			return arguments.callee.prototype 
				? this 
				: (arguments.callee.prototype = properties, new arguments.callee());
		})() 
		: {};
	props.icon || (props.icon = input.getAttribute("icon") || undefined);
	props.title || (props.title = input.getAttribute("title") || undefined);
	props.value || (props.value = input.getAttribute("value") || undefined);
	props.cssClass || (props.cssClass = input.getAttribute("class") || undefined);
	props.cssStyle || (props.cssStyle = input.getAttribute("style") || undefined);
	props.suggestionsFn || (props.suggestionsFn = ((props.suggestionsFn = input.getAttribute("suggestionsFnName"))
			? new Function("x", "return " + props.suggestionsFn + "(x);")
			: undefined));
	return new Inputs.String(input.parentNode, input, props);
},
// we still have to return a class we just defined, implemented and initialized
// 8-)
Inputs.String) // <%/FORMAT%>
