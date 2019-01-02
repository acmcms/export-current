(// <%FORMAT: 'js' %>

// v 1.8s
//
//	-= MyX =-
//
//	Standard functions to insert in other places. Yes - the purpose of this file 
//	is to contain current implementations of some generic methods used in other
//	classes by copying those methods there.
//

// standard routine 1.0
window.inArray || (inArray = function(array, value) {
	for (var i = array.length - 1; i >= 0; --i) {
		if (array[i] === value) {
			return true;
		}
	}
	return false;
}),
// standard routine 2.0
Array.isArray || (Array.isArray = function(testObject) {
	return testObject && !(testObject.propertyIsEnumerable('length')) && (typeof testObject === 'object') && (typeof testObject.length === 'number');
}),
//standard routine 1.0
String.prototype.trim || (String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/gm,"");
}),
//standard routine 1.0
String.prototype.ltrim || (String.prototype.ltrim = function() {
	return this.replace(/^\s+/g,"");
}),
//standard routine 1.0
String.prototype.rtrim || (String.prototype.rtrim = function() {
	return this.replace(/\s+$/g,"");
}),
//standard routine 1.0
Array.prototype.forEach || (Array.prototype.forEach = function(fn /*, thisObject*/) {
	var len = this.length >>> 0;
	var thisObject = arguments[1];
	for(var i = 0; i < len; ++i) {
		(i in this) && (
			thisObject === undefined || thisObject === null
				? fn(this[i])
				: fn.call(thisObject, this[i])
		);
	}
}),
document.getElementsByClassName || (document.getElementsByClassName = function(c) {
	var r = new RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)"),
		e = document.getElementsByTagName('*'),
		l = e.length,
		a = [],
		i = 0,
		c;
	for (; i < l; ++i) {
		r.test((c = e[i]).className) && a.push(c);
	}
	return a;
}),
window.Standard || (Standard = parent.Standard) || (Standard = {
	//
	// Standard routines. Actually, not intended to be included and used directly - it is just a 
	// container for generic standard routines which could be copied and used in scripts.

	
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
	
	// standard routine
	// requires: createCookie
	eraseCookie: function(name){
		this.createCookie(name, "", -1);
	},

	/**
	 * @Description Builds URL from given URL base, parameters type and parameters map
	 * 
	 * @Example 
	 * 		buildUrl(
	 * 			buildUrl( "list.htm", '?', { 
	 * 				mode : 'link', 
	 * 				path : '/acmcms/' 
	 *			}),
	 * 			'#',
	 * 			{
	 * 				scroll : getScrollCoordinates(document)
	 * 			}
	 * 		);
	 */
	// standard routine v2.0
	// requires Array.isArray
	buildUrl: function( url, type, parameters ){
		var params = "";
		for( var i in parameters ){
			var value = parameters[i];
			if( value === undefined || value === ""){
				continue;
			}
			if( Array.isArray( value ) ){
				for( var j = 0; j < value.length; j++ ){
					var partial = value[j];
					params && (params += '&');
					params += i + '=' + encodeURIComponent(partial);
				}
				continue;
			}
			params && (params += '&');
			params += i + '=' + encodeURIComponent(value);
		}
		return params ? url + type + params : url;
	},

	/**
	 * @Description Parses url-encoded string.
	 * 
	 * @Returns Hash with parameters
	 * 
	 * @Example parseUrlEncoded('?key=123&name=myx') will return equivalent of: {
	 *          key : '123', name : 'myx' }
	 */ 
	// standard routine v2.0
	// requires Array.isArray
	parseUrlEncoded: function( url ) {
		var result = {};
		var array = url.split('&');
		for( var i = 0; i < array.length; ++i ){
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
	
	/**
	 * @Description Parses specified type URL parameters and removes that part from returned URL.
	 * 
	 * @Returns new URL
	 * 
	 * @Example
	 * 		var url = location.href, params = {};
	 * 		url = extractUrlParameters( url, '?', params );
	 */
	// standard routine v2.0
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

	/**
	 * @Description attaches an event handler callback to a given object. 
	 * 'type' is either string, either an array of strings.
	 */
	// standard routine, v2.4
	addEvent: function( obj, type, fn ) {
		var ffn = ((typeof fn == 'function') ? fn : new Function(fn));
		if(type.forEach){
			type.forEach(function(element){
				Standard.addEvent(obj,element,ffn);
			});
			return;
		}
		var debug = top.debug && (this + ".addEvent('" + (obj.nodeName || obj) + "', '" + type + "'): ");
		if(obj.addEventListener){
			obj.addEventListener( type, ffn, false );
			debug && top.debug(debug + "DOM way!");
		}else
		if(obj.attachEvent){
			var k = "__msieh_" + type;
			var f = ffn[k] || (ffn[k] = function(e){
				ffn.call( obj, e || window.event );
			});
			obj.attachEvent("on"+type, f);
			debug && top.debug(debug + "IE6 way!");
		}else{
			var k = "on" + type,
				func = obj[k];
			if(!func || !func.handlers){
				var save = func;
				func = obj[k] = function(e){
					e || (e = window.event);
					for(var i = 0; i < func.handlers.length; ++i){
						func.handlers[i].call(obj,e);
					}
				};
				func.handlers = save ? [save] : [];
			}
			func.handlers.push(ffn);
			debug && top.debug(debug + "Classic way!");
		}
	},

	/**
	 * @Description Fires an event on a given object thus triggering all attached
	 * 		event handlers
	 */
	// standard routine 2.1
	fireEvent: function( obj, event ) {
		var isName = typeof event === "string";
		if(obj.dispatchEvent && document.createEvent){ // W3C
			var evt = isName
				? (evt = document.createEvent("HTMLEvents"), evt.initEvent(event, false, true), evt)
				: event;
			return !obj.dispatchEvent(evt);
		}
		if(obj.fireEvent && document.createEventObject){ // IE
			return obj.fireEvent("on" + (isName ? event : event.type), isName ? document.createEventObject() : event);
		}
		top.debug && top.debug(this + ".fireEvent: failover to worst case scenario, obj=" + obj.nodeName + ", event=" + (isName ? event : event.type));
		var k = "on" + (isName ? event : event.type);
		obj[k] && obj[k](isName ? null : event);
	},

	/**
	 * @Description Removes event handler
	 */
	// standard routine 1.1
	removeEvent: function( obj, type, ffn ) {
		if(type.forEach){
			type.forEach(function(element){
				Standard.removeEvent(obj,element,ffn);
			});
			return;
		}
		var debug = top.debug && (this + ".removeEvent('" + (obj.nodeName || obj) + "', '" + type + "'): ");
		if(obj.removeEventListener){
			obj.removeEventListener( type, ffn, false );
			debug && top.debug(debug + "DOM way!");
		}else
		if(obj.detachEvent){
			var k = "__msieh_" + type;
			obj.detachEvent("on"+type, ffn[k]);
			debug && top.debug(debug + "IE6 way!");
		}else{
			var h = obj["on" + type].handlers;
			if(h){
				for(var i = h.length - 1; i >= 0; --i){
					if(h[i] === ffn){
						h.splice(i, 1);
					}
				}
			}
			debug && top.debug(debug + "Classic way!");
		}
	},

	// standard routine v2.0
	calculateObjectCoordinates: function(target, client){
		var x = target.offsetLeft, y = target.offsetTop;
		// window.top.debug && window.top.debug("coordinates: object=" + target.nodeName + ", c=" + x + ":" + y);
		client && (client = target.ownerDocument.documentElement);
		for(var o = target; (o.style.position != 'fixed' || (client = undefined)) && (o != client || (client = undefined) || true) && (o = o.offsetParent); ){
			x += o.offsetLeft - (client ? o.scrollLeft : 0);
			y += o.offsetTop - (client ? o.scrollTop : 0);
			// window.top.debug && window.top.debug("coordinates: object=" + o.nodeName + ", c=" + x + ":" + y + ", o=" + o.offsetLeft + ":" + o.offsetTop + ", s=" + o.scrollLeft + ":" + o.scrollTop);
		}
		return {x: client ? x - client.scrollLeft : x, y: client ? y - client.scrollTop : y};
	},

	// <<< Utils.Comms
	// callback(document)
	createFrame: function(target, url, callback){
		target && target.canvas && (target = target.canvas);
		var html = target.ownerDocument.createElement("div");
		// in IE7 - programatically set onload frame property doesn't work!!!
		html.innerHTML = '<iframe src="javascript:parent.eval(\'\')" onload="this.loaded()" style="padding:0;margin:0;border:0;height:100%;width:100%;overflow:hidden" frameborder="0" leftmargin="0" topmargin="0" rightmargin="0" bottommargin="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>'; 
		var ctn = html.firstChild;
		ctn.loaded = function(){
			var w = ctn.contentWindow, 
				content = (w || ctn.contentDocument || ctn).document,
				href = content && content.location && content.location.href || w && w.location.href;
			if(!href || href.indexOf("javascript:parent.eval(") == 0 || // initial
					href == "about:blank"){ // this is for Chrome
				return;
			}
			top.debug && top.debug("frame: loaded, src=" + href);
			callback && (callback(content), callback = null);
		};
		target.appendChild(ctn);
		ctn.src = url;
		top.debug && top.debug("frame: created, url=" + url);
		return ctn;
	},

	// <<< Utils.Comms
	// callback(document)
	createFormSubmissionBuffer: function(form, url, callback){
		url || null("Action is undefined!");
		var id = 'bfr' + (String(new Date().getTime()) + Math.ceil(Math.random() * 10000));
		var html = form.ownerDocument.createElement("div");
		// in IE7 - programatically set onload frame property doesn't work!!!
		html.innerHTML = '<iframe src="javascript:parent.eval(\'\');" onload="this.loaded()" name="'+id+'" id="'+id+'" style="position:absolute;top:-10px;left:-10px;width:1px;height:1px;display:none"></iframe>'; 
		var container = html.firstChild;
		container.loaded = function(){
			var window = this.contentWindow;
			var content = (window || this.contentDocument || this).document;
			if(window.location.href.indexOf("javascript:parent.eval(") == 0){
				return;
			}
			top.debug && top.debug("submitBuffer: buffer loaded, src=" + window.location.href + ", id=" + id);
			// XMLDocument is for IE which formats XML
			callback && callback(content.XMLDocument || content);
			this.parentNode.removeChild(this);
		};
		form.ownerDocument.body.appendChild(container);
		// another time for webkits
		container.setAttribute("id", container.id = id);
		// another time for webkits
		container.setAttribute("name", container.name = id);
		top.debug && top.debug("submitBuffer: form submission buffer created, action=" + url + ", id=" + id);
		form.setAttribute("method", form.method = "POST");
		form.setAttribute("enctype", form.enctype = "multipart/form-data");
		form.setAttribute("action", form.action = url);
		form.setAttribute("target", form.target = id);
		return container;
	},

	/**
	 * @Description Converts real-life response codes to meaningful ones.
	 * 
	 * @Returns 200, 404 or unknown error code which is illegal.
	 */
	// standard routine 2.1
	xmlHttpStatus : function(status){
		switch(status || 0){
		case 200:	// normal OK status
		case 0:		// status == undefined for local files on Konqueror
			return 200;
		case 404:	// http:// not found everywhere
		case -1100:	// file:// not found on Safari3 on Mac
		case 204:	// http:// not found (empty) everywhere
		case 1223:	// 204 - IE special %)
		case 301:	// redirect, kinda 'not found' then
		case 302:	// redirect, kinda 'not found' then
			return 404;
		}
		top.debug && top.debug(this + ".xmlHttpStatus: unknown status code: " + status);
		return status;
	},

	/**
	 * @Description synchronous query for text/plain data. 
	 * 		'callback' parameter is optional, should have 
	 * 		'function(code, text)' signature and will be 
	 * 		called if passed.
	 * 
	 * @Returns string or null.
	 */
	// standard routine 2.2
	queryPlain: function(url, callback){
		var loader = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		top.debug && top.debug(this + ".queryPlain: loading: " + url);
		try{ // FF produces exceptions on 404 errors %<
			loader.open("GET", url, false);
			/**
			 *	to hide FF errors
			 *	not supported in IE6 though not required anywhere but FF
			 *	not an XML
			 */
			loader.overrideMimeType && loader.overrideMimeType("text/plain;charset=utf-8");
			loader.send(null);
		}catch(e){
			top.debug && top.debug(this + ".queryPlain: error loading (looks like FF): " + url + ", error=" + e);
			return null;
		}
		var status = this.xmlHttpStatus(loader.status);
		callback && callback(
				status, 
				loader.responseText
			);
		return status == 200 
			? loader.responseText 
			: (
				status == 404 || 
					alert("error loading: " + url + ", status=" + status + ", response=" + loader.responseText), 
				null
			);
	},
	
	/**
	 * @Description AKA 'sjax' - synchronous query for XML data. 
	 * 		'callback' parameter is optional, should have 
	 * 		'function(code, element[, text])' signature and will be 
	 * 		called if passed.
	 * 
	 * @Returns XML element or null.
	 */
	// standard routine 2.3
	queryXml: function(url, callback){
		var loader = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		top.debug && top.debug(this + ".queryXml: loading: " + url);
		try{ // FF produces exceptions on 404 errors %<
			loader.open("GET", url, false);
			/**
			 *	to hide FF errors
			 *	not supported in IE6 though not required anywhere but FF
			 *	XML exactly
			 */
			loader.overrideMimeType && loader.overrideMimeType("text/xml;charset=utf-8");
			loader.send(null);
		}catch(e){
			top.debug && top.debug(this + ".queryXml: error loading (looks like FF): url=" + url + ", error=" + (e.message || e));
			return null;
		}
		var status = this.xmlHttpStatus(loader.status);
		callback && callback(
				status, 
				loader.responseXML && loader.responseXML.documentElement,
				loader.responseText
			);
		return status == 200 
			? loader.responseXML && loader.responseXML.documentElement 
			: (
				status == 404 || 
					alert("error loading: " + url + ", status=" + status + ", response=" + loader.responseText), 
				null
			);
	},

	/**
	 * @Description AKA 'ajax' - asynchronous query for XML data. 
	 * 		'callback' parameter should have 'function(code, element[, text])' 
	 * 		signature and will be called when query is completed.
	 * 
	 * 
	 * @Returns an object with abort() method.
	 */
	// standard routine 2.3
	queryXmlAsync: function(url, callback, data, method){
		var o = {
			owner	: this,
			updating: false,
			loader	: window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
			url		: undefined,
			abort	: function(){
				if(this.updating){
					this.updating = false;
					this.loader.abort();
					this.loader = null;
				}
			}
		};
		if(!o.loader){
			return false;
		}
		top.debug && top.debug(this + ".queryXmlAsync: init, src=" + url);
		o.loader.onreadystatechange = function(){
			with(o){
				if(loader === null || loader.readyState !== 4) return;
				updating = false;
				var status = owner.xmlHttpStatus(loader.status);
				top.debug && top.debug(owner + ".queryXmlAsync: done, status=" + status + ", url=" + url);
				callback && callback(
					status, 
					loader.responseXML && loader.responseXML.documentElement,
					loader.responseText
				);
				loader = null;
			}
		};
		o.updating = new Date();
		var parameters = {};
		url = this.extractUrlParameters(url, '?', parameters);
		if(data){
			for(var i in data){
				parameters[i] = data[i];
			}
		}
		if(method && /post/i.test(method)){
			o.url = this.buildUrl(url, '?', {___rnd_req : o.updating.getTime()});
			top.debug && top.debug(this + ".queryXmlAsync: start, method=POST, url=" + o.url);
			o.loader.open("POST", o.url, true);
			o.loader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			o.loader.send(this.buildUrl('', '', parameters));
		} else {
			parameters.___rnd_req = o.updating.getTime();
			o.url = this.buildUrl(url, '?', parameters);
			top.debug && top.debug(this + ".queryXmlAsync: start, method=GET, url=" + o.url);
			o.loader.open("GET", o.url, true);
			o.loader.send(null);
		}
		return o;
	},
	
	toString : function(){
		return "Standard";
	},

	// just to allow commas everywhere above
	fake : undefined
})) // <%/FORMAT%>