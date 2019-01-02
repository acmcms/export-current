// <%FORMAT: 'js' %>
Menu = parent.Menu || {
	// v 2.8v
	//
	//	-= MyX =-
	//
	// uses CSS:
	//		.menu-button - class for buttons made by makeButtons method,
	//		.menu-button-active - class for active buttons made by makeButtons method,
	//		.menu-button-notitle - secondary class for untitled buttons made by makeButtons method,
	//		.menu-button-disabled - secondary class for disabled buttons made by makeButtons method,
	//		.menu-plane - plane (must be position:relative),
	//		.menu-plane A - default link,
	//		.menu-plane HR - spacer,
	//		.menu-element - an item (must be position:relative),
	//		.menu-element > A - link in item,
	//		.menu-element-active - active item (must be position:relative),
	//		.menu-element-active > A - link in active item,
	//		.menu-plane img, .menu-button > .menu-element > img, .menu-button-active > .menu-element-active > img - icon image,
	//		.menu-plane span, .menu-button > .menu-element > span, .menu-button-active > .menu-element-active > span - submenu sign
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//
	// item structure: { title : "item titie, required", icon : "item icon, if present", disabled : true/false, menu_attribute }
	//
	// menu attribute:
	// 	title - string
	// 	menusource - location to get submenu menu source from (on demand)
	// 	submenu - array of menu items (immediately available)
	// 	href - location to navigate in response to menu item selection
	// 	exec - location for remote execution for menu item
	// 	onclick - javascript function for menu item
	// 	disabled - boolean
	//	
	// Menu root element must be a BUTTON element, elements created by makeButtons method will be BUTTONs as well.

	// loadingItem property contains an item to be shown while submenu is loading
	loadingItem : { title : "Loading...", disabled : true },
	
	iconPrefix	: '',
	
	iconSuffix	: '',

	itemClickCancel : function(e){
		if(e || (e = window.event)){
			e.cancelBubble = true; /* Microsoft */
			e.stopPropagation && e.stopPropagation(); /* W3C */
			return e.returnValue = false;
		}
	},

	itemClick : function(object){
		window.require && require("Effects.Busy", function(){ new Effects.Busy(document.body); });
		setTimeout(function(){
			(window.location ? window : document).location.href = object.attributes.href.value;
		}, 50);
	},

	attachMenu : function(button, structure){
		// jQuery compatibility
		button.ownerDocument || (button.length == 1 && (button = button[0]));
		//
		function queryMenuSource(object){
			top.debug && top.debug("Menu menu source requested: " + object.menusource);
			var div = document.createElement("div");
			div.style.display = "none";
			div.style.visibility = "hidden";
			div.innerHTML = "<iframe onload='this.loaded()'></iframe>"; // in IE7 - programatically set onload frame property doesn't work!!!
			var iframe = div.firstChild;
			iframe.src = encodeURI( object.menusource );
			iframe.itemObject = object;
			iframe.holderDiv = div;
			iframe.loaded = function(){
				top.debug && top.debug("Menu: menu-source request finished: " + this.itemObject.menusource);
				this.itemObject.submenu = this.contentWindow.submenu;
				this.itemObject.submenudate = (new Date()).getTime();
				this.itemObject.showMenu(true);
				this.holderDiv.parentNode.removeChild(this.holderDiv);
				return true;
			};
			document.body.appendChild(div);
		}
		function buildSubmenu(elements, y, x, alignLeft, alignTop, zIndex){
			var menu = document.createElement("div");
			menu.className = "menu-plane"
			menu.style.zIndex = zIndex;
			menu.show = null;		// scheduled to highlite
			menu.selected = null;	// currently selected submenu
			menu.menu = null;		// current submenu itself
			menu.close = function(){
				if(this.menu){
					this.menu.close();
					this.menu.item.removeChild(this.menu);
					this.menu = null;
				}
			};
			menu.selectionChange = function() {
				var show = this.show;
				if(show){
					this.show = null;
					if(show == this.selected){
						return;
					}
					if(this.menu && this.menu.item != show) {
						this.close();
						if(this.selected){
							this.selected.className = "menu-element";
							this.selected = null;
						}
					}
					if(show.submenu || show.menusource){
						this.selected = null;
						show.onclick();
						show.className = "menu-element-active";
					}
				}
			};
			for(var i = 0; i < elements.length; ++i){
				var element = elements[i];
				if(element === undefined){
					continue;
				}
				var item = document.createElement("div");
				item.className = "menu-element";
				menu.appendChild(item);
				item.menu = menu;
				item.element = element;
				if(element === null || !element.title){
					item.innerHTML = "<hr/>";
					continue;
				}
				var title = typeof element.title == "function" ? element.title(element) : element.title;
				item.onmouseover = function(){
					var selected = this.menu.selected;
					if((selected == this && !this.menu.show) || this.menu.show == this){
						return;
					}
					clearTimeout(this.menu.timerUpdate);
					this.menu.show = this.element.disabled ? null : this;
					this.menu.timerUpdate = setTimeout(function(){
						menu.selectionChange();
					}, 250);
					selected && (selected != this) && (selected.className = "menu-element");
					this.element.disabled || (this.className = "menu-element-active");
				};
				item.onmouseout = function(){
					if(this.menu.show == this){
						clearTimeout(this.menu.timerUpdate);
						this.menu.show = null;
					}
					var selected = this.menu.selected;
					if(selected != this){
						selected && (selected.className = "menu-element-active");
						this.className = "menu-element";
					}
				};
				item.onmousedown = function(){
					top.debug && top.debug("Menu mousedown, returning focus and clearing hide timeout");
					setTimeout(function(){
						button.focusHandler.focus();
						clearTimeout(button.timerHide);
					}, 50);
					return true;
				};
				var icon = element.icon ? '<img src="'+Menu.iconPrefix+element.icon+Menu.iconSuffix+'">' : '';
				if(element.menusource || element.submenu){
					// 1) this way due to firefox bug in float:right - thanx to bastards from FF
					// 2) not programmatic way due to strange behaviour in IE - thanx to bastards from IE
					item.innerHTML = icon + title + '<span>&#x25BA;</span>';
					item.submenu = element.submenu;
					item.submenudate = element.submenudate || ((new Date()).getTime() - 60000);
					item.menusource = element.menusource;
					item.showMenu = function(force){
						if(force == (this.menu.selected === this)){
							this.menu.close();
							var load = this.menusource && (this.submenudate + 60000 < (new Date()).getTime()),
								menu = buildSubmenu(load ? [Menu.loadingItem] : this.submenu, -1, this.offsetWidth, alignLeft, alignTop, zIndex + 10);
							menu.item = this;
							this.appendChild(menu);
							this.menu.menu = menu;
							this.menu.selected = this;
							load && queryMenuSource(this);
						}
					};
					item.onmousedown = item.onclick = function(e){
						top.debug && top.debug("Menu mousedown, returning focus and clearing hide timeout");
						setTimeout(function(){
							button.focusHandler.focus();
							clearTimeout(button.timerHide);
						}, 50);
						this.showMenu(false);
						return Menu.itemClickCancel(e);
					};
					continue;
				}
				// not submenu
				item.onclick = function(e){
					Menu.blink(this, "menu-element", "menu-element-active", "action");
					return Menu.itemClickCancel(e);
				};
				if(element.href){
					var href = typeof element.href == "function" ? element.href(element) : element.href;
					item.innerHTML = "<a onclick=\"return false\" href=\"" + encodeURI(href) + "\">" + icon + title + "</a>";
					item.action = function(){
						with(this){
							var href = typeof element.href == "function" ? element.href(element) : element.href;
							top.debug && top.debug("Menu go href: " + href);
							(window.location ? window : document).location.href = href;
						}
						button.hideMenu();
						return false;
					};
					continue;
				}
				item.innerHTML = icon + title;
				if(element.exec){
					item.action = function(){
						var iframe = document.createElement("iframe");
						top.debug && top.debug("Menu go exec: " + this.element.exec);
						iframe.src = this.element.exec;
						iframe.style.display = "none";
						iframe.style.visibility = "hidden";
						iframe.itemObject = this;
						iframe.onload = function(){
							top.debug && top.debug("Menu go exec finished: " + this.itemObject.element.exec);
							button.hideMenu();
							this.parentNode.removeChild(this);
							return true;
						};
						document.body.appendChild(iframe);
					};
					continue;
				}
				if(element.onclick){
					item.action = function(){
						top.debug && top.debug("Menu go click!");
						this.element.onclick();
						button.hideMenu();
						return false;
					};
					continue;
				}
				// any other menu item type
				{
					item.action = function(){
						alert("Has no action!");
						button.hideMenu();
						return false;
					};
				}
			}
			top.debug && top.debug("Submenu show: x=" + x + ", y=" + y + ", alignLeft=" + alignLeft + ", alignTop=" + alignTop);
			menu.style.position = "absolute";
			menu.style[ alignTop ? "top" : "bottom" ] = y + "px";
			menu.style[ alignLeft ? "left" : "right" ] = x + "px";
			return menu;
		}
		button.blurHandler = function(){
			top.debug && top.debug("Blur handler - set timer!");
			clearTimeout(button.timerHide);
			button.timerHide = setTimeout(function(){
				button.hideMenu();
			}, 150);
		};
		button.hideMenu = function(){
			if(!this.menu){
				return;
			}
			var iframes = this.focusHandler.iframes;
			for(var i = 0; i < iframes.length; ++i){
				try{
					if(iframes[i].element == iframes[i].iframe.contentWindow) with(iframes[i]){
						top.debug && top.debug("Restore handlers for iframe");
						element.onfocus = focus;
						element.onmouseclick = click;
						element.onmousedown = down;
						element.onmouseup = up;
					}
				}catch(e){
					top.debug && top.debug("Error: looks like we have IE here with its non-conformant js implementation");
				}
			}
			this.menu.close();
			this.menu.parentNode.removeChild(this.menu);
			this.focusHandler.parentNode.removeChild(this.focusHandler);
			this.fake && this.fake.parentNode.removeChild(this.fake);
			this.elementItem.className = "menu-element";
			(this.className == "menu-button-active") && (this.className = "menu-button");
			this.menu = null;
			this.fake = null;
		};
		button.showMenu = function(force){
			if(this.menu){
				if(!force){
					return
				}
				this.menu.close();
				this.menu.parentNode.removeChild(this.menu);
				this.focusHandler.parentNode.removeChild(this.focusHandler);
				clearTimeout(this.timerHide);
				this.menu = null;
			}
			clearTimeout(this.timerHide);
			var coordinates = Menu.calculateObjectCoordinates(this, top.document != this.ownerDocument),
				x = coordinates.x, 
				y = coordinates.y;
			if(this.ownerDocument != document){
				top.debug && top.debug("Menu show: target is in another frame");
				var frames = document.body.getElementsByTagName("iframe");
				for(var i = 0; i < frames.length; ++i){
					var doc = (frames[i].contentWindow && frames[i].contentWindow.document) || frames[i].contentDocument;
					if(doc == this.ownerDocument){
						top.debug && top.debug("Menu show: target is in another frame, object found");
						coordinates = Menu.calculateObjectCoordinates(frames[i], false);
						x += coordinates.x;
						y += coordinates.y;
					}
				}
			}
			top.debug && top.debug("Menu show: raw coordinates: x=" + x + ", y=" + y);
			var db = document.body, 
				de = document.documentElement,

				scrollLeft = de.scrollLeft + (db == de ? 0 : db.scrollLeft),
				scrollTop = de.scrollTop + (db == de ? 0 : db.scrollTop),
				
				oW = de.offsetWidth || db.offsetWidth,
				offsetHeight = de.offsetHeight || db.offsetHeight,
				
				cW = de.clientWidth || db.clientWidth,	// ie5-7 quirks first one gives zero,
				clientHeight = de.clientHeight || db.clientHeight,	// latter gives window metric (not doc's)
				
				useWidth = Math.min(cW || oW, oW || cW);
			
			// top.debug && top.debug("Menu show: scroll coordinates: x=" + scrollLeft + ", y=" + scrollTop + ", clientWidth=" + clientWidth + ", clientHeight=" + clientHeight + ", offsetWidth=" + offsetWidth + ", offsetHeight=" + offsetHeight);
			var alignLeft = (useWidth / 2) > x - scrollLeft,
				alignTop = (clientHeight / 2) > y - scrollTop;
			alignLeft || (x = useWidth - (x + this.offsetWidth)); // left coordinate (for fake)
			alignTop
				? (y += this.offsetHeight)
				: (y = Math.max( offsetHeight, clientHeight ) - y); // bottom coordinate
			top.debug && top.debug("Menu show: effective coordinates: x=" + x + ", y=" + y + ", alignLeft=" + alignLeft + ", alignTop=" + alignTop);
			var load = this.menusource && (this.submenudate + 60000 < (new Date()).getTime()),
				menu = buildSubmenu(load ? [Menu.loadingItem] : this.submenu, y, x, alignLeft, alignTop, 2345);
			if(alignTop && alignLeft){
				db.appendChild(menu);
			}else{
				var fake = document.createElement("div");
				fake.style.position = "absolute";
				fake.style.top = 0;
				fake.style.left = 0;
				// fake.style.backgroundColor = "blue";
				// fake.style.opacity = "0.33";
				fake.style.width = useWidth + "px"; 
				fake.style.height = Math.max( offsetHeight, clientHeight ) + "px";
				fake.appendChild(menu);
				this.fake && this.fake.parentNode.removeChild(this.fake);
				this.fake = fake;
				db.appendChild(fake);
			}
			this.menu = menu;
			(this.className == "menu-button") && (this.className = "menu-button-active");
			this.elementItem.className = "menu-element-active";
			load && queryMenuSource(this);
			// focus handler
			var input = document.createElement("a"), is = input.style;
			input.setAttribute("href", "#");
			is.position = "fixed";
			is.left = "0";
			is.top = "0";
			is.border = "0";
			is.outline = "0";
			is.margin = "0";
			is.padding = "0";
			is.width = "1px";
			is.height = "1px";
			is.zIndex = -10;
			db.appendChild(input);
			this.focusHandler = input;
			input.onblur = this.blurHandler;
			input.button = this;
			input.focus();
			// special code for beloved opera (which is not firing onblur for 'A' when focus goes to an iframe)
			var iframes = document.getElementsByTagName("iframe");
			input.iframes = [];
			for(var i = 0; i < iframes.length; ++i){
				var element = iframes[i].contentWindow;
				if(element){
					top.debug && top.debug("Restore handlers for iframe");
					input.iframes.push({iframe : iframes[i], element : element, focus : element.onfocus, click : element.onmouseclick, down : element.onmousedown, up : element.onmouseup});
					element.onfocus = element.onmouseclick = element.onmousedown = element.onmouseup = this.blurHandler;
				}
			}
		};
		button.className || (button.className = "menu-button");
		var bod = button.ownerDocument,
			item = bod.createElement("div");
		item.className = "menu-element";
		button.elementItem = item;
		button.appendChild(item);
		if(structure.icon){ // icon
			var img = bod.createElement("img");
			img.src = Menu.iconPrefix+structure.icon+Menu.iconSuffix;
			item.appendChild(img);
		}
		if(structure.title !== undefined){ // title
			var title = bod.createTextNode("");
			structure.setTitle = function(text){
				title.nodeValue = text ? " " + text : "";
			};
			structure.setTitle(structure.title);
			item.appendChild(title);
		}
		if(structure.submenu || structure.menusource){
			button.structure = structure; 	// whole menu structure
			button.menu = null; 			// currently open dropdown menu
			button.submenu = structure.submenu;
			button.submenudate = structure.submenudate || ((new Date()).getTime() - 60000);
			button.menusource = structure.menusource;
			var appendix = bod.createElement("span");
			appendix.innerHTML = "&#x25BC;";
			item.appendChild(appendix);
			button.onclick = function(e){
				this.menu ? this.hideMenu() : this.showMenu(false);
				return Menu.itemClickCancel(e);
			};
			return;
		}
	},
	
	makeButtons : function(target, structure){
		// jQuery compatibility
		target.ownerDocument || (target.length == 1 && (target = target[0]));
		//
		if(!structure.submenu){
			throw "makeButtons method accepts only menus with static submenu on first level!";
		}
		for(var i = 0; i < structure.submenu.length; ++i){
			var element = structure.submenu[i];
			if(element === null){
				var item = target.ownerDocument.createElement("span");
				item.innerHTML = "&nbsp;";
				target.appendChild(item);
				continue;
			}
			element.submenu && (element.submenu.length == 1) && (element = element.submenu[0]);
			var button = target.ownerDocument.createElement("button");
			button.setAttribute("type", "button");	//  submit is default value in w3c specs, 'button.type=' doesn't work in any browser
			button.element = element;
			button.addStyle = (element.title ? "" : " menu-button-notitle") + (element.disabled ? " menu-button-disabled" : "") ;
			button.className = "menu-button" + button.addStyle;
			target.appendChild(button);
			if(element.submenu){
				Menu.attachMenu(button, element);
				continue;
			}
			{
				var icon = element.icon ? '<img src="'+Menu.iconPrefix+element.icon+Menu.iconSuffix+'">' : '';
				if(element.title){
					var item = target.ownerDocument.createElement("div");
					item.className = "menu-element";
					button.appendChild(item);
					item.innerHTML = icon + (typeof element.title == "function" ? element.title(element) : element.title);
				}else{
					button.innerHTML = icon;
				}
			}
			element.hint && (button.title = element.hint);
			element.disabled && (button.setAttribute("disabled", "disabled"), button.disabled = true);
			button.onclick = function(e){
				Menu.blink(this, "menu-button" + this.addStyle, "menu-button-active" + this.addStyle, "act");
				return Menu.itemClickCancel(e);
			};
			if(element.onclick){
				button.act = function(){
					this.element.onclick();
				};
				continue;
			}
			if(element.href){
				button.act = function(){
					with(this){
						var href = typeof element.href == "function" ? element.href(element) : element.href;
						(window.location ? window : document).location.href = href;
					}
				};
				continue;
			}
			// any other menu item type
			{
				button.act = function(){
					alert("Has no action!");
				};
			}
		}
	},
	
	blink: function(element, class1, class2, callbackName){
		top.debug && top.debug("blink init: element=" + element + ", class1=" + class1 + ", class2=" + class2 + ", callbackName=" + callbackName);
		var left = 5, handler;
		(handler = function(){
			element.className = --left % 2 ? class1 : class2;
			setTimeout(left ? handler : function(){element[callbackName]()}, left ? 60 : 5);
		})();
	},

	// standard routine v2.0
	calculateObjectCoordinates: function(target, client){
		var x = target.offsetLeft, y = target.offsetTop;
		top.debug && top.debug("coordinates: object=" + target.nodeName + ", c=" + x + ":" + y);
		client && (client = target.ownerDocument.documentElement);
		for(var o = target; (o.style.position != 'fixed' || (client = undefined)) && (o != client || (client = undefined) || true) && (o = o.offsetParent); ){
			x += o.offsetLeft - (client ? o.scrollLeft : 0);
			y += o.offsetTop - (client ? o.scrollTop : 0);
			top.debug && top.debug("coordinates: object=" + o.nodeName + ", c=" + x + ":" + y + ", o=" + o.offsetLeft + ":" + o.offsetTop + ", s=" + o.scrollLeft + ":" + o.scrollTop);
		}
		return {x: client ? x - client.scrollLeft : x, y: client ? y - client.scrollTop : y};
	}
} // <%/FORMAT%>