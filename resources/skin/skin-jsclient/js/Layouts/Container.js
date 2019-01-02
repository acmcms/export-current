// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Container || (parent.Layouts && (Layouts.Container = parent.Layouts.Container)) || (
	// v 0.1a
	//
	//	-= MyX =-
	//
	//	Generic class, shouldn't be instantiated in real life.
	//
	//
	//	Usage:
	//		var prototype = new Layouts.Container();
	//
	//		var container = new Layouts.Container( document );
	//		var container = new Layouts.Container( document, definition );
	//		var container = new Layouts.Container( document, definition, layout );
	//		var container = new Layouts.Container( document, definition, outerElement, planeElement, innerElement );
	//
	//	Glossary:
	//		element		- HTML DOM Element
	//		component	- Layouts.Layout instance of any kind
	//
	//	container : extends Layouts.Layout {
	//
	//		setContent		: function( content )
	//							Where content is element or component.
	//							Replaces all container's content with given one.
	//							Returns new 'canvas' value or undefined (when added component was terminal component)
	//
	//		pushLayout		: function( definition )
	//							Where definition is a full (non-primitive) layout definition or container layout name.
	//							Inserts component created based on given definition into topmost container component.
	//							Returns new 'canvas' value
	//
	//		canvas			: inner DOM element of this component, children should be added there.
	//
	//	}
	//
	//
	//	definition : {
	//		zoom		: see Layout definition
	//		cssClass	: inside panel CSS class name(s),
	//		cssStyle	: inside panel CSS in-line style,
	//		comment		: debug comment
	//	}
	//
	//

Layouts.Container = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(
			target, 
			extend(def, null, environment), 
			arguments.length == 3 && arguments[2] || "container"
		);
		init2_layers();
		init3_finish();
	}
},
Layouts.Container.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Container.prototype.putAll({
	isComponentTerminal	: false,
	isComponentContainer: true,
	isComponentSequence	: false,
	environment			: { 
	},
	setContent : function(component){
		with(this){
			if(!canvas){
				// not by spec! should destroy content (will not be usable by pushLayout)
				throw "Container already have terminal component - setContent method unavailable!";
			}
			if(content && content.isComponentContainer){
				// not by spec! should destroy content (will not be usable by pushLayout)
				content.setContent(component);
				return canvas = content.canvas;
			}
			// not by spec! should use inner (will not be usable by pushLayout)
			var buffer = canvas.childNodes.length && canvas.ownerDocument.createElement("buffer");
			buffer && (
				buffer.style.display = "none",
				canvas.appendChild(buffer)
			);
			(buffer || canvas).appendChild(component.outer);
			component.rebuild(this);
			buffer && (
				canvas.appendChild(component.outer),
				buffer.parentNode.removeChild(buffer)
			);
			content = component;
			content.onAfterAttach && content.onAfterAttach(this);
			return canvas = content.isComponentTerminal === true ? undefined : content.canvas;
		}
	},
	pushLayout : function(definition){
		/**
		 * Check for array
		 */
		if(Array.isArray(definition)){
			var result;
			for(var i in definition){
				definition[i] && (result = this.pushLayout( definition[i] ));
			}
			return result;
		}
		/**
		 * Check for layout name
		 */
		if(typeof definition === 'string'){
			return this.pushLayout( {
				layout	: definition
			} );
		}
		/**
		 * 
		 */
		for(var component = null; component = component ? component.getParentComponent() : this;){
			if(component.isComponentContainer || component.isComponentSequence){
				return new Layouts.Layout(component, definition);
			}
		}
		throw "Cannot push layout: no groups or containers available in upper hierarchy!";
	},
	setupDocument : function(document){
		var source = 
			"ui-container{display:inline-block}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Container) // <%/FORMAT%>