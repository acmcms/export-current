// <%FORMAT: 'js' %>
window.debug || 
(window.debug = top.debug) || 
/**
 * we want popup windows to use opener's debug console, however there could be an 
 * opener which is already closed...
 */
top.opener && (function(){try{window.debug = top.opener.top.debug}catch(e){}})() || 
(window.debug = function(text){
	// v 1.8f
	//
	//	-= MyX =-
	//
	// Usage like this:
	//		window.debug?.( <message> );
	//	or
	//		top.debug?.( <message> );
	//
	
	with(debug.state){
		var formatDate = (top.TimeControl && top.TimeControl.formatDate) || formatDateDefault;
		messages.push(formatDate(new Date()) + ": " + text);
		(messages.length > 500) && messages.splice(0, messages.length - 500);
		collapsed || paused || enqueueBuild();
		return arguments[arguments.length];
	}
},
debug.toBoolean = function(){
	with(debug.state){
		return !collapsed;
	}
},
debug.state = {
	collapsed : true,
	paused : false,
	messages : [],
	alignLeft : false,
	alignTop : false,
	filter : "",
	grep : null,
	opacity : 1,
	colorToolbar : "#AAAAAA",
	colorActive : "#DDDDDD",
	heartbeatCounter : 0,
	heartbeat : true,
	elementClosed : null,
	elementPanel : null,
	
	timerBuild : null,
	enqueuedBuild : function(){
		with(debug.state){
			timerBuild = null;
			collapsed || paused || (elementPanel.elementMessages.innerHTML = buildText());
		}
	},
	enqueueBuild : function(){
		with(debug.state){
			timerBuild || (timerBuild = setTimeout(enqueuedBuild, 50));
		}
	},
	
	d2 : function(number){
		return number < 10 ? '0' + number : number;
	},
	formatDateDefault : function(date){
		with(debug.state){
			return 	date.getFullYear() + '-' +
					d2(date.getMonth() + 1) + '-' +
					d2(date.getDate()) + ' ' +
					d2(date.getHours()) + ':' +
					d2(date.getMinutes()) + ':' +
					d2(date.getSeconds());
		}
	},
	setGrep : function(value){
		with(debug.state){
			grep.value = filter = value;
			setTimeout(enqueueBuild, 50);
		}
	},
	buildText : function(){
		with(debug.state){
			var totalHtml = "", f = grep.value, i;
			for(i = messages.length - 1; i >= 0; --i){
				if(f && messages[i].indexOf(f) == -1){
					continue;
				}
				totalHtml += messages[i].replace(/\</g, "&lt;").replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;") + "<br/>";
			}
			return totalHtml;
		}
	},
	init2 : function(){
		var document = top.document,
			e;
		if(document._myx_debug_is_here){
			return;
		}
		document._myx_debug_is_here = 1;

		with(debug.state){
			alignLeft = readCookie("dbl", '0') == '1';
			alignTop = readCookie("dbt", '0') == '1';
			opacity = Math.min(4, Math.max(0, parseInt(readCookie("dbo", '4'))));
			!opacity && (opacity = 1);
			heartbeat = readCookie("dbh", '1') == '1';
			filter = readCookie("dbf", '');

			var clientDimensions = function(){
				var e = document.documentElement || document;
				return { x : e.clientWidth, y : e.clientHeight };
				/**
				 * obsolete - not working - document length could be more than a screen
				 */
				var e = document.createElement("div");
				e.style.position = "absolute";
				e.style.right = "0";
				e.style.bottom = "0";
				e.style.width = "1px";
				e.style.height = "1px";
				document.body.appendChild(e);
				var result = {x : e.offsetLeft, y : e.offsetTop};
				document.body.removeChild(e);
				return result;
			};
			
			var dimensions = clientDimensions();

			var setOpacity = function(){
				elementPanel.style.opacity = opacity / 4;
				elementPanel.style.filter = opacity == 4 ? "" : 'alpha(opacity=' + (opacity * 25) + ')';
				var array = [elementPanel.buttonO3, elementPanel.buttonO2, elementPanel.buttonO1];
				for(var i = array.length - 1; i >= 0; --i){
					var e = array[i];
					e.style.backgroundColor = (opacity == e.opacityIndex) ? colorActive : "";
				}
			};

			var clickOpacity = function(){
				opacity = this.opacityIndex;
				debug("Debug layer opacity set to: " + (opacity / 4));
				createCookie("dbo", opacity, 180);
				setOpacity();
			};

			var updatePositions = function(){
				var array = [elementPanel.buttonLT, elementPanel.buttonRT, elementPanel.buttonLB, elementPanel.buttonRB];
				for(var i = array.length - 1; i >= 0; --i){
					var e = array[i];
					e.style.backgroundColor = (alignLeft == e.positionLeft && alignTop == e.positionTop) ? colorActive : "";
				}
			};

			var clickPosition = function(){
				var left = this.positionLeft;
				var top = this.positionTop;
				alignLeft = left;
				alignTop = top;
				createCookie("dbl", left ? '1' : '0', 180);
				createCookie("dbt", top ? '1' : '0', 180);
				
				var array = [elementPanel, elementCollapsed];
				for(var i = array.length - 1; i >= 0; --i){
					var e = array[i];
					e.style[!left ? "left" : "right"] = "";
					e.style[!top ? "top" : "bottom"] = "";
					e.style[left ? "left" : "right"] = "0";
					e.style[top ? "top" : "bottom"] = "0";
				}
				
				updatePositions();
			};

			var clickOpen = function(){
				var dimensions = clientDimensions();

				var e;
				e = elementCollapsed;
				e.style.visibility = "hidden";
				e.style.display = "none";

				e = elementPanel.elementMessages;
				e.style.width = Math.round(dimensions.x / 2) + "px";
				e.style.height = (Math.round(dimensions.y / 3) - 17) + "px";

				e = elementPanel;
				e.elementMessages.innerHTML = buildText();
				e.style.width = Math.round(dimensions.x / 2) + "px";
				e.style.height = Math.round(dimensions.y / 3) + "px";
				e.style.visibility = "";
				e.style.display = "";
				
				collapsed = false;
				createCookie("dbc", collapsed ? '1' : '0', 180);
			};
		
			var clickClose = function(){
				var e;
				e = elementCollapsed;
				e.style.visibility = "";
				e.style.display = "";

				e = elementPanel;
				e.elementMessages.innerHTML = "";
				e.style.visibility = "hidden";
				e.style.display = "none";
				
				collapsed = true;
				createCookie("dbc", collapsed ? '1' : '0', 180);
			};
			
			var buttonSetup = function(e){
				e.style.textAlign = "center";
				e.style.border = "solid 1px black";
				e.style.borderLeftColor = "white";
				e.style.borderTopColor = "white";
				e.style.backgroundColor = colorToolbar; // required by opera to position text somehow %)
				e.style.width = "16px";
				e.style.height = "15px";
			};

			var insertSpace = function(){
				e = document.createElement("div");
				e.style.cssFloat = "right";
				e.style.styleFloat = "right";
				e.innerHTML = "&nbsp;";
				elementPanel.elementToolbar.appendChild(e);
			};
			
			e = elementCollapsed = document.createElement("div");
			e.className = "dbglyr";
			e.style.visibility = collapsed ? "" : "hidden";
			e.style.display = collapsed ? "" : "none";
			e.style[alignLeft ? "left" : "right"] = "0";
			e.style[alignTop ? "top" : "bottom"] = "0";
			e.style.whiteSpace = "nowrap";
			e.style.zIndex = 5000;
			e.style.border = "solid 1px #BBBBBB";
			e.style.color = "#777777";
			e.style.backgroundColor = "#BBBBBB";
			e.style.fontSize = "10px";
			e.style.lineHeight = "12px";
			e.style.fontWeight = "bold";
			e.style.width = "9px";
			e.style.height = "12px";
			e.style.overflow = "hidden";
			e.style.scroll = "no";
			e.style.textAlign = "center";
			e.style.cursor = "pointer";
			e.style.opacity = 0.5;
			e.style.filter = 'alpha(opacity=50)';
			e.title = "Click to open debug panel";
			e.innerHTML = "&#182;";
			e.onclick = clickOpen;
			document.body.appendChild(e);
			
			e = elementPanel = document.createElement("div");
			e.className = "dbglyr";
			e.style.visibility = collapsed ? "hidden" : "";
			e.style.display = collapsed ? "none" : "";
			e.style[alignLeft ? "left" : "right"] = "0";
			e.style[alignTop ? "top" : "bottom"] = "0";
			e.style.width = Math.round(dimensions.x / 2) + "px";
			e.style.height = Math.round(dimensions.y / 3) + "px";
			e.style.cursor = "default";
			e.style.whiteSpace = "nowrap";
			e.style.zIndex = 5000;
			document.body.appendChild(e);
			
			e = elementPanel.elementToolbar = document.createElement("div");
			e.style.borderBottom = "solid 1px #BBBBBB";
			e.style.fontSize = "16px";
			e.style.lineHeight = "16px";
			e.style.fontWeight = "bold";
			e.style.height = "17px";
			e.style.overflow = "hidden";
			e.style.color = "black";
			e.style.backgroundColor = colorToolbar;
			e.style.opacity = 1;
			elementPanel.appendChild(e);
			
			e = elementPanel.buttonClose = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#9587;"; // extended
			e.innerHTML = "&#9747;"; // extended
			e.innerHTML = "&#10006;"; // extended
			e.innerHTML = "&#9632;";
			e.innerHTML = "&#9660;";
			e.setAttribute("title", "Minimize");
			e.onclick = clickClose;
			elementPanel.elementToolbar.appendChild(e);

			insertSpace();

			e = elementPanel.buttonRB = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#8600;"; // extended
			e.innerHTML = "&#9484;";
			e.innerHTML = "&#9556;";
			e.setAttribute("title", "Dock Right Bottom");
			e.positionLeft = false;
			e.positionTop = false;
			e.onclick = clickPosition;
			elementPanel.elementToolbar.appendChild(e);

			e = elementPanel.buttonLB = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#8601;"; // extended
			e.innerHTML = "&#9488;";
			e.innerHTML = "&#9559;";
			e.setAttribute("title", "Dock Left Bottom");
			e.positionLeft = true;
			e.positionTop = false;
			e.onclick = clickPosition;
			elementPanel.elementToolbar.appendChild(e);

			e = elementPanel.buttonRT = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#8599;"; // extended
			e.innerHTML = "&#9492;";
			e.innerHTML = "&#9562;";
			e.setAttribute("title", "Dock Right Top");
			e.positionLeft = false;
			e.positionTop = true;
			e.onclick = clickPosition;
			elementPanel.elementToolbar.appendChild(e);

			e = elementPanel.buttonLT = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#8598;"; // extended
			e.innerHTML = "&#9496;";
			e.innerHTML = "&#9565;";
			e.setAttribute("title", "Dock Left Top");
			e.positionLeft = true;
			e.positionTop = true;
			e.onclick = clickPosition;
			elementPanel.elementToolbar.appendChild(e);

			insertSpace();

			e = elementPanel.buttonO3 = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#9632;";
			e.setAttribute("title", "Opacity 100%");
			e.opacityIndex = 4;
			e.onclick = clickOpacity;
			elementPanel.elementToolbar.appendChild(e);

			e = elementPanel.buttonO2 = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#190;";
			e.setAttribute("title", "Opacity 75%");
			e.opacityIndex = 3;
			e.onclick = clickOpacity;
			elementPanel.elementToolbar.appendChild(e);

			e = elementPanel.buttonO1 = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "&#189;";
			e.setAttribute("title", "Opacity 50%");
			e.opacityIndex = 2;
			e.onclick = clickOpacity;
			elementPanel.elementToolbar.appendChild(e);

			insertSpace();

			e = elementPanel.buttonClear = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = "<u>^</u>";
			e.innerHTML = "&#8962;";
			e.innerHTML = "&#8966;";
			e.innerHTML = "&#9675;";
			e.innerHTML = "&#9702;";
			e.innerHTML = "&#9674;";
			e.innerHTML = "&#9167;";
			e.innerHTML = "&#215;";
			e.setAttribute("title", "Clear output");
			e.onclick = function(){
				messages = [];
				debug("Debug output cleared by user request.");
			};
			elementPanel.elementToolbar.appendChild(e);

			insertSpace();

			e = elementPanel.buttonHeartbeat = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.style.color = heartbeat ? "" : "green";
			e.style.backgroundColor = heartbeat ? colorActive : "";
			e.innerHTML = "&#9829;";
			e.setAttribute("title", "Heartbeat on/off");
			e.onclick = function(){
				heartbeat = !heartbeat;
				debug("Debug heartbeat turned "+ (heartbeat ? "on" : "off") +" by user request.");
				createCookie("dbh", heartbeat ? '1' : '0', 180);
				this.style.color = heartbeat ? "" : "green";
				this.style.backgroundColor = heartbeat ? colorActive : "";
			};
			elementPanel.elementToolbar.appendChild(e);

			insertSpace();

			e = elementPanel.buttonPause = document.createElement("div");
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			buttonSetup(e);
			e.innerHTML = paused ? "&#9658;" : "&#9553;";
			e.innerHTML = paused ? "&#9658;" : "&#449;";
			e.setAttribute("title", "Pause / Resume");
			e.onclick = function(){
				paused || debug("Debug output paused by user request.");
				paused = !paused;
				elementPanel.buttonPause.style.color = paused ? "green" : "black";
				elementPanel.buttonPause.innerHTML = paused ? "&#9658;" : "&#449;";
				elementPanel.elementMessages.style.backgroundColor = paused ? colorToolbar : "red";
				paused || debug("Debug output resumed by user request.");
				paused || (elementPanel.elementMessages.innerHTML = buildText());
			};
			elementPanel.elementToolbar.appendChild(e);

			insertSpace();

			e = grep = document.createElement("input");
			e.setAttribute("type", "text");
			e.setAttribute("title", "grep");
			e.setAttribute("value", filter);
			e.style.cssFloat = "right";
			e.style.styleFloat = "right";
			e.style.border = "1px solid";
			e.style.padding = "0";
			e.style.margin = "1px";
			e.style.width = "auto";
			e.style.height = "14px";
			e.style.fontSize = "12px";
			e.onchange = e.onblur = e.onkeydown = e.onkeyup = function(){
				var value = this.value;
				if(value != filter){
					clearTimeout(this.timeout);
					this.timeout = setTimeout(function(){
						createCookie("dbf", value, 180);
						grep.timeout = null;
					}, 5000);
					setGrep(value);
				}
			};
			elementPanel.elementToolbar.appendChild(e);

			e = elementPanel.elementTitle = document.createElement("div");
			e.style.cssFloat = "left";
			e.style.styleFloat = "left";
			e.style.padding = "1px 0 0 2px";
			e.innerHTML = "Debug output&nbsp;";
			elementPanel.elementToolbar.appendChild(e);

			e = elementPanel.elementMessages = document.createElement("div");
			e.style.fontSize = "12px";
			e.style.lineHeight = "12px";
			e.style.fontWeight = "normal";
			e.style.width = Math.round(dimensions.x / 2) + "px";
			e.style.height = (Math.round(dimensions.y / 3) - 17) + "px";
			e.style.overflow = "scroll";
			e.style.scroll = "auto";
			e.style.color = "white";
			e.style.backgroundColor = "red";
			e.style.opacity = 1;
			elementPanel.appendChild(e);

			setOpacity();
			updatePositions();
			
			collapsed = readCookie("dbc", '1') == '1'; // should be last - to prevent attempts to write
			collapsed || clickOpen();
			
			var heartbeatTimer = function(){
				heartbeat && debug(":::HEARTBEAT::: " + (++heartbeatCounter));
				setTimeout(heartbeatTimer, 10000);
			};
			setTimeout(heartbeatTimer, 10000);
		}
	},
	
	// standard routine
	createCookie: function(name,value,days) {
		top.debug?.("cookie write: name=" + name + ", days=" + days + ", value=" + value);
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = name+"="+encodeURIComponent(value)+expires+"; path=/";
	},

	// standard routine
	readCookie: function(name,defaultValue) {
		top.debug?.("cookie read: name=" + name);
		name += '=';
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;++i) {
			var c = ca[i];
			while(c.charAt(0)==' ') {
				c = c.substring(1,c.length);
			}
			if(c.indexOf(name) == 0){
				return decodeURIComponent(c.substring(name.length, c.length)) || defaultValue;
			}
		}
		return defaultValue;
	},

	/**
	 * @Description attaches an event handler callback to a given object.
	 */
	// standard routine, v2.2
	addEvent: function( obj, type, fn ) {
		var ffn = ((typeof fn == 'function') ? fn : new Function(fn));
		if(obj.addEventListener){
			obj.addEventListener( type, ffn, false );
			top.debug?.(this + ".addEvent('" + (obj.nodeName || obj) + "', '" + type + "'): DOM way!");
		}else
		if(obj.attachEvent){
			obj.attachEvent("on"+type, function(e){
				ffn.call( obj, e || window.event );
			});
			top.debug?.(this + ".addEvent('" + (obj.nodeName || obj) + "', '" + type + "'): IE6 way!");
		}else{
			var name = "on" + type;
			if(!obj[name] || !obj[name].handlers){
				var save = obj[name];
				var func = obj[name] = function(e){
					e || (e = window.event);
					for(var i in func.handlers){
						func.handlers[i].call(obj,e);
					}
				};
				obj[name].handlers = save ? [save] : [];
			}
			obj[name].handlers.push(ffn);
			top.debug?.(this + ".addEvent('" + (obj.nodeName || obj) + "', '" + type + "'): Classic way!");
		}
	},

	init : function(){
		window.document.write("<style>\n.dbglyr{position:fixed;}\n</style>\n<!--[if lt IE 7]>\n<style>\nhtml,body{margin:0;padding:0;width:100%;height:100%;overflow:auto;}\n.dbglyr{position:absolute;}\n</style>\n<![endif]-->\n");
		this.addEvent(window, "load", this.init2);
		this.addEvent(document, "DOMContentLoaded", this.init2);
	},
	
	toString : function(){
		return "debug";
	},
	
	alert : alert // real alert, could be replaced later by someone
},
debug.state.init(),
/**
 *  don't replace alert HERE - GUI should replace alert
 */
// window.alert = debug,

// we still have to return a class we just defined, implemented and initialized 8-)
debug) // <%/FORMAT%>