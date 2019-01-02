// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.LayoutConfigMenu || (parent.Layouts && (Layouts.LayoutConfigMenu = parent.Layouts.LayoutConfigMenu)) || (
	// v 0.2b
	//
	//	-= MyX =-
	//
	// Creates a menu structure to configure Layouts.Transition facility.
	//
	
Layouts.LayoutConfigMenu = {
	// v 0.0a
	//
	//	-= MyX =-
	//
	layout	: "button",
	text : "Layout Style",
	icon : "layout",
	submenu : [],
	_setStyle : function(layout, style){
		var oldStyle = Layouts.styleName;
		var Transition = require("Effects.Transition");
		var target = document.body;
		new Transition("fade", target, function(){
			target.style.visibility = "hidden";
			// new (require("Effects.Busy"))(target);   -- not visible - no element to attach %(
			var busy = new (require("Effects.Busy"))(document.documentElement);
			Layouts.setTheme(style, true);
			setTimeout(function(){
				// update selection
				for(var i in Layouts.LayoutConfigMenu.submenu){
					var element = Layouts.LayoutConfigMenu.submenu[i];
					(element.style == oldStyle || element.style == style) && (
						element.checked = element.style == style, 
						element.invalidate && element.invalidate()
					);
				}
				var elements = target.getElementsByTagName("*");
				top.debug && top.debug("Layouts.setTheme: element count: " + elements.length);
				var rebuild = function(){
					for(var j in [0,1]){
						for(var i = 0; i < elements.length; ++i){
							var element = elements[i];
							element.compoment && (
								element.component.rebuild(null),
								element.component.environment 
									&& element.component.environment.onContentChange 
									&& element.component.environment.onContentChange(null),
								element.component.rebuild(null)
							);
						}
						require("Utils.Event").fire(window, "resize");
					}
				}
				rebuild();
				setTimeout(function(){
					new Transition("appear", target, function(){
						busy && busy.destroy();
						rebuild();
						target.style.visibility = "";
						rebuild();
					});
				},50);
			},50);
		});
	},
	_style : function(style){
		Layouts.LayoutConfigMenu.submenu.push({
			layout	: "button",
			text	: style,
			icon	: "layout",
			style	: style,
			checked	: function(){
				return Layouts.styleName == style;
			},
			onClick	: function(){
				Layouts.LayoutConfigMenu._setStyle(this, style);
			}
		});
	}
},
Layouts.LayoutConfigMenu._style("default"),
Layouts.LayoutConfigMenu._style("operax"),
Layouts.LayoutConfigMenu._style("sparta"),
Layouts.LayoutConfigMenu._style("crazy1"),
Layouts.LayoutConfigMenu._style("girlpower"),
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.LayoutConfigMenu) // <%/FORMAT%>