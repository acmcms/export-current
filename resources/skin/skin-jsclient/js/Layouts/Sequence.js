// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Sequence || (parent.Layouts && (Layouts.Sequence = parent.Layouts.Sequence)) || (
	// v 0.3b
	//
	//	-= MyX =-
	//
	//	Generic class, shouldn't be instantiated in real life.
	//
	//
	//	Usage:
	//		var sequence = new Layouts.Sequence( parent, definition );
	//
	//	sequence : extends Layouts.Layout {
	//		addElement	: function(definition)
	//							Returns created element.
	//		
	//		definition	: definition used to describe this sequence
	//		elements	: array of sequence elements
	//		invalidate	: function(sender)
	//							requests sequence to reflect new changes in definition.
	//	}
	//
	//	definition : {
	//		elements: [elementDefinition, ...]
	//	}
	
Layouts.Sequence = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null, (def && def.environment
					? extend(def.environment, environment)
					: environment)), "sequence");
		init2_layers();
		init3_finish();
	}
},
Layouts.Sequence.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Sequence.prototype.putAll({
	isComponentTerminal	: undefined,
	isComponentContainer: false,
	isComponentSequence	: true,
	clean				: false,
	definition			: null, // elements
	elements			: null, // elements
	prevElements		: null, // elements
	environment			: {
		zoom : "wide",
		item : "div"
	},
	onAfterRebuild : function(sender){
		with(this) if(!clean){
			if(!clean && sender && sender.outer && sender.outer.parentNode && sender.outer.parentNode.component == this){
				return;
			}
			setClassName(zoom == zoom_screen || zoom == zoom_document
							? "ui-sequence-full"
							: zoom == zoom_row || zoom == zoom_wide
								? "ui-sequence-wide"
								: null);
			var signature = {}, newElements = [];
			for(var i in elements){
				var e = elements[i];
				e.container || (
					e.layout.attachTo(e.container = createNext()),
					connectNext(e.container)
				);
				e.signature = signature;
				newElements.push(e);
			}
			prevElements || (this.prevElements = []);
			if(prevElements) for(var i in prevElements){
				var e = prevElements[i];
				e.signature !== signature && e.container && (e.container.destroy 
																? e.container.destroy() 
																: e.container.parentNode.removeChild(e.container));
			}
			this.prevElements = elements;
			this.elements = newElements;
			return this.clean = true;
		}
	},
	connectNext : function(element){
		with(this){
			return inner.appendChild(element);
		}
	},
	createNext : function(){
		with(this){
			var target = inner.ownerDocument.createElement(definition.item || "div");
			var itemStyle = definition.itemStyle || environment.itemStyle || getContextParameter("itemStyle");
			var itemClass = definition.itemClass || environment.itemClass || getContextParameter("itemClass");
			itemStyle && (target.style.cssText = itemStyle);
			itemClass && (target.className = itemClass);
			target.component = this;
			return target;
		} 
	},
	invalidate : function(sender){
		// wtf - there is no target defined!
		this.target.invalidate && this.target.invalidate();
	},
	addElement : function(def){
		if(def !== undefined) with(this){
			var element = def.isComponentGeneric
				? {
					definition	: def.definition,
					layout		: def
				}
				: {
					definition	: def, 
					layout		: new Layouts.Layout(outer.ownerDocument, def)
				};
			(elements || (this.elements = [])).push(element);
			this.clean = false;
			rebuild(element.layout);
			return element;
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-sequence{"+
				"display:block;"+
				"vertical-align:top;"+
			"}"+
			".ui-sequence-wide{"+
				"width:100%;"+
			"}"+
			".ui-sequence-full{"+
				"width:100%;"+
				"height:100%;"+
				"overflow:auto;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Sequence) // <%/FORMAT%>