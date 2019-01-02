// <%FORMAT: 'js' %>
(window.Effects || (Effects = parent.Effects) || (Effects = {})) &&
Effects.ShadowConfigMenu || (parent.Effects && (Effects.ShadowConfigMenu = parent.Effects.ShadowConfigMenu)) || (
	// v 0.2a
	//
	//	-= MyX =-
	//
	// Creates a menu structure to configure Effects.Shadow facility.
	//
	
Effects.ShadowConfigMenu = {
	// v 0.0a
	//
	//	-= MyX =-
	//
	layout	: "button",
	text : "Element Shadows",
	icon : "application_double",
	submenu : [],
	setEffectName : function(layout, name){
		var oldName = Effects.Shadow.prototype.implName;
		Effects.Shadow.prototype.setEffectName(name);
		// update selection
		for(var i in Effects.ShadowConfigMenu.submenu){
			var element = Effects.ShadowConfigMenu.submenu[i];
			(element.title == oldName || element.title == name) && (
				element.checked = element.title == name, 
				element.invalidate && element.invalidate()
			);
		}
		// let's try to affect the live instances!
		var shadows = document.getElementsByTagName("ef-shadow");
		for(var i = 0; i < shadows.length; ++i){
			var shadow = shadows.item(i).effect;
			if(!shadow || shadow.effect){
				continue;
			}
			var impl = shadow.impls[name];
			if(shadow.create != impl.create){
				shadow.inner.innerHTML = "";
				shadow.create = impl.create;
				shadow.create(shadow.inner);
			}
		}
	},
	buildShadowSettings : function(){
		var text = "test text test text test text test text test text test text test text test text test text test text test text test text test text test text test text test text test text";
		var colors = ["black","red","orange","yellow","green","blue","magenta","black"];
		var html = "";
		for(var i = 0; i < text.length; ++i){
			html += "<font color=" + colors[i % colors.length] + ">" + text.charAt(i) + "</font>";
		}
		var Shadow = require("Effects.Shadow");
		for(var i in Shadow.prototype.impls){
			var div = document.createElement("div");
			var count = div.getElementsByTagName("*").length;
			new Shadow(div, i);
			count = (div.getElementsByTagName("*").length - count);
			this.submenu.push({
				layout	: "button",
				icon : "wrench",
				count : count,
				title : String(i),
				value : i,
				checked : i == Shadow.prototype.implName,
				text : function(target){
					if(!this.textElement){
						var title = this.definition.title;
						var value = this.definition.value;
						var document = this.button.ownerDocument;
						var div = this.textElement = document.createElement("div");
						div.innerHTML = title + "<small><br>" + this.definition.count + " element(s)</small>";
						
						var rel = this.busyElement = document.createElement("div");
						div.appendChild(rel);
						rel.style.position = "relative";
						rel.style.width = "128px";
						rel.style.height = "64px";
						rel.style.border = "solid 1px black";
						rel.style.color = "black";
						rel.style.backgroundColor = "white";
						rel.style.fontSize = "10px";
						rel.style.lineHeight = "10px";
						rel.style.whiteSpace = "normal";
						rel.style.overflow = "hidden";
						
						var tbl = document.createElement("table");
						rel.appendChild(tbl);
						tbl.cellPadding = 0;
						tbl.sellSpacing = 0;
						tbl.style.width = "64px";
						tbl.style.height = "64px";
						
						var bus = tbl.insertRow(-1).insertCell(-1);
						bus.style.color = "black";
						bus.style.backgroundColor = "white";
						bus.style.fontSize = "10px";
						bus.style.fontWight = "bold";
						bus.style.lineHeight = "8px";
						bus.style.whiteSpace = "normal";
						
						require("Layouts.Layout");
						
						var wn1 = document.createElement("div");
						wn1.style.cssText = "position:absolute;left:20px;top:20px;width:16px;height:16px;background-color:Window";
						new Layouts.Layout(wn1,{ 
							layout		: "interactive", 
							zoom		: "screen",
							cssStyle	: "border:solid 1px ButtonShadow"
						});
						rel.appendChild(wn1);

						var wn2 = document.createElement("div");
						wn2.style.cssText = "position:absolute;right:20px;bottom:20px;width:16px;height:16px;background-color:Window";
						new Layouts.Layout(wn2,{ 
							layout : "interactive", 
							zoom		: "screen",
							cssStyle : "border:solid 1px ButtonShadow"
						});
						rel.appendChild(wn2);

						target.appendChild(div);
						
						bus.innerHTML = html;
						
						setTimeout(function(){
							new Shadow(wn1, value);
							new Shadow(wn2, value);
						}, 100);
					}
				},
				onClick : function(){
					Effects.ShadowConfigMenu.setEffectName(this, this.definition.title);
				}
			});
		}
	}
},
Effects.ShadowConfigMenu.buildShadowSettings(),
// we still have to return a class we just defined, implemented and initialized 8-)
Effects.ShadowConfigMenu) // <%/FORMAT%>