// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Tabble || (parent.Layouts && (Layouts.Tabble = parent.Layouts.Tabble)) || (
	// v 0.0g
	//
	//	-= MyX =-
	//
	//	Tabble is a simple layout, whose idea is to take whole available space 
	//	as a tabbedPanel for its contents.
	//
	//
	//	Usage:
	//		var tabble = new Layouts.Tabble( target, definition );
	//						where target is an HTML Document, an HTML DOM Element or null.
	//						in case of null target value layout will not be attached to an
	//						HTML DOM Tree and you should call .attachTo method explicitly.
	//
	//	tabble : extends Layouts.Layout {
	//	}
	//
	//	definition : {
	//		environment	: envoronment definition
	//		content		: full layout definition to build contents inline
	//	}

Layouts.Tabble = function(target, def){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null, (def && def.environment
													? extend(def.environment, environment)
													: environment)), "tabble");

		this.attachment = new Layouts.Layout(document, {
			layout		: "attachment",
			side		: "south",
			spacing		: false,
			//display		: false,
			attachment	: {
				layout	: "toolbar",
				cssClass: "ui-tabbar",
				environment:{
					zoom : "wide"
				},
				elements: [{
					layout	: "string",
					title	: "",
					value	: "",
					cssClass: "ui-tabbar-left"
				}]
			},
			content		: {
				layout	: "interactive",
				cssClass: "ui-active",
				content	: {
					layout	: "interactive",
					cssClass: "ui-window"
				}
			}
		});
					
		init2_layers();

		this.content = attachment;

		init3_finish();

		var contentDefinition = definition.content;
		contentDefinition && pushLayout(contentDefinition);
	}
},
Layouts.Tabble.prototype = new ((window.Layouts && (Layouts.Sequence || (window.require && require("Layouts.Sequence")))) || function(){})(),
Layouts.Tabble.prototype.putAll({
	isComponentTabble	: true,
	attachment			: null,
	environment			: { 
		zoom	: "screen"
	},
	elements			: null, // elements
	activeIndex			: -1,
	onAfterRebuild : function(sender){
		with(this){
			attachment.attachTo(inner);
		}
	},
	open : function(index){
		with(this){
			if(index == activeIndex){
				return;
			}
			this.content.content.redefine({
				cssClass	: "ui-active"
			});
			if(activeIndex != -1){
				with(elements[activeIndex]){
					tab.setNormal();
					layout.startTransition("disappear", function(){
						layout.attachTo(null);
					});
				}
			}
			with(elements[index]){
				tab.setActive();
				layout.outer.display = "none";
				layout.attachTo(content.content);
				layout.startTransition("appear", function(){
					layout.outer.display = "";
				})
			}
			this.activeIndex = index;
		}
	},
	addElement : function(def){
		with(this){
			var tabs = content.attachment.content;
			var element = {};
			element.definition = def.isComponentGeneric ? def.definition : def;
			element.tab = new Layouts.Layout(tabs, {
				layout	: "button",
				onClick	: function(){
					open(element.index);
				},
				icon	: function(object){
					return (typeof element.definition.icon == "function" 
								? element.definition.icon(object) 
								: element.definition.icon) || "link_go";
				},
				title	: function(){
					return element.definition.title || "Untitled";
				},
				text	: function(){
					return element.definition.title || "Untitled";
				}
			});
			
			
			/*
			
			element.tab = new Layouts.Layout(tabs, {
				layout	: "interactive",
				cssClass: "ui-normal",
				onClick	: function(){
					open(element.index);
				},
				content	: {
					layout		: "attachment",
					side		: "west",
					spacing		: true,
					attachment	: {
						layout	: "icon",
						icon	: "images/icons/link_go.png"
					},
					content : {
						layout		: "attachment",
						side		: "east",
						spacing		: true,
						attachment	: {
							layout	: "string",
							value	: "X"
						},
						content		: {
							layout	: "string",
							value	: function(layout){
								return element.definition.title || "Untitled";
							}
						}
					}
				}
			});
			
			
			*/
			
			element.layout = def.isComponentGeneric ? def : new Layouts.Layout(document, def);
			(elements || (this.elements = [])).push(element);
			element.index = elements.length - 1;
			this.clean = false;
			if(activeIndex == -1){
				open(0);
			}
			return element;
		}
	},
	setupDocument : function(document){
		var source = 
			"ui-tabble{"+
				"display:block;"+
				"white-space:nowrap;"+
				"vertical-align:top;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Tabble) // <%/FORMAT%>