// <%FORMAT: 'js' %>
(window.Effects || (Effects = parent.Effects) || (Effects = {})) &&
Effects.BusyConfigMenu || (parent.Effects && (Effects.BusyConfigMenu = parent.Effects.BusyConfigMenu)) || (
	// v 0.2a
	//
	//	-= MyX =-
	//
	// Creates a menu structure to configure Effects.Busy facility.
	//
	
Effects.BusyConfigMenu = {
	layout	: "button",
	text : "Busy/Progress Indication",
	icon : "hourglass",
	submenu : [],
	setEffectName : function(layout, name){
		var oldName = Effects.Busy.prototype.implName;
		Effects.Busy.prototype.setEffectName(name);
		// update selection
		for(var i in Effects.BusyConfigMenu.submenu){
			var element = Effects.BusyConfigMenu.submenu[i];
			(element.title == oldName || element.title == name) && (
				element.checked = element.title == name, 
				element.invalidate && element.invalidate()
			);
		}
		// let's try to affect the live instances!
		var busys = document.getElementsByTagName("ef-busy");
		for(var i = 0; i < busys.length; ++i){
			var busy = busys.item(i).effect;
			if(!busy || busy.stall || busy.effect){
				continue;
			}
			var impl = busy.impls[name];
			if(busy.create != impl.create){
				busy.stall = true; // will be cleared on busy.update() later
				delete busy.active[busy.key];
				busy.inner.innerHTML = "";
				busy.create = impl.create;
				busy.resize = impl.resize;
				busy.redraw = impl.redraw;
				var expires = busy.expires;
				busy.update();
				busy.expires = expires;
			}
		}
	},
	buildBusySettings : function(){
		var text = "test text test text test text test text test text test text test text test text test text";
		var colors = ["black","red","orange","yellow","green","blue","magenta","black"];
		var html = "";
		for(var i = 0; i < text.length; ++i){
			html += "<font " + ((i & 0x5) == 0 ? "style=background-color:" + colors[(i + 4) % colors.length] : "") + " color=" + colors[i % colors.length] + ">" + text.charAt(i) + "</font>";
		}
		var Busy = require("Effects.Busy");
		for(var i in Busy.prototype.impls){
			this.submenu.push({
				layout	: "button",
				icon : "wrench",
				title : i,
				checked : i == Busy.prototype.implName,
				text : function(target){
					if(!this.textElement){
						var title = this.definition.title;
						var document = this.button.ownerDocument;
						var div = this.textElement = document.createElement("div");
						div.appendChild(document.createTextNode(title));
						
						var rel = this.busyElement = document.createElement("div");
						div.appendChild(rel);
						rel.onmouseover = function(){
							this.busy.update();
						};
						rel.style.position = "relative";
						rel.style.height = "48px";
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
						tbl.style.height = "48px";
						
						var bus = tbl.insertRow(-1).insertCell(-1);
						bus.style.color = "black";
						bus.style.backgroundColor = "white";
						bus.style.fontSize = "10px";
						bus.style.fontWight = "bold";
						bus.style.lineHeight = "8px";
						bus.style.whiteSpace = "normal";

						target.appendChild(div);
						
						bus.innerHTML = html;
						rel.busy = new Busy(tbl, title);
					}
				},
				onClick : function(){
					Effects.BusyConfigMenu.setEffectName(this, this.definition.title);
				}
			});
		}
	}
},
Effects.BusyConfigMenu.buildBusySettings(),
// we still have to return a class we just defined, implemented and initialized 8-)
Effects.BusyConfigMenu) // <%/FORMAT%>