// <%FORMAT: 'js' %>
(window.Layouts || (Layouts = parent.Layouts) || (Layouts = {})) &&
Layouts.Button || (parent.Layouts && (Layouts.Button = parent.Layouts.Button)) || (
	// v 1.5b
	//
	//	-= MyX =-
	//
	//
	//	Usage:
	//		var button = new Layouts.Button( target, definition );
	//
	//	button : extends Layouts.Layout {
	//		environment	: environment used to create this button
	//		definition	: definition used to describe this button
	//		invalidate	: function(sender)
	//							requests button to reflect new changes in definition
	//		click		: function()
	//
	//
	//		setNormal	:
	//		setSelected	:
	//
	//	}
	//
	//	definition : {
	//		icon	: icon string or function
	//		title	: string or function
	//					'this' object is the Button object.
	//		text	: string or function(target)
	//					'this' object is the Button object.
	//					can return string or should work with DOM element passed.
	//		onClick	: string or function
	//		href	: string
	//		checked	: boolean or function
	//					optional, if present produces checked or unchecked buttons
	//	}
	//
	//	environment : {
	//		invalidate	: function()
	//							will be called (if specified) when button sizes changed
	//	}
	//
	//
	
Layouts.Button = function(target, def, env){
	if(!arguments.length){
		return;
	}
	
	with(this){
		init1_target(target, extend(def, null, (def && def.environment
													? extend(def.environment, env)
													: env)), "button-anchor");

		init2_layers();

		this.environment = env || Layouts.Button.environment;
		this.state = "normal";
		this.panel = null;

		this.button = document.createElement("a");
		button.setAttribute("href", definition.href || "#");
		button.className = "ui-button ui-normal";
		button.component = this;
		
		this.table = document.createElement("table");
		table.className = "ui-button-table";
		table.cellPadding = 0;
		table.cellSpacing = 0;
		
		var row = table.insertRow(-1);
	
		this.leftPad = row.insertCell(-1);
	
		this.tickCell = row.insertCell(-1);
		
		this.tickPad = row.insertCell(-1);
		tickPad.innerHTML = "&nbsp;";

		this.tick = new Layouts.Layout(tickCell, {
			layout	: "icon",
			zoom	: "compact",
			icon	: function(){
				var checked = definition.checked;
				typeof checked == "function" && (checked = checked());
				tickCell.style.display = tickPad.style.display = checked === undefined ? "none" : "";
				return checked ? "tick" : "bullet_white";
			}
		});

		this.iconCell = row.insertCell(-1);

		this.iconPad = row.insertCell(-1);
		iconPad.innerHTML = "&nbsp;";
	
		this.icon = new Layouts.Layout(iconCell, {
			layout	: "icon",
			zoom	: "compact",
			icon	: function(object){
				var icon = typeof definition.icon == "function" ? definition.icon(object) : definition.icon;
				iconCell.style.display = icon ? "" : "none";
				iconPad.style.display = caption && icon ? "" : "none";
				return icon;
			}
		});
	
		this.text = row.insertCell(-1);
	
		this.span = document.createElement("span");
		text.appendChild(span);
	
		this.pad3 = row.insertCell(-1);

		button.appendChild(table);
	
		button.onclick = function(e){
			with(this){
				blur();
				component.busy || (component.onClick && component.click());
				return (component.onClick && Layouts.Button.itemClickCancel(e)) || true;
			}
		};
		
		this.title = null; // button title
		this.caption = null; // button caption
		
		invalidate();
	
		init3_finish();
	}
	
	with(this){
		(definition.buttons || (definition.buttons = [])).push(this);
		definition.invalidate || (definition.invalidate = function(){
			for(var i in this.buttons){
				this.buttons[i].invalidate(definition);
			}
		});
	}
	
	return this;
},
Layouts.Button.prototype = new ((window.Layouts && (Layouts.Layout || (window.require && require("Layouts.Layout")))) || function(){})(),
Layouts.Button.prototype.putAll({
	isComponentTerminal	: true,
	isComponentContainer: false,
	isComponentSequence	: false,
	isComponentButton	: true,
	caption : null,
	state	: "normal",
	setNormal : function(){
		with(this){
			this.state = "normal";
			button.className = "ui-button ui-" + state;
		}
	},
	setActive : function(){
		with(this){
			this.state = "active";
			button.className = "ui-button ui-" + state;
		}
	},
	setHover : function(){
		with(this){
			this.state = "hover";
			button.className = "ui-button ui-" + state;
		}
	},
	setFocus : function(){
		with(this){
			this.state = "focus";
			button.className = "ui-button ui-" + state;
		}
	},
	onAfterRebuild : function(sender){
		with(this){
			var update = false;

			button.parentNode != inner && (
				inner.appendChild(button),
				update = true
			);

			this.title = definition.title || "";
			(typeof title == "function") && (title = title());

			button.title = title;

			var full = zoom == zoom_screen || zoom == zoom_row;
	
			full && (button.style.width = "100%");
			full && (table.style.width = "100%");
			full && (text.style.width = "100%");

			leftPad.style.verticalAlign = 
				tickCell.style.verticalAlign = 
				tickPad.style.verticalAlign =
				iconCell.style.verticalAlign = 
				iconPad.style.verticalAlign =
				text.style.verticalAlign =
					zoom == zoom_compact
						? "middle"
						: "middle";
			
			icon.rebuild(this);

			this.caption = zoom == zoom_compact && icon.icon
								? false
								: definition.text || 
									((full || zoom == zoom_document || !icon.icon) 
										&& title);

			tick.rebuild(this);
			icon.rebuild(this);

			(typeof caption == "function") && (caption = caption(span), typeof caption != "string" && (caption = true));
			leftPad.innerHTML = pad3.innerHTML = full ? "&nbsp;&nbsp;" : "&nbsp;";

			definition.submenu && (pad3.innerHTML = "&nbsp;<small>" + (full ? "&#x25BA;" : "&#x25BC;") + "</small>&nbsp;");
			leftPad.style.display = pad3.style.display = caption ? "" : "none";
			
			iconPad.style.display = caption && icon.icon ? "" : "none";
			
			text.style.display = caption ? "" : "none";
			caption === true || (span.innerHTML = caption);
			onClick || (onClick = definition.submenu
									? function(){
										if(state == "active"){
											full || (
												panel && (panel.destroy(), panel = null), 
												state = "normal"
											);
										}else{
											state = "active";
											panel = new Layouts.Layout(button, {
												layout			: "drop-panel",
												down			: !full,
												display			: false,
												onAfterDestroy	: function(){
													panel == this && (
														state = "normal",
														button.className = "ui-button ui-" + state
													);
												},
												content			: {
													layout		: "menu",
													elements	: definition.submenu
												}
											});
											panel.display();
										}
										button.className = "ui-button ui-" + state;
									}
									: null);
		}
	},
	click : function(){
		var btn = this;
		btn.onClick && require("Effects.Effect")
			? (
				btn.busy = (btn.busy || 0) + 2,
				Effects.Blink(
					function(){
						btn.button.className = btn.state != "normal" ? "ui-button ui-normal" : "ui-button ui-active";
					},
					function(){
						btn.button.className = btn.state != "normal" ? "ui-button ui-active" : "ui-button ui-normal";
					}, 
					function(){
						btn.onClick();
						btn.busy--;
					},
					function(){
						btn.busy--;
						btn.button.className = "ui-button ui-" + btn.state;
					}
				)
			)
			: btn.onClick();
	},
	setupDocument : function(document){
		var source = 
			"ui-button-anchor{"+
				"display:inline-block;"+
				"overflow:visible;"+
				"height:100%;"+
				"min-height:100%;"+
			"}"+
			".ui-button{"+
				"position:relative;"+
				"display:inline-block;"+
				"display:block;"+
				"height:100%;"+
				"min-width:0;"+
			"}"+
			".ui-button-table{"+
				"vertical-align:middle;"+
				"height:100%;"+
			"}"+
		"";
		this.setupRegisterCss(document, source);
	}
}),
Layouts.Button.prototype.invalidate = function(sender){
	with(this){
	}
},
//
// Default environment
//
Layouts.Button.environment = {
	width : "default",
	invalidate : function(sender){
		sender && window.debug && debug("BUTTON: default invalidate handler for: " + sender);
	}
},
Layouts.Button.itemClickCancel = function(e){
	if(e || (e = window.event)){
		e.cancelBubble = true; /* Microsoft */
		e.stopPropagation && e.stopPropagation(); /* W3C */
		return e.returnValue = false;
	}
},
// we still have to return a class we just defined, implemented and initialized 8-)
Layouts.Button) // <%/FORMAT%>