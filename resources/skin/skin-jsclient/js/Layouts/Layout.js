// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Layout || (parent.Layouts && (Layouts.Layout = parent.Layouts.Layout)) || (
	// v 1.1k
	//
	//	-= MyX =-
	//
	//	Generic class, shouldn't be instantiated in real life.
	//
	//	Layouts differ from Inserts and Effects in that Layouts represent blocks for bUI layout
	//	hierarchy tree. They allow layout management, layout serialization and de-serialization, 
	//	event passing and so on.
	//
	//
	//	var prototype = new Layouts.Layout();
	//
	//	var layout = new Layouts.Layout(document);
	//			Creates a generic object using (DOM Document provided) || (DOM Document Fragment facility)
	//			outer element will be created, 
	//			shape element will be the same as outer element.
	//			plane element will be the same as outer element.
	//			inner element will be the same as outer element.
	//
	//	var layout = new Layouts.Layout(document, definition);
	//			Creates layout according to given definition.
	//
	//	layout = {
	//		definition	: definition used to describe this component
	//		environment : environment for child elements of this component
	//		outer		: outer DOM element of this component, could be of any size, position and document
	//		shape		: shape DOM element of this component, outer size and document should reflected there
	//		plane		: plane DOM element of this component, client size and document for child elements should 
	//						be reflected there.
	//		inner		: inner DOM element of this component, current appendChild DOM method target.
	//		display		: function( true / false / undefined )
	//		rebuild		: function(sender)
	//						called to rebuild element's appearance to conform with
	//						new definition.
	//						'null' value should force rebuild (skip changes checks).
	//		resize		: function(sender)
	//						called when child element resized from bottom
	//		destroy		: function()
	//		attachTo	: function(target)
	//						where target is HTML DOM Element or Control.Container
	//						returns self
	//		redefine	: function(definitionToOverride)
	//
	//		pushElement	: function( element / panel,	// element to add
	//									resetDisplay	// resets style.display for element
	//								), returns this panel
	//
	//		toString	: function()
	//						returns string representation of this component
	//
	//		setOuterElement	: function(element)
	//		setShapeElement	: function(element)
	//		setPlaneElement	: function(element)
	//		setBusy			: function()
	//		setReady		: function()
	//		startTransition	: function(transitionName, callback)
	//
	//		putAll	: function(object)
	//							puts all listable properties of given object to this component properties
	//								overriding any local values.
	//
	//		getZoom				: function()
	//								returns zoom in which this component should represent itself
	//
	//		getComponents		: function()
	//								returns all components in the hierarchy of this component
	//		getParentComponent	: function()
	//								returns parent component, if any
	//		getContextParameter	: function(key)
	//								returns current context's parameter
	//
	//
	//
	//		setContent		: function( content )
	//							If this.isComponentContainer calls Layouts.Container.setContent.
	//							Fails otherwise.
	//
	//		pushLayout	: function(definition)
	//							If this.isComponentContainer calls Layouts.Container.pushLayout.
	//							Fails otherwise.
	//
	//	}
	//
	//
	//	definition : {
	//		mode		: view || browse || edit
	//		zoom		: zoom is one of:
	//						//	"undefined"	- compact in both directions, display:inline
	//							"compact"	- compact in both directions, display:inline-block
	//							"wide"		- full content width, display:block
	//						//	"tall"		- full content height, display:block
	//							"document"	- full content size, both width and height
	//							"row"		- full container width, display:block
	//							"column"	- full container height, display:block
	//							"screen"	- full container size, both width and height
	//		cssClass	: inside panel CSS class name(s),
	//		cssStyle	: inside panel CSS in-line style,
	//		comment		: debug comment
	//
	//
	//		onAfterCreate	: string or function()
	//							called after layout initially created, before connecting it to parent element
	//
	//		onAfterAttach	: string or function(target)
	//							called every time layout being attached to a parent component
	//
	//		onAfterBuild	: string or function()
	//							called every time layout builds. this happens only when element is visible
	//							'this' value will, of course, reference definition.
	//
	//		onAfterDestroy	: string or function()
	//							called after component was destroyed
	//
	//		onClick			: string or function()
	//							called after component was clicked
	//	}
	//
	//
	//
	//	component zoom will be calculated as: definition.zoom || containerEnvironment.zoom || defaultDefinition.zoom
	//		where containerEnvironment is the environment of container component, if any
	//
	//	CSS selector prefix: ui-
	//
	//
	//	Q: Why this class is so big, why not to split it?
	//	A: Anyway it's very close to the smallest base that you have to load to start building
	//		actual interface using this bUI library.
	//
	//	Q: But still, could such complexity make simplest elements very complicated for browsers?
	//	A: For simple elements it provides simple HTML DOM structures. For complicated elements
	//		it provides powerful and effective way to deal with demands.
	//

Layouts.Layout = function(target, def, environment){
	if(!arguments.length){
		return this;
	}
	top.debug && top.debug("Layouts.Layout: create: target=" + target + ", def = " + Layouts.formatObject(def));

	typeof def == "string" && (def = {layout : "string", value : def });
	typeof def == "number" && (def = {layout : "number", value : def });
	typeof def == "boolean" && (def = {layout : "boolean", value : def });
	var layout = (def || this.defaultDefinition).layout || null;
	if(!layout){
		null("Default layout constructor called with incomplete layout definition (no 'layout' field)!");
	}
	var layoutClass = Layouts.Layout._tagNameToClassName(layout);
	var LayoutClass = Layouts[layoutClass] || require ? require("Layouts." + layoutClass) : alert("Missing required javascript: Layouts/" + layoutClass + ".js");
	if(LayoutClass && LayoutClass !== Layouts.Dummy){
		return new LayoutClass(target, def, environment);
	}
	top.debug && top.debug("Layouts.Layout: layout class (" + layoutClass + ") is unknown - creating default container");
	var Container = require("Layouts.Container"),
		LayoutClass = function(target, def, layout){
			return Container.apply(this, arguments) || this;
		};
	LayoutClass.prototype = Container.prototype;
	Layouts[layoutClass] = LayoutClass;
	return new LayoutClass(target, def, layout);
},
Layouts.Layout.prototype = {
	setContent : function(component){
		if(!this.isComponentContainer){
			throw "not a container - setContent method unavailable!";
		}
		return require("Layouts.Container").prototype.setContent.call(this, component);
	},
	pushLayout : function(definition){
		if(!this.isComponentContainer){
			throw "not a container - pushLayout method unavailable!";
		}
		return require("Layouts.Container").prototype.pushLayout.call(this, definition);
	},
	attachTo : function(target){
		with(this){
			this.previousParentNode = outer.parentNode;
			target == null
				? outer.parentNode && outer.parentNode.removeChild(outer)
				: target.isComponentContainer
					? target.setContent(this)
					: target.isComponentSequence
						? target.addElement(this)
						: target.isComponentGeneric
							? null("Layouts.Layout.attachTo: invalid component passed as a target!")
							: target.appendChild
								? outer.parentNode == target || (
									this._checkPrepareDocument(target.ownerDocument), 
									target.appendChild(outer),
									rebuild(target.component || true),
									onAfterAttach && onAfterAttach(target) 
								)
								: null("Layouts.Layout.attachTo: only HTML DOM Elements and Control.Containers allowed as a target!");
		}
		return this;
	},
	rebuild : function(sender){
		with(this){
			top.debug && top.debug("Layouts.Layout: rebuild, this=" + this.layout + ", sender=" + (sender && sender.layout));
			var update = false;
			{
				var prev = zoom;
				zoom = getZoom();
				if(!zoom){
					top.debug && top.debug("Layouts.Layout: rebuild: no zoom defined, skip rebuild");
					return;
				}
				if(zoom != prev){
					top.debug && top.debug("Layouts.Layout: rebuild: zoom=" + zoom + ", prev=" + prev);
					zoom();
					update = true;
				}
			}
			{
				var prevCssClass = cssClass;
				var prevCssPrefix = cssPrefix;
				var prevCssStyle = cssStyle;
				cssClass = definition.cssClass || defaultDefinition.cssClass;
				cssStyle = definition.cssStyle || defaultDefinition.cssStyle;
				cssPrefix = cssClassPrefix;
				if(prevCssPrefix != cssPrefix || prevCssClass != cssClass || prevCssStyle != cssStyle){
					top.debug && top.debug("Layouts.Layout: rebuild: css changed");
					plane.className = (cssPrefix ? cssPrefix + " " : "") + (cssClass ? cssClass + " " : "") + plane.classSuffix;
					/**
					 * Attachment layout writes to style, so 'plane.style.cssText' is required here
					 */
					plane.style.cssText = cssStyle || plane.style.cssText || "";
					update = true;
				}
				if(!plane.className){
					plane.className = (cssPrefix ? cssPrefix + " " : "") + plane.classSuffix;
					update = true;
				}
			}
			shape.title = definition.title || definition.comment || "";
			
			canvas = content ? content.canvas : inner;
			content && content.outer.parentNode != inner && (
				inner.appendChild(content.outer),
				update = true
			);
			
			var fn = function(obj, key){
				(obj[key] && !obj[key].def) || (
					obj[key] = definition[key] 
						? typeof definition[key] == "function" 
							? definition[key] 
							: new Function(definition[key])
						: null,
					obj[key] && (obj[key].def = true)
				);
			};
			
			fn(this, "onAfterAttach");
			fn(this, "onAfterBuild");
			fn(this, "onAfterDestroy");
			fn(this, "onClick");

			outer.onclick = onClick
								? function(e){
									onClick();
								}
								: null;
			
			update && content && sender != content && content.rebuild(this);
			
			this.onAfterRebuild && this.onAfterRebuild(sender) && (update = true);
			update |= previousParentNode && outer.parentNode && outer.parentNode != previousParentNode;

			if(update){
				previousParentNode = null;
				var parent = getParentComponent();
				parent && sender != parent && parent.rebuild(this);
				
				onAfterBuild && onAfterBuild();
			}
		}
	},
	click : function(){
		var btn = this;
		btn.onClick && (require("Effects.Effect")
			? (
				btn.busy = (btn.busy || 0) + 2,
				Effects.Blink(
					function(){
						btn.button.className = btn.button.active ? "ui-button-self-inactive" : "ui-button-self-active";
					},
					function(){
						btn.button.className = btn.button.active ? "ui-button-self-active" : "ui-button-self-inactive";
					}, 
					function(){
						btn.onClick();
						btn.busy--;
					}, 
					function(){
						btn.busy--;
						btn.button.className = btn.active ? "ui-button-self-active" : "ui-button-self";
					}
				)
			)
			: btn.onClick());
	},
	attachNorth : function(def){
		with(this){
			return pushLayout(extend(def,{
				side	: "north"
			},{
				layout	: "attachment"
			})).attachment;
		}
	},
	attachSouth : function(def){
		with(this){
			return pushLayout(extend(def,{
				side	: "south"
			},{
				layout	: "attachment"
			})).attachment;
		}
	},
	attachEast : function(def){
		with(this){
			return pushLayout(extend(def,{
				side	: "east"
			},{
				layout	: "attachment"
			})).attachment;
		}
	},
	attachWest : function(def){
		with(this){
			return pushLayout(extend(def,{
				side	: "west"
			},{
				layout	: "attachment"
			})).attachment;
		}
	},
	redefine : function(def){
		with(this){
			if(def) for(var i in def){
				definition[i] = def[i];
			}
			rebuild(this);
		}
	},
	setClassName : function(name){
		with(this){
			cssClass = definition.cssClass || defaultDefinition.cssClass;
			cssClassPrefix = name;
			top.debug && top.debug("Layouts.Layout: setClassName: name=" + name);
			plane.className = (name ? name + " " : "") + (cssClass ? cssClass + " " : "") + plane.classSuffix;
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////////////
	// zoom functions:
	//		all take shape element (could be == outer) to insert instead of.
	//		all return new shape element (to which you have to apply decorations).
	zoom_screen : function(){ 
		// full container size: screens
		var pushDiv = Layouts.Layout.pushDiv;
		with(this){
			outer.className = "ui-zoom-screen";
			shape = pushDiv(outer, "size-shape");
			shape.className = "ui-" + layout + "-shape-screen";
			shape.component = this;
			plane = pushDiv(shape, "size-height");
			plane.component = this;
			plane.classSuffix = "ui-" + layout;
			inner = pushDiv(plane, "size-inner");
			inner.className = "ui-" + layout + "-inner-screen";
			inner.component = this;
		}
	},
	zoom_column : function(){ 
		// full container size: screens
		var pushDiv = Layouts.Layout.pushDiv;
		with(this){
			outer.className = "ui-zoom-column";
			shape = pushDiv(outer, "size-shape");
			shape.className = "ui-" + layout + "-shape-column";
			shape.component = this;
			plane = pushDiv(shape, "size-height");
			plane.className = "ui-" + layout + "-height-column";
			plane.component = this;
			plane.classSuffix = "ui-" + layout;
			inner = pushDiv(plane, "size-inner");
			inner.className = "ui-" + layout + "-inner-column";
			inner.component = this;
		}
	},
	zoom_row : function(){ 
		// full container width, compact height: menu items
		with(this){
			shape = outer;
			plane = outer;
			plane.classSuffix = "ui-" + layout + " ui-zoom-row";
			inner = outer;
		}
	},
	zoom_document : function(){ 
		// full content size: documents
		with(this){
			shape = outer;
			plane = outer;
			plane.classSuffix = "ui-" + layout + " ui-zoom-document";
			inner = outer;
		}
	},
	zoom_wide : function(){ 
		// wide content size: top menu items, tabs
		with(this){
			shape = outer;
			plane = outer;
			plane.classSuffix = "ui-" + layout + " ui-zoom-wide";
			inner = outer;
		}
	},
	zoom_compact : function(){ 
		// compact in both directions: toolbar buttons
		with(this){
			shape = outer;
			plane = outer;
			plane.classSuffix = "ui-" + layout + " ui-zoom-compact";
			inner = outer;
		}
	},
	zoom_undefined : function(){ 
		// no action
	},
	/////////////////////////////////////////////////////////////////////////////////////////
	
	// private fields
	busy				: null,
	content				: null,
	zoom				: null,
	cssClass			: null,
	cssStyle			: null,
	isComponentGeneric	: true,
	isComponentTerminal	: undefined,
	isComponentContainer: undefined,
	isComponentSequence	: undefined,
	onAfterCreate		: null,
	onAfterBuild		: null,
	onAfterAttach		: null,
	onAfterDestroy		: null,
	onClick				: null,
	
	previousParentNode	: null,
	
	effects 			: {
		padding : {
			create : function(panel){
				return new Layouts.Layout(null, {
					layout	: "container",
					zoom	: "all", 
					cssClass: "ui-ef-padding"
				}).attachTo(panel).canvas;
			},
			toString :function(){
				return "padding";
			}
		},
		inset : {
			create : function(panel){
				return new Layouts.Layout(null, {
					layout	: "container",
					zoom	: "all", 
					cssClass: "ui-ef-inset"
				}).attachTo(panel).canvas;
			},
			toString :function(){
				return "inset";
			}
		},
		outset : {
			create : function(panel){
				return new Layouts.Layout(null, {
					layout	: "container",
					zoom	: "all", 
					cssClass: "ui-ef-outset"
				}).attachTo(panel).canvas;
			},
			toString :function(){
				return "outset";
			}
		},
		scroll : {
			create : function(panel){
				panel = Layouts.Layout.pushDiv(panel, "p2m");
				panel.style.overflow = "auto";
				return panel;
			}
		}
	},
	
	// defaults
	defaultDefinition	: {
	},
	defaultEnvironment	: {
	},
	
	// methods
	display : function(){
		top.debug && top.debug("generic display");
	},
	destroy : function(){
		with(this){
			top.debug && top.debug("generic destroy: outer=" + outer);
			outer && (outer.parentNode && outer.parentNode.removeChild(outer), outer = outer.component = null);
			shape && (shape = shape.component = null);
			plane && (plane = plane.component = null);
			onAfterDestroy && onAfterDestroy();
		}
	},
	resize : function(sender){
		with(this){
			if(size == "undefined"){
				var parent = getParentComponent();
				parent && parent.resize();
			}
		}
	},
	pushElement : function( _element, _resetDisplay ){
		with(this){
			var eouter = _element.component ? _element.component.outer : _element
			var einner = _element.component ? _element.component.canvas : null;
			einner 
				? einner.appendChild(canvas.parentNode.replaceChild(eouter, canvas))
				: canvas.appendChild(eouter);
			_resetDisplay && (eouter.style.display = "");
			//invalidate(this);
			return this;
		}
	},
	toString : function(){
		with(this){
			return Layouts.formatObject(definition);
		}
	},
	setOuterElement : function(outerElement){
		outerElement || null("Layouts.Layout.setOuterElement: new element is not specified!"); // this way we have stack trace
		outerElement.component && null("Layouts.Layout.setOuterElement: outer element is already taken by a component, outer=" + outer); // this way we have stack trace
		with(this){
			outer && (outer.component = null);
			outer = outerElement;
			outer.component = this;
		}
	},
	setShapeElement : function(shapeElement){
		shapeElement || null("Layouts.Layout.setShapeElement: new element is not specified!"); // this way we have stack trace
		shapeElement.component && null("Layouts.Layout.setShapeElement: outer element is already taken by a component, outer=" + outer); // this way we have stack trace
		with(this){
			shape && (shape.component = null);
			shape = shapeElement;
			shape.component = this;
		}
	},
	setPlaneElement : function(planeElement){
		planeElement || null("Layouts.Layout.setPlaneElement: new element is not specified!"); // this way we have stack trace
		planeElement.component && null("Layouts.Layout.setPlaneElement: outer element is already taken by a component, outer=" + outer); // this way we have stack trace
		with(this){
			plane && (plane.component = null);
			plane = planeElement;
			plane.component = this;
		}
	},
	setBusy : function(){
		with(this){
			busy ? busy.update() : (busy = new (require("Effects.Busy"))(plane));
		}
	},
	setReady : function(){
		with(this){
			busy && (busy.destroy(), busy = null);
		}
	},
	startTransition : function(name, callback){
		with(this){
			new (require("Effects.Transition"))(name, zoom == zoom_screen
														? outer
														: shape, callback);
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////
	setupRegisterCss : function(document, source){
		var style = document.createElement("style");
		style.setAttribute("type", "text/css");
		style.setAttribute("layout", this.layout);
		style.styleSheet
			? style.styleSheet.cssText = source
			: style.appendChild(document.createTextNode(source));
		((document.documentElement || document).firstElementChild || (document.documentElement || document).firstChild || document).appendChild(style);
	},
	setupDocument : function(document){
		var source =
			".ui-zoom-compact{"+
				"display:inline-block;"+
				"position:relative;"+
			"}"+ 
			".ui-zoom-row{"+
				"display:block;"+
				"position:relative;"+
			"}"+ 
			".ui-zoom-wide{"+
				"display:inline-block;"+
				"position:relative;"+
			"}"+ 
			".ui-zoom-document{"+
				"display:block;"+
				"position:relative;"+
			"}"+ 
			".ui-zoom-column,.ui-zoom-screen, size-shape, size-height, size-inner{"+
				"display:block;"+
				"height:100%;"+
				"table-layout:fixed;"+
				"vertical-align:top;"+
			"}"+
			".ui-zoom-column,.ui-zoom-screen, size-height, size-inner{"+
				"position:relative;"+
			"}"+
			".ui-zoom-column{"+
//				"float:left;"+
				"border:solid 2px red;"+
			"}"+
			"size-shape{"+
				"position:absolute;"+
				"width:100%;"+
			"}"+
			"size-shape, size-height{"+
				"overflow:hidden;"+
			"}"+
			"size-height{"+
				"box-sizing:border-box;"+
			"}"+
			"";
		this.setupRegisterCss(document, source);

		var window = document.defaultView || document.parentWindow;

		var boxes = {
			queued	: false,
			list	: document.getElementsByTagName("size-height"),
			fix		: function(){
				with(boxes){
					queued = false;
					// top.debug && top.debug("Layouts.Layout: zoom all || column document maintenance: elementSizeHeightCount=" + list.length);
					for(var i = 0; i < list.length; ++i){
						var size = list.item(i);
						with(size){
							// this.firstChild.offsetHeight  works  this.clientHeight  doesn't (with padding)
							// top.debug && top.debug("Layouts.Layout zoom all || column document maintenance: i=" + i + ", pc=" + parentNode.clientHeight + ", oh=" + offsetHeight + ", ch=" + clientHeight + ", co=" + firstChild.offsetHeight);
							if(parentNode.clientHeight != offsetHeight){
								var height = Math.max(0, parentNode.clientHeight - (offsetHeight - firstChild.offsetHeight));
								style.height = height + "px";
							}
						}
					}
				}
			},
			enqueue	: function(){
				boxes.queued || (boxes.queued = setTimeout(function(){
					boxes.fix();
				}, 50))
			},
			resize	: require("Utils.Event").listen(window, "resize", function(){
				boxes.enqueue();
			}),
			load	: require("Utils.Event").listen(window, "load", function(){
				boxes.enqueue();
			}),
			task	: window.setInterval(function(){
				boxes.enqueue();
			}, 5000)
		};
		return boxes;
	},
	/////////////////////////////////////////////////////////////////////////////////////////
	putAll : function(values){
		for(var i in values){
			this[i] = values[i];
		}
		return this;
	},
	extend : function(prototype, defaultValues, overrideValues){
		var f = function(){};
		f.prototype = prototype || {};
		var result = new f();
		if(defaultValues) for(var i in defaultValues){
			result[i] !== undefined || (result[i] = defaultValues[i]);
		}
		if(overrideValues) for(var i in overrideValues){
			result[i] = overrideValues[i];
		}
		return result;
	},
	/////////////////////////////////////////////////////////////////////////////////////////
	wrapElement : function(element){
		return new Layouts.ElementWrapper(element);
	},
	getComponents : function(){
		var list = this.outer.getElementsByTagName("ui-generic"), result = [];
		for(var i = 0; i < list.length; i ++){
			result.push(list[i].component);
		}
		return result;
	},
	getParentComponent : function(){
		for(var i = this.outer; i = i.parentNode;){
//			if(i.nodeName == "ui-generic" && i.component){
			if(i.component && i.component.isComponentGeneric){
				return i.component;
			}
		}
	},
	getContextParameter : function(key){
		for(component = this; component = component.getParentComponent();){
			var environment = component.environment;
			var value = environment && environment[key];
			if(value){
				return value;
			}
		}
		return undefined;
	},
	getZoom : function(){
		with(this){
			return Layouts.Layout.prototype["zoom_" + (definition.zoom || getContextParameter("zoom") || "")];
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////
	init1_target : function(target, definition, layout){
		this.document = (target && (target.ownerDocument || (target.createElement && target) || (target.canvas && target.canvas.ownerDocument))) || window.document;
		this.definition = definition || this.defaultDefinition;
		this.environment || (this.environment = definition.environment);
		this.parent = target && ((target.nodeType && target.nodeType == 1) || target.isComponentGeneric) && target;
		this.layout = layout;
		this.parent && this._checkPrepareDocument(this.document);
		this.busy = this.content = this.cssClassPrefix = this.cssPrefix = this.cssClass = this.cssStyle = this.zoom = this.shape = this.plane = this.inner = this.canvas = null; // instance local variables
		this.outer = this.document.createElement("ui-" + layout);
		this.outer.component = this;
	},
	init2_layers : function(shape, plane, inner){
		shape && shape.component && null("Layouts.Layout: shape element is already taken by a component, shape=" + shape); // this way we have stack trace in opera9
		plane && plane.component && null("Layouts.Layout: plane element is already taken by a component, plane=" + plane); // this way we have stack trace in opera9
		inner && inner.component && null("Layouts.Layout: inner element is already taken by a component, inner=" + inner); // this way we have stack trace in opera9
		this.shape = shape || this.outer;
		this.plane = plane || this.shape;
		this.inner = inner || this.plane;
		this.canvas = this.inner;
		this.plane.component = this.shape.component = this.outer.component = this.inner.component = this;
	},
	init3_finish : function(){
		with(this){
			Layouts.styleObject || Layouts.setTheme(Layouts.styleName); // init theme if was not initialized yet!
			onAfterCreate || (this.onAfterCreate = definition.onAfterCreate 
														? typeof definition.onAfterCreate == "function" 
															? definition.onAfterCreate 
															: new Function(definition.onAfterCreate)
														: null);
			onAfterCreate && onAfterCreate();
			parent && attachTo(parent);
			if(isComponentSequence){
				if(definition.elements) for(var i in definition.elements){
					addElement(definition.elements[i]);
				}
			}else{
				isComponentContainer && definition.content && pushLayout(definition.content);
			}
			
		}
	},
	_checkPrepareDocument : function(document){
		document.layoutsWereHere || (
				document.layoutsWereHere = {},
				// default Layouts.Layout have to be initialized anyway
				Layouts.Layout.prototype._checkPrepareDocument(document));
		if(document.layoutsWereHere[this.setupDocument]){
			return document.layoutsWereHere[this.setupDocument];
		}
		return document.layoutsWereHere[this.setupDocument] = this.setupDocument(document) || true;
	}
},
Layouts.formatObject = function(object, level, limit){
	if(object === null || object === undefined || typeof object == "boolean" || typeof object == "number"){
		return object;
	}
	if(typeof object == "string"){
		return '"' + object.replace('"', '\"') + '"';
	}
	level || (level = 0);
	if(limit === 0){
		return "...";
	}
	limit || (limit = 3);
	var array = Array.isArray(object);
	var text = array ? "[" : "{";
	for(var i in object){
		/**
		 * i==0 cause !i doesn't work (kind of it is not a numeric 0 in the first array element)
		 */
		(array ? i==0 : (text == "{")) || (text += ",")
		text += "\n";
		for(var j = level; j >= 0; j --){
			text += "\t";
		}
		text += (array ? "" : i + "\t: ") + Layouts.formatObject(object[i], level + 1, limit - 1);
	}
	text += "\n";
	for(var j = level; j > 0; j --){
		text += "\t";
	}
	return text + (array ? "]" : "}");
},
Layouts.Layout.prototype.zoom_screen.toString = function(){
	return "screen";
},
Layouts.Layout.prototype.zoom_column.toString = function(){
	return "column";
},
Layouts.Layout.prototype.zoom_row.toString = function(){
	return "row";
},
Layouts.Layout.prototype.zoom_document.toString = function(){
	return "document";
},
Layouts.Layout.prototype.zoom_wide.toString = function(){
	return "wide";
},
Layouts.Layout.prototype.zoom_compact.toString = function(){
	return "compact";
},
Layouts.Layout.prototype.zoom_undefined.toString = function(){
	return "undefined";
},
// returns new element added to target element
Layouts.Layout.pushDiv = function(target, name){
	return target.appendChild(target.ownerDocument.createElement(name));
},
Layouts.Layout._domPath = function(node){
	var path = "/";
	for(;node = node.parentNode;){
		path = "/" + node.nodeName + path;
	}
	return path;
},
Layouts.Layout._tagNameToClassName = function(name){
	var path = "";
	for(var i in (name = name.split('-'))){
		for(var j in (i = name[i].split('_'))){
			path += i[j].substr(0,1).toUpperCase() + i[j].substr(1);
		}
	}
	return path;
},
Layouts.ElementWrapper = function(element){
	this.outer = element;
	this.init2_layers();
},
Layouts.ElementWrapper.prototype = new Layouts.Layout(),
Layouts.ElementWrapper.prototype.putAll({
	rebuild : function(){
	}
}),
Layouts.Dummy = function(target, def){
	with(this){
		var layout = (def && def.layout) || "dummy";
		init1_target(target, def, layout);
		init2_layers();
		this.isComponentContainer = true;
		this.environment = definition;
		init3_finish();
	}
},
Layouts.Dummy.prototype = new Layouts.Layout(),
Layouts.Dummy.prototype.putAll({
}),
Layouts['Padding'] = Layouts.Dummy,
Layouts['Inset'] = Layouts.Dummy,
Layouts['Language'] = Layouts.Dummy,
Layouts['Spacer'] = Layouts.Dummy,
Layouts.setTheme = function(name, persistent){
	top.debug && top.debug("Layouts.setTheme: name=" + name + ", persistent=" + (persistent || false));
	persistent && require("Utils.Cookies").create("lathm", name, 3650);
	require.style("bui/theme/" + (Layouts.styleName = name) + ".css", function(x){
		Layouts.styleObject && Layouts.styleObject.destroy();
		Layouts.styleObject = x;
	});
},
Layouts.styleName = (window.require && require("Utils.Cookies").read("lathm", "default")) || "default",
/**
 * <standard>
 */
window.isArray || (isArray = function(testObject) {
	return testObject && !(testObject.propertyIsEnumerable('length')) && (typeof testObject === 'object') && (typeof testObject.length === 'number');
}),
/**
 * </standard>
 */
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Layout) // <%/FORMAT%>