// <%FORMAT: 'js' %>
CharacterPalette = window.top.CharacterPalette || {
	// v 0.9k
	//
	//	-= MyX =-
	//
	// Call activate with callback, unicode character code will be returned
	//
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//
	
	// Maximal code
	maxCode : 0xE0FFF,
	// Normal (unfocused list item) dimensions
	boxWidth : 56,
	boxHeight : 44,
	
	// Zoom factor
	zoomFactor : 2.5,
	
	// state
	listIndex : 0,
	listFocus : 0,
	listPage : 0,
	savedListIndex : undefined,
	savedListFocus : undefined,
	savedOnResizeWindow : undefined,
	savedOnResizeBody : undefined,
	savedOnKeypress : undefined,
	elementRoot : undefined, // root element
	elementPanel : undefined, // favorites container
	elementToolbar : undefined, // toolbar element
	elementList : undefined, // list element
	
	//
	// activate method activates control in topmost element. Callback can be passed, if so - doubleclick on
	// any character will close control and call callback( <character code selected> ). 
	//
	activate : function( callback ){
		with(CharacterPalette){
			var sizeMaxWidth = Math.ceil(boxWidth * zoomFactor);
			var sizeMaxHeight = Math.ceil(boxHeight * zoomFactor);
	
			var document = window.top.document;
			var clientWidth = document.documentElement.clientWidth || document.body.offsetWidth || document.body.clientWidth;
			var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
			var toolbarHeight = Math.min( boxHeight, Math.max( 8, Math.round( clientHeight / 10 ) ));
		
			listIndex = readCookie("cpi", 0);
			listFocus = readCookie("cpf", 0);
			var location, font;
			if(!callback){
				var parameters = {};
				location = extractUrlParameters(window.location.href, '#', parameters);
				parameters.cpi && (listIndex = parameters.cpi);
				parameters.cpf && (listFocus = parameters.cpf);
				font = parameters.font;
			}

			var setIndex = function(index){
				listIndex = Math.max(0, Math.min(maxCode, parseInt(index)));
				createCookie("cpi", listIndex, 180);
				if(location){
					fixHref(location + "#cpi=" + listIndex + "&cpf=" + listFocus + (font ? "&font=" + font : ""), true);
				}
			};
			
			var setFocus = function(code){
				listFocus = code;
				elementPanel.focusBox.setCode( code );
				elementPanel.xmlBox.innerHTML = code && code <= maxCode ? "&amp;#"+code+';' : "&amp;nbsp;";
				createCookie("cpf", code, 180);
				if(location){
					fixHref(location + "#cpi=" + listIndex + "&cpf=" + listFocus + (font ? "&font=" + font : ""), true);
				}
			};
		
			var setCode = function(code){
				this.code = code;
				this.visual.innerHTML = code && code <= maxCode ? "&#"+code+';' : "&nbsp;";
				this.number.innerHTML = code <= maxCode ? code + " / " + code.toString(16).toUpperCase() : "&nbsp;";
			};
			
			var boxClick = function(){
				savedListIndex = undefined;
				savedListFocus = listFocus;
				setFocus(this.code);
			};
			
			var updateBoxes = function(){
				for(var i = elementList.boxes.length - 1; i >= 0; --i){
					elementList.boxes[i].setCode( listIndex + i );
				}
			};
			
			var boxFactor = function(element, scale, coordinates){
				var width = Math.round(boxWidth * scale);
				var height = Math.round(boxHeight * scale);
				var left = -Math.round((width - boxWidth) / 2);
				var top = -Math.round((height - boxHeight) / 2);
				var box = element.box;
				(-left > box.offsetLeft) && (left = -box.offsetLeft);
				(-top > box.offsetTop) && (top = -box.offsetTop);
				(left + width + box.offsetLeft > elementList.offsetWidth) && (left = elementList.offsetWidth - box.offsetLeft - width - 2);
				(top + height + box.offsetTop > elementList.offsetHeight) && (top = elementList.offsetHeight - box.offsetTop - height - 2);
				element.style.left = left + "px";
				element.style.top = top + "px";
				element.style.width = width + "px";
				element.style.height = height + "px";
				var visual = element.visual;
				visual.style.fontSize = Math.round((boxHeight - 17) * scale) + "px";
				visual.style.lineHeight = Math.round((boxHeight - 15) * scale) + "px";
				visual.style.height = Math.round((boxHeight - 12) * scale) + "px";
				var number = element.number;
				number.style.fontSize = Math.round(7 * scale) + "px";
				number.style.lineHeight = Math.round(7 * scale) + "px";
			};
			
			var boxMove = function(event){
				event || (event = window.event);
				var scale = this.scale || 1;
				var offsetX;
				var offsetY;
				var coordinates = this.coordinates || (this.coordinates = calculateObjectCoordinates(this));
				if(event.pageX === undefined){
					offsetX = event.clientX - coordinates.x;
					offsetY = event.clientY - coordinates.y;
				}else{
					offsetX = event.pageX - coordinates.x;
					offsetY = event.pageY - coordinates.y;
				}
				var distX = Math.max(0, 3 * Math.abs( boxWidth / 2 - offsetX ) / boxWidth - 0.4);
				var distY = Math.max(0, 3 * Math.abs( boxHeight / 2 - offsetY ) / boxHeight - 0.4);
				var dist = Math.max(distX, distY);
				this.scale = Math.max(1, zoomFactor / (1 + (zoomFactor - 1) * dist));
				boxFactor(this.element, this.scale, coordinates);
			};
			
			var boxOver = function(event){
				this.style.zIndex = 1499; // for IE7
				this.element.style.zIndex = 1500;
				this.element.style.backgroundColor = "white";
				this.coordinates && (this.coordinates = calculateObjectCoordinates(this));
				this.onmousemove(event);
			};
			
			var boxOut = function(event){
				this.scale = 1;
				boxFactor(this.element, 1);
				this.coordinates = null;
				this.element.style.backgroundColor = "#E0F0FF";
				this.element.style.zIndex = "";
				this.style.zIndex = ""; // for IE7
			};
			
			var pagePrev = function(){
				savedListIndex = listIndex;
				savedListFocus = undefined;
				setIndex(Math.max( listIndex - listPage, 0 ));
				this.disabled = listIndex <= 0;
				elementToolbar.buttonNext.disabled = listIndex + listPage > maxCode;
				updateBoxes();
				elementToolbar.panelStatus.updateStatus();
			};
			
			var pageNext = function(){
				savedListIndex = listIndex;
				savedListFocus = undefined;
				setIndex(Math.min( listIndex + listPage, maxCode ));
				elementToolbar.buttonPrev.disabled = listIndex <= 0;
				this.disabled = listIndex + listPage > maxCode;
				updateBoxes();
				elementToolbar.panelStatus.updateStatus();
			};
			
			var pageFirst = function(){
				savedListIndex = listIndex;
				savedListFocus = undefined;
				setIndex(0);
				this.disabled = listIndex <= 0;
				elementToolbar.buttonNext.disabled = listIndex + listPage > maxCode;
				updateBoxes();
				elementToolbar.panelStatus.updateStatus();
			};
			
			var pageLast = function(){
				savedListIndex = listIndex;
				savedListFocus = undefined;
				setIndex(maxCode + 1 - listPage);
				elementToolbar.buttonPrev.disabled = listIndex <= 0;
				this.disabled = listIndex + listPage > maxCode;
				updateBoxes();
				elementToolbar.panelStatus.updateStatus();
			};
			
			var onresize = function(){
				clientWidth = document.documentElement.clientWidth || document.body.offsetWidth || document.body.clientWidth;
				clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
				toolbarHeight = Math.min( boxHeight, Math.max( 8, Math.round( Math.min(clientHeight, (clientWidth - sizeMaxWidth) / 2) / 10 ) ));

				var listWidth = clientWidth - sizeMaxWidth;
				var listHeight = clientHeight - toolbarHeight;
				var capacityX = Math.floor( listWidth / (boxWidth + 2) );
				var capacityY = Math.floor( listHeight / (boxHeight + 2) );
				var extraX = listWidth - capacityX * (boxWidth + 2);
				var extraY = listHeight - capacityY * (boxHeight + 2);

				window.top.debug && window.top.debug("onresize: cs=" + clientWidth + 'x' + clientHeight + ", ls=" + listWidth + 'x' + listHeight + ", ts=" + capacityX + 'x' + capacityY);
				
				if(capacityX < zoomFactor || capacityY < zoomFactor){
					return false;
				}

				var current;

				current = elementToolbar;
				current.style.width = (clientWidth - sizeMaxWidth) + "px";
				current.style.height = (toolbarHeight) + "px";

				current = elementToolbar.panelLeft;
				current.style.width = (toolbarHeight * 4) + "px";
				
				current = elementToolbar.panelRight;
				current.style.width = (toolbarHeight * 4) + "px";
				
				current = elementToolbar.buttonPrev;
				current.style.fontSize = Math.round(toolbarHeight / 2) + "px";
				current.style.lineHeight = Math.round(toolbarHeight / 2) + "px";
				
				current = elementToolbar.buttonNext;
				current.style.fontSize = Math.round(toolbarHeight / 2) + "px";
				current.style.lineHeight = Math.round(toolbarHeight / 2) + "px";
				
				current = elementToolbar.panelStatus;
				current.style.fontSize = toolbarHeight + "px";
				current.style.lineHeight = toolbarHeight + "px";

				current = elementList;
				current.style.left = Math.floor(extraX / 2) + "px";
				current.style.top = Math.floor(extraY / 2) + "px";
				current.style.width = (listWidth - extraX) + "px";
				current.style.height = (listHeight - extraY) + "px";

				// fix boxes
				var prevListPage = listPage;
				listPage = capacityX * capacityY;
				elementList.boxes || (elementList.boxes = []);
				if(listPage > prevListPage){
					for(var i = listPage - prevListPage; i > 0; --i){
						var container = document.createElement("div");
						container.style.cssFloat = "left";
						container.style.styleFloat = "left";
						container.style.position = "relative";
						container.style.width = (boxWidth + 2) + "px";
						container.style.height = (boxHeight + 2) + "px";
						container.style.cursor = "default";
						container.onmouseover = boxOver;
						container.onmouseout = boxOut;
						container.onmousemove = boxMove;
						var element = document.createElement("div");
						element.style.position = "absolute";
						element.style.left = "0px";
						element.style.top = "0px";
						element.style.width = boxWidth + "px";
						element.style.height = boxHeight + "px";
						element.style.border = "solid 1px black";
						element.style.backgroundColor = "#E0F0FF";
						element.style.overflow = "hidden";
						container.appendChild(element);
						container.element = element;
						element.box = container;
						var visual = document.createElement("div");
						visual.style.padding = "4px 0 0 0";
						visual.style.textAlign = "center";
						visual.style.verticalAlign = "middle";
						font && (visual.style.fontFamily = font);
						visual.style.fontSize = (boxHeight - 17) + "px";
						visual.style.lineHeight = (boxHeight - 15) + "px";
						visual.style.height = (boxHeight - 12) + "px";
						visual.style.overflow = "hidden";
						visual.innerHTML = "&nbsp;";
						element.visual = visual;
						element.appendChild(visual);
						var number = document.createElement("div");
						number.style.textAlign = "center";
						number.style.fontSize = "7px";
						number.style.lineHeight = "7px";
						number.style.whiteSpace = "nowrap";
						number.innerHTML = "&nbsp;";
						element.number = number;
						element.appendChild(number);
						element.setCode = setCode;
						element.onclick = boxClick;
						element.setCode( listIndex + elementList.boxes.length );
						elementList.appendChild(container);
						elementList.boxes.push(element);
					}
				}
				if(listPage < prevListPage){
					for(var i = prevListPage - listPage; i > 0; --i){
						var element = elementList.boxes.pop();
						element && (elementList.removeChild(element.parentElement));
					}
				}
				
				elementToolbar.panelStatus.updateStatus();
				elementToolbar.buttonPrev.disabled = listIndex <= 0;
				elementToolbar.buttonNext.disabled = listIndex + listPage > maxCode;
				return true;
			};
			
			var onkeypress = function(e){
				e || (e = window.event);
				if(!e){
					return true;
				}
				if(e.keyCode == 8 && (savedListIndex !== undefined || savedListFocus !== undefined)){ // backSpace
					e.cancelBubble = true; /* Microsoft */
					e.stopPropagation && e.stopPropagation(); /* W3C */
					if(savedListIndex === undefined){
						window.top.debug && window.top.debug("keypress: BACKSPACE - returning to focus: " + savedListFocus);
						setFocus(savedListFocus);
					}else{
						window.top.debug && window.top.debug("keypress: BACKSPACE - returning to index: " + savedListIndex);
						setIndex(savedListIndex);
						updateBoxes();
						elementToolbar.buttonPrev.disabled = listIndex <= 0;
						elementToolbar.buttonNext.disabled = listIndex + listPage > maxCode;
						elementToolbar.panelStatus.updateStatus();
					}
					savedListIndex = undefined;
					savedListFocus = undefined;
					return false;
				}
				if(e.keyCode == 13){ // ENTER
					window.top.debug && window.top.debug("keypress: ENTER - creating manual entry input field");
					elementToolbar.panelStatus.onclick();
					return false;
				}
				if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 33){ // left || top || pgUp
					window.top.debug && window.top.debug("keypress: navigate to previous page");
					pagePrev();
					return false;
				}
				if(e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 34 || e.keyCode == 32){ // right || down || pgDn || space
					window.top.debug && window.top.debug("keypress: navigate to next page");
					pageNext();
					return false;
				}
				if(e.keyCode == 36){ // home
					window.top.debug && window.top.debug("keypress: navigate to first page");
					pageFirst();
					return false;
				}
				if(e.keyCode == 35){ // end
					window.top.debug && window.top.debug("keypress: navigate to last page");
					pageLast();
					return false;
				}
				window.top.debug && window.top.debug("keypress: code=" + e.keyCode);
				return true;
			};
			
			savedOnResizeWindow = window.top.document.body.onresize;
			window.top.document.body.onresize = onresize;
			savedOnResizeBody = window.top.onresize;
			window.top.onresize = onresize;
			savedOnKeypress = window.top.onkeyup;
			window.top.document.body.onkeyup = onkeypress;
		
			var current;
			
			current = elementRoot = document.createElement("div");
			current.style.position = "fixed";
			current.style.top = "0";
			current.style.left = "0";
			current.style.width = "100%";
			current.style.height = "100%";
			current.style.backgroundColor = "black";
			document.body.appendChild(elementRoot);
			
			var elementRelative = current = document.createElement("div");
			current.style.position = "relative";
			current.style.top = "0";
			current.style.left = "0";
			current.style.width = "100%";
			current.style.height = "100%";
			current.style.backgroundColor = "yellow";
			elementRoot.appendChild(current);

			current = elementPanel = document.createElement("div");
			current.style.position = "absolute";
			current.style.right = "0";
			current.style.top = "0";
			current.style.width = (sizeMaxWidth) + "px";
			current.style.height = "100%";
			current.style.backgroundColor = "cyan";
			current.setCode = setCode;
			elementRelative.appendChild(current);

			current = elementPanel.focusBox = document.createElement("div");
			current.style.border = "none";
			current.style.borderBottom = "solid 1px black";
			current.style.width = (sizeMaxWidth) + "px";
			current.style.height = (sizeMaxHeight) + "px";
			current.style.backgroundColor = "white";
			current.style.overflow = "hidden";
			current.setCode = setCode;
			elementPanel.appendChild(current);
			
			current = elementPanel.focusBox.visual = document.createElement("div");
			current.style.padding = "4px 0 0 0";
			current.style.textAlign = "center";
			current.style.verticalAlign = "middle";
			current.style.fontSize = Math.round((boxHeight - 17) * zoomFactor) + "px";
			current.style.lineHeight = Math.round((boxHeight - 15) * zoomFactor) + "px";
			current.style.width = (sizeMaxWidth) + "px";
			current.style.height = Math.round((boxHeight - 12) * zoomFactor) + "px";
			current.style.overflow = "hidden";
			current.innerHTML = "&nbsp;";
			elementPanel.focusBox.appendChild(current);
			
			current = elementPanel.focusBox.number = document.createElement("div");
			current.style.textAlign = "center";
			current.style.verticalAlign = "middle";
			current.style.fontSize = "17px";
			current.style.lineHeight = "15px";
			current.style.width = (sizeMaxWidth) + "px";
			current.style.height = Math.round(boxHeight * zoomFactor) + "px";
			current.style.overflow = "hidden";
			current.innerHTML = "&nbsp;";
			elementPanel.focusBox.appendChild(current);

			current = elementPanel.xmlBox = document.createElement("div");
			current.style.textAlign = "center";
			current.style.border = "none";
			current.style.borderBottom = "solid 1px black";
			current.style.width = (sizeMaxWidth) + "px";
			current.style.backgroundColor = "pink";
			current.style.overflow = "hidden";
			current.innerHTML = "&nbsp;";
			elementPanel.appendChild(current);

			current = elementToolbar = document.createElement("div");
			current.style.position = "absolute";
			current.style.left = "0";
			current.style.bottom = "0";
			current.style.width = (clientWidth - sizeMaxWidth) + "px";
			current.style.height = (toolbarHeight) + "px";
			current.style.backgroundColor = "green";
			current.style.overflow = "hidden";
			elementRelative.appendChild(current);
			
			current = elementToolbar.panelLeft = document.createElement("div");
			current.style.cssFloat = "left";
			current.style.styleFloat = "left";
			current.style.width = (toolbarHeight * 4) + "px";
			current.style.height = "100%";
			current.style.backgroundColor = "#AAAAAA";
			elementToolbar.appendChild(current);
			
			current = elementToolbar.buttonPrev = document.createElement("button");
			current.style.width = "100%";
			current.style.height = "100%";
			current.style.verticalAlign = "middle";
			current.style.fontSize = Math.round(toolbarHeight / 2) + "px";
			current.style.lineHeight = Math.round(toolbarHeight / 2) + "px";
			current.innerHTML = "&lt;&lt;&lt;";
			current.onclick = pagePrev;
			current.ondblclick = pageFirst;
			current.title = "Previous page (doubleclick: first page)";
			elementToolbar.panelLeft.appendChild(current);
			
			current = elementToolbar.panelRight = document.createElement("div");
			current.style.cssFloat = "right";
			current.style.styleFloat = "right";
			current.style.width = (toolbarHeight * 4) + "px";
			current.style.height = "100%";
			current.style.backgroundColor = "#AAAAAA";
			elementToolbar.appendChild(current);

			current = elementToolbar.buttonNext = document.createElement("button");
			current.style.width = "100%";
			current.style.height = "100%";
			current.style.verticalAlign = "middle";
			current.style.fontSize = Math.round(toolbarHeight / 2) + "px";
			current.style.lineHeight = Math.round(toolbarHeight / 2) + "px";
			current.innerHTML = "&gt;&gt;&gt;";
			current.onclick = pageNext;
			current.ondblclick = pageLast;
			current.title = "Next page (doubleclick: last page)";
			elementToolbar.panelRight.appendChild(current);

			current = elementToolbar.panelStatus = document.createElement("div");
			current.style.padding = "0";
			current.style.margin = "0";
			current.style.align = "center";
			current.style.textAlign = "center";
			current.style.height = "100%";
			current.style.fontSize = toolbarHeight + "px";
			current.style.lineHeight = toolbarHeight + "px";
			current.style.color = "white";
			current.style.backgroundColor = "blue";
			current.style.overflow = "hidden";
			current.updateStatus = function(){
				if(this.input){
					this.removeChild(this.input);
					this.input = null;
				}
				if(!this.status){
					var status = document.createElement("span");
					this.appendChild(status);
					this.status = status;
					setTimeout(function(){window.top.document.body.onkeyup = onkeypress;}, 50); // to prevent input back
				}
				this.status.innerHTML = listIndex + " &mdash; " + (listIndex + listPage - 1);
			};
			current.onclick = function(){
				if(this.input){
					return;
				}
				if(this.status){
					this.removeChild(this.status);
					this.status = null;
					window.top.document.body.onkeyup = function(){return true};
				}
				var input = document.createElement("input");
				input.setAttribute("type", "text");
				input.value = String(listIndex);
				input.style.width = "auto";
				input.style.height = "100%";
				input.style.padding = "0";
				input.style.margin = "0";
				input.style.border = "none";
				input.style.textAlign = "center";
				input.style.verticalAlign = "middle";
				input.style.fontSize = (toolbarHeight - 10) + "px";
				input.style.lineHeight = toolbarHeight + "px";
				input.style.color = "white";
				input.style.backgroundColor = "green";
				input.style.backgroundColor = "blue";
				input.onblur = function(){
					elementToolbar.panelStatus.updateStatus();
				};
				input.onkeyup = function(e){
					e || (e = window.event);
					if(!e){
						return true;
					}
					if(e.keyCode == 27){ // esc
						window.top.debug && window.top.debug("Escape - cancel manual entry");
						elementToolbar.panelStatus.updateStatus();
					}
					if(e.keyCode == 13){ // enter
						window.top.debug && window.top.debug("Enter - apply manual entry");
						savedListIndex = listIndex;
						setIndex(this.value);
						updateBoxes();
						elementToolbar.buttonPrev.disabled = listIndex <= 0;
						elementToolbar.buttonNext.disabled = listIndex + listPage > maxCode;
						elementToolbar.panelStatus.updateStatus();
					}
					return true;
				};
				this.input = input;
				this.appendChild(input);
				input.focus();
				input.createTextRange && input.createTextRange().select();
			};
			elementToolbar.appendChild(current);

			current = elementList = document.createElement("div");
			current.style.position = "absolute";
			current.style.left = "0";
			current.style.top = "0";
			current.style.width = (clientWidth - sizeMaxWidth) + "px";
			current.style.height = (clientHeight - boxHeight) + "px";
			current.style.backgroundColor = "white";
			current.style.overflow = "hidden";
			elementRelative.appendChild(current);
			
			setIndex(Math.max(0, Math.min(maxCode, listIndex)));
			setFocus(Math.max(0, Math.min(maxCode, listFocus)));
		
			onresize();
		}
	},
	//
	baseUrl : undefined,
	pageStart : 0,
	pageSize : 256,
	nav : undefined,
	target : undefined,
	elements : undefined,
	title : undefined,
	shiftX : 0,
	
	// standard routine
	createCookie: function(name,value,days) {
		window.top.debug && window.top.debug("cookie write: name=" + name + ", days=" + days + ", value=" + value);
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
		window.top.debug && window.top.debug("cookie read: name=" + name);
		name += '=';
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
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
	
	// standard routine v2.0
	parseUrlEncoded: function( url ) {
		var result = {};
		var array = url.split('&');
		for( var i in array ){
			var current = array[i];
			var index = current.indexOf('=');
			if( index > 0 ){
				var key = current.substring(0, index);
				var value = decodeURIComponent(current.substring(index+1));
				var ready = result[ key ];
				if( ready == undefined ){
					result[ key ] = value;
				}else{
					if( Array.isArray( ready ) ){
						ready.push( value );
					}else{
						result[ key ] = [ ready, value ];
					}
				}
			}
		}
		return result;
	},
	
	// standard routine
	// requires: parseUrlEncoded
	extractUrlParameters: function( url, char, parameters ) {
		var index = url.indexOf(char);
		if( index >= 0 ){
			var additional = this.parseUrlEncoded( url.substring(index+1) );
			for( var i in additional ){
				(parameters[i] == undefined) && (parameters[i] = additional[i]);
			}
			url = url.substring( 0, index );
		}
		return url;
	},

	// standard routine v2.0
	calculateObjectCoordinates: function(target, client){
		var x = target.offsetLeft, y = target.offsetTop;
		window.top.debug && window.top.debug("coordinates: object=" + target.nodeName + ", c=" + x + ":" + y);
		client && (client = target.ownerDocument.documentElement);
		for(var o = target; (o.style.position != 'fixed' || (client = undefined)) && (o != client || (client = undefined) || true) && (o = o.offsetParent); ){
			x += o.offsetLeft - (client ? o.scrollLeft : 0);
			y += o.offsetTop - (client ? o.scrollTop : 0);
			window.top.debug && window.top.debug("coordinates: object=" + o.nodeName + ", c=" + x + ":" + y + ", o=" + o.offsetLeft + ":" + o.offsetTop + ", s=" + o.scrollLeft + ":" + o.scrollTop);
		}
		return {x: client ? x - client.scrollLeft : x, y: client ? y - client.scrollTop : y};
	},

	fixHref : function(url, replace) {
		(url != document.location.href) && ((!replace && (window.document.location.href = url))  || window.document.location.replace(url));
	}
} // <%/FORMAT%>