// <%FORMAT: 'js' %>
(window.Utils || (Utils = parent.Utils) || (Utils = {})) &&
Utils.Event || (parent.Utils && (Utils.Event = parent.Utils.Event)) || (
	// v 1.0k
	//
	//	-= MyX =-
	//
	//	event : {
	//	}
	//
	//
	//	Usage:
	//		Utils.Event.listen(object, event, callback);
	//		Utils.Event.fire(object, event);
	//		Utils.Event.remove(object, event, callback);
	//
	//		OR
	//
	//		var event = new Utils.Event(event)
	//			created object will have the following methods:
	//			-	listen	: function(object, callback)
	//			-	fire	: function(object)
	//			-	remove	: function(object, callback)
	//
	//	Example:
	//		Utils.Event.listen(document, "DOMContentLoaded", initAll);
	//		Utils.Event.listen(window, "load", initAll);

Utils.Event = function(type){
	this.event = type;
},
Utils.Event.listen = function(obj, type, fn){
	this.prototype.addEvent(obj, type, fn);
},
Utils.Event.fire = function(obj, type){
	this.prototype.fireEvent(obj, type);
},
Utils.Event.remove = function(obj, type, fn){
	this.prototype.removeEvent(obj, type, fn);
},
Utils.Event.prototype = {
	// instance properties
	/**
	 * event name
	 */
	event : null,
	
	listen : function(obj, fn){
		return this.addEvent.call(Utils.Event, obj, this.event, fn);
	},
	fire : function(obj){
		return this.addEvent.call(Utils.Event, obj, this.event);
	},
	remove : function(obj, fn){
		return this.removeEvent.call(Utils.Event, obj, this.event, fn);
	},

	/**
	 * @Description attaches an event handler callback to a given object. 
	 * 'type' is either string, either an array of strings.
	 */
	// standard routine, v2.4
	addEvent: function( obj, type, fn ) {
		var t = this,
			ffn = ((typeof fn === 'function') ? fn : new Function(fn));
		if(type.forEach){
			type.forEach(function(element){
				element && t.addEvent(obj,element,ffn);
			});
			return;
		}
		var debug = top.debug && (this + ".addEvent('" + (obj.nodeName || obj) + "', '" + type + "'): ");
		if(obj.addEventListener){
			obj.addEventListener( type, ffn, false );
			debug && top.debug(debug + "DOM way!");
		}else
		if(obj.attachEvent){
			var k = "__msieh_" + type,
				f = ffn[k] || (ffn[k] = function(e){
				e || (e = window.event);
				ffn.call( e.srcElement || obj, e );
			});
			obj.attachEvent("on"+type, f);
			debug && top.debug(debug + "IE6 way!");
		}else{
			var k = "on" + type,
				func = obj[k],
				save;
			if(!func || !func.handlers){
				save = func;
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
	// standard routine 2.2
	fireEvent: function( obj, type ) {
		var isName = "string" === typeof type,
			t = this,
			d = document,
			e;
		if(!isName && type.forEach){
			type.forEach(function(element){
				t.fireEvent(obj, element);
			});
			return true;
		}
		if(obj.dispatchEvent && d.createEvent){ // W3C
			e = isName
				? (e = d.createEvent("HTMLEvents"), e.initEvent(type, false, true), e)
				: type;
			return obj.dispatchEvent(e);
		}
		e = "on" + (isName ? type : type.type);
		if(obj.fireEvent && d.createEventObject){ // IE
			return obj.fireEvent(e, isName ? d.createEventObject() : type);
		}
		{
			top.debug && top.debug(t + ".fireEvent: failover to worst case scenario, obj=" + obj.nodeName + ", event=" + e);
			return !obj[e] || obj[e](isName ? null : type);
		}
	},

	/**
	 * @Description Removes event handler
	 */
	// standard routine 1.1
	removeEvent: function( obj, type, ffn ) {
		if(type.forEach){
			with(this){
				type.forEach(function(element){
					removeEvent(obj,element,ffn);
				});
			}
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
	
	toString : function(){
		with(this){
			return "Utils.Event" + (event ? "('"+event+"')" : "");
		} 
	}
},
Utils.Event.toString = function(){
	return "Utils.Event";
},
Utils.Event) // <%/FORMAT%>