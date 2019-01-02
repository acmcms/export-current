// <%FORMAT: 'js' %>
(window.Utils || (Utils = parent.Utils) || (Utils = {})) &&
Utils.Comms || (parent.Utils && (Utils.Comms = parent.Utils.Comms)) || (
	// v 2.0g
	//
	// -= MyX =-
	//

Utils.Comms = {
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
			"function" == typeof value && (value = value.call(parameters));
			if( value == undefined || value == ""){
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

	// callback(document)
	/**
	 * frame is: zoom=screen
	 */
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

	/**
	 * frame is: zoom=screen
	 */
	createFrameStatic: function(target, html){
		target && target.canvas && (target = target.canvas);
		var container = target.ownerDocument.createElement("iframe");
		container.setAttribute("frameborder", "0");
		container.style.cssText = "padding:0;margin:0;border:0;height:100%;width:100%;overflow:hidden;background-color:white;color:black";
		target.appendChild(container);
		with(container.contentWindow){
			document.open("text/html", true);
			document.write(html);
			document.close();
		}
		// method: same as in createFrame - doesn't work with IE
		// method: DOM creation - doesn't work with webkit
		top.debug && top.debug("frameStatic: created");
		return container;
	},


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
		return "Utils.Comms";
	}

},
/**
 * <standard>
 */
Array.isArray || (Array.isArray = function(testObject) {
	return testObject && !(testObject.propertyIsEnumerable('length')) && (typeof testObject === 'object') && (typeof testObject.length === 'number');
}),
/**
 * </standard>
 */
Utils.Comms) // <%/FORMAT%>
