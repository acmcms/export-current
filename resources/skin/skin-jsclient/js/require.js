// <%FORMAT: 'js' %>
window.require || (
	// v 1.5x
	//
	//	-= MyX =-
	//
	// Usage like this:
	//
	//		require( "[<namespace>,...]<class>" );
	//				Returns loaded class reference.
	//
	//				example: var Layout = require("Layouts.Layout");
	//				example: var Coordinates = require("Utils.Coordinates");
	//
	//		require( "[<namespace>,...]<class>", callbackFn );
	//				Enqueues asynchronous request for a loaded class. A function 
	//				specified by 'callbackFn' parameter will be executed when class
	//				is ready or when request failed. Class reference or undefined
	//				will be passed to callback function as a first and only argument.
	//
	//				example: require("Features.PopHint", function(o){ o.initAllElements(document); });
	//
	//		--------------------------------------------------------------------
	//
	//		require.source( <textResourceFileName>[, callback ] );
	//				Resource character source will be an argument for the callback.
	//				Resources are cached by 'require' - use Utils.Comms to dynamically query the server.
	//
	//				example: require.source("data/index.jsld", function(layoutSource){
	//				} );
	//
	//		--------------------------------------------------------------------
	//
	//		require.script( <javaScriptFileName>[, callback ] );
	//				Script execution result will be an argument for the callback.
	//				Script will be executed only once in every window where this method is called.
	//				Script sources will be searched in parent windows and cached in current window.
	//				Scripts are cached by 'require' - use Utils.Comms to dynamically query the server.
	//				Be sure not to initialize global variables in you scripts.
	//
	//				example: require.script("Layouts/Layout.js", function(Layout){
	//				});
	//
	//		--------------------------------------------------------------------
	//
	//		requireSource( <textResourceFileName>[, dynamic ] );
	//				Returns resource character source.
	//				Resources are cached by 'require' - use Utils.Comms to dynamically query the server.
	//
	//				example: var layoutSource = requireSource("data/index.jsld");
	//
	//		--------------------------------------------------------------------
	//		requireScript( <javaScriptFileName>[, dynamic ] );
	//				Returns script execution result.
	//				Script will be executed only once in every window where this method is called.
	//				Script sources will be searched in parent windows and cached in current window.
	//				Scripts are cached by 'require' - use Utils.Comms to dynamically query the server.
	//				Be sure not to initialize global variables in you scripts.
	//
	//				example: var Layout = requireScript("Layouts/Layout.js");
	//
	//		--------------------------------------------------------------------
	//
	//		require.style( <cssFileName>[, callback ] );
	//				Applies style to this window.
	//				Style will be applied only once in every window where this method is called.
	//				Style sources will be searched in parent windows and cached in current window.
	//				example: require.style("controls/menu/menu.css");
	//				example: require.style("controls/menu/menu.css", function(x){x.destroy()});
	//
	//			The callback argument will have following properties:
	//				name, // value, name
	//				style, // value, actual style element
	//				destroy, // method, destroys style object, removes stylesheet from document
	//				release, // method, when last reference released destroy() called automatically
	//
	//			In case of failure the callback argument is NULL.
	//		--------------------------------------------------------------------
	//
	//		will search scripts in own folder + "/js", will search styles in own folder + "/css".
	//		if require's path ends with "/js/" than 'own' path will be one folder up.
	//

require = document.require = function(className, cb){
	var t = arguments.callee.impl;
	top.debug?.(t + ": require: " + className);
	/**
	 * 	return eval("window." + className) || ...;
	 * 	no need - eventually does the same thing
	 */
	var names = className.split(".");
	for(var i = 0, r = t.delegate(), target = t.scope, parent = r.scope, script = "", name, v; ; ++i){
		name = names[i];
		script += (script ? "/" : "") + name;
		if(i == names.length - 1){
			v = target[name];
			if(v) return v;
			v = (parent && parent != target && parent[name]);
			if(v) return target[name] = v;
			if(cb) {
				return r.requireScript(script + ".js", function(v){
					target[name] = v;
					cb(v);
				});
			}
			return target[name] = r.requireScriptSync(script + ".js");
		}
		target[name] || (
			target[name] = (
				/* search in parent */
				(parent && parent != target && parent[name]) ||
				/* create empty package */
				(top.debug?.(t + ": createPackage for: " + script), r.createPackage())
			)
		);
		target = target[name];
		parent && (parent = parent[name]);
	}
},
/* TODO: remove 'requireSource' */
requireSource = function(name, dynamic){
	top.debug?.(require.impl + ": requireSource: " + name + ", dynamic=" + dynamic);
	return require.impl.requireSourceSync(name, dynamic);
},
/* TODO: remove 'requireScript' */
requireScript = function(name, dynamic){
	top.debug?.(require.impl + ": requireScript: " + name + ", dynamic=" + dynamic);
	return require.impl.requireScriptSync(name, dynamic);
},
require.source = document.require.source = function(name, cb){
	top.debug?.(require.impl + ": require.source: " + name + ", cb=" + cb);
	return require.impl.requireSource(name, cb);
},
require.script = document.require.script = function(name, cb){
	top.debug?.(require.impl + ": require.script: " + name + ", cb=" + cb);
	if(name.push){
		var i = 0, c = name.length, l = c, r = [], f = function(i, v){
			r[i] = v;
			if(--l) return;
			cb?.(r);
		};
		for(; i < c; ++i){
			require.impl.requireScript(name[i], f.bind(null,i));
		}
		return;
	}
	return require.impl.requireScript(name, cb);
},
/* TODO: remove 'requireStyle' */
requireStyle = require.style = document.require.style = function(name, cb){
	top.debug?.(require.impl + ": require.style: " + name + ", cb=" + cb);
	return require.impl.requireStyle(name, cb);
},
require.impl = {
	/**
	 * yes - reload always, otherwise impossible to debug
	 */
	rnd : 'jrq' /* (new Date()).getTime() */,
	/**
	 * associated with particular window
	 */
	scope : window,
	pending : {},
	styleSource : {},
	styleActive : {},
	scriptSource : {},
	scriptResult : {},
	stylePath : undefined,
	scriptPath : undefined,
	base : "",
	getRequirePath : function(){
		with(this.scope){
			var scripts = document.getElementsByTagName("script");
			for(var i = 0; i < scripts.length; ++i){
				var src = scripts[i].getAttribute("src");
				var path = src && src.match(/^(.*?\/?)require.js/);
				if(path?.[1]){
					return path[1];
				}
			}
			// not found - maybe directly inserted?
			var r = parent.require != require && parent.require || 
				parent.parent.require != require && parent.parent.require || 
				top.require != require && top.require || top.opener.require;
			return r && r.impl && r.impl != this ? r.impl.getRequirePath() : "/client/js/";
		}
	},
	getStylePath : function(){
		if(!this.stylePath){
			var path = this.getRequirePath();
			this.stylePath = (path == "js/") 
				? "css/" : 
				(path.indexOf("/js/") == path.length - 4) 
					? path.substr(0,path.length - 4) + "/css/" 
					: path + "css/";
		}
		return this.stylePath;
	},
	getScriptPath : function(){
		if(!this.scriptPath){
			var path = this.getRequirePath();
			this.scriptPath = (path == "js/" || path.indexOf("/js/") == path.length - 4) ? path : path + "js/";
		}
		return this.scriptPath;
	},
	loadResult : function(u, l){
		return (l.status == 200 || !l.status) // status == undefined for local files on Konqueror 
			? l.responseText 
			: (l.status == -1100 || // file:// not found on Safari3 on Mac
				l.status == 404 || // http:// not found everywhere
				l.status == 204 || // http:// not found (empty) everywhere
				l.status == 1223 || // 204 - IE special %)
				l.status == 301 || // redirect, kinda 'not found' then
				alert("error loading: " + u + ", code=" + l.status + ", response=" + l.responseText), 
				null);
	},
	load : function(u, cb){
		var t = this, s = t.scope,
			l = s.XMLHttpRequest ? new s.XMLHttpRequest() : new s.ActiveXObject("Microsoft.XMLHTTP");
		if(cb){
			var p = t.pending, e = p[u];
			if(e){
				p[u] = (function(a,b,r){
					a(r); 
					b(r);
				}).bind(null, e, cb);
				top.debug?.(t + ": pending: " + u);
				return;
			}
			p[u] = cb;
			l.onreadystatechange = function(){
				if(!l || l.readyState !== 4) return;
				top.debug?.(t + ": loaded: " + u + ", status=" + l.status);
				p[u](t.loadResult(u, l));
				delete p[u];
				l = 0;
			};
		}
		top.debug?.(t + ": loading: " + u);
		try{ // FF produces exceptions on 404 errors %<
			l.open("GET", u + (t.rnd ? (u.indexOf("?") == -1 ? "?" : "&") + t.rnd : ""), !!cb);
			/**
			 *	to hide FF errors
			 *	not supported in IE6 though not required anywhere but FF
			 *	not an XML
			 */
			l.overrideMimeType && l.overrideMimeType("text/plain;charset=utf-8");
			l.send(null);
		}catch(e){
			top.debug?.(t + ": error loading (looks like FF): " + u + ", error=" + e);
		}
		return !cb && t.loadResult(u, l);
	},
	delegate : function(){
		var s = this.scope;
		return ((s.parent != s && (s.parent.require || s.parent.parent.require)) || 
			/**
			 * we want popup windows to use opener's script cache, however there could be an 
			 * opener which is already closed...
			 */
			s.opener && (function(){try{return s.opener.require || s.opener.top.require}catch(e){}})() ||
			s.require).impl;
	},
	createPackage : function(){
		var t = this, r = t.delegate();
		return r == t ? t.scope.eval('({})') : r.createPackage();
	},
	requireSourceSync : function(name, dynamic){
		// @<debug>
		if(!name){
			throw "name argument is required!";
		}
		// @</debug>
		with(this){
			var r, url = name.charAt(0) === '/' ? base + name : name.lastIndexOf('://',10) !== -1 ? name : getScriptPath() + name;
			return dynamic 
				? load(url)
				/**
				 * cached version
				 */
				: (scriptSource[name] || 
					(scriptSource[name] = 
						/**
						 *  double-parent check is for FRAMESETs 
						 */
						(r = delegate()) != this 
							? r.requireSourceSync(name) 
							: load(url)
					)
				);
		}
	},
	requireScriptSync : function(name, dynamic){
		var t = this, c = t.scriptResult;
		if(!dynamic && c[name]){
			return c[name].value;
		}
		var code = t.requireSourceSync(name);
		if(!code){
			top.debug?.(t + ": not found: " + name);
			return null;
		}
		try{
			return (c[name] = { 
				value : t.scope.eval(code.match("^{") == '{' ? '('+code+'\n)' : code) 
			}).value;
		}catch(e){
			throw new Error(t + ":\nerror running: " + name + ":\n" + (e.name || e) + " #" + (e.lineNumber || '?') + ": " + (e.message || e.description) + "\r\n" + (e.stack || '-- no stack --') + "\r\n\r\n" + code);
		}
	},
	requireScript : function(name, cb){
		var t = this, c = t.scriptResult, r = c[name];
		if(r){
			return cb?.(r.value);
		}
		return t.requireSource(name, function(s){
			if(!s){
				top.debug?.(t + ": not found: " + name);
				return cb?.(null);
			}
			try{
				r = (c[name] = { 
					value : t.scope.eval(s.match("^{") == '{' ? '('+s+'\n)' : s) 
				}).value;
			}catch(e){
				throw new Error(t + ":\nerror running: " + name + ":\n" + (e.name || e) + " #" + (e.lineNumber || '?') + ": " + (e.message || e.description) + "\r\n" + (e.stack || '-- no stack --') + "\r\n\r\n" + s);
			}
			return cb?.(r);
		});
	},
	requireSource : function(name, cb){
		// @<debug>
		if(!name){
			throw "name argument is required!";
		}
		// @</debug>
		var t = this, c = t.scriptSource, r = c[name];
		if(r){
			return cb?.(r);
		}
		if((r = t.delegate()) !== t){
			return r.requireSource(name, function(s){
				c[name] = s;
				return cb?.(s);
			});
		}
		var u = name.charAt(0) === '/' ? t.base + name : name.lastIndexOf('://',10) !== -1 ? name : t.getScriptPath() + name;
		return t.load(u, function(s){
			c[name] = s;
			return cb?.(s);
		});
	},
	applyStyle : function(name, source){
		// +Safari, +Opera9, +FF3, +IE6, +IE7
		var t = this, 
			document = t.scope.document,
			style = document.createElement("style"),
			root = document.documentElement || document;
			
		style.setAttribute("type", "text/css");
		style.setAttribute("source", name);
		style.refLeft = 1;
		style.styleSheet
			? style.styleSheet.cssText = source
			: style.appendChild(document.createTextNode(source));

		(root = (root.firstElementChild || root.firstChild || root)).insertBefore(style, root.firstChild);
		return {
			name : name,
			style : style,
			release : function(){
				var left = --this.style.refLeft;
				top.debug?.("style[" + this.name + "], release, refs left: " + left);
				// "> 0" yes, want to get errors from excessive release() calls
				left > 0 || this.destroy();
			},
			destroy : function(){
				t.styleActive[this.name] == this && (t.styleActive[this.name] = null);
				var s = this.style;
				if(s.rules) while(s.rules.length){
					s.removeRule();
				}
				s.cssRules && (s.cssRules = []);
				s.parentNode?.removeChild(s);
				this.style = null;
				this.destroy = function(){
					throw new Error("[" + this.name + "] The style is already destroyed!");
				};
			}
		};
	},
	loadStyle : function(name, cb){
		var t = this, c = t.styleSource, r = c[name];
		if(r) return cb?.(r);
		if((r = t.delegate()) !== t){
			return r.loadStyle(name, function(s){
				c[name] = s;
				return cb?.(s);
			});
		}
		return t.load(name.charAt(0) === '/' ? t.base + name : name.lastIndexOf('://',10) !== -1 ? name : t.getStylePath() + name, function(s){
			c[name] = s;
			return cb?.(s);
		})
	},
	requireStyle : function(name, cb, s){
		var t = this, c = t.styleActive, s = c[name];
		if(s) return cb?.(s);
		return t.loadStyle(name, function(s, p){
			s = t.applyStyle(name, s);
			/* reduce race */
			p = c[name];
			p && (s.destroy(), s = p);
			c[name] = s;
			return cb?.(s);
		});
	},
	toString : function(){
		var s = this.scope;
		return "require(" + (s.name || 'unknown') + '@' + s.location.hostname + s.location.pathname + ")";
	},
	fake : undefined
},
top.debug?.( require.impl + ": initialized" ),
// we still have to return a class we just defined, implemented and initialized 8-)
require) // <%/FORMAT%>