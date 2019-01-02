// <%FORMAT: 'js' %>
(window.app || (app = parent.app) || (app = {})) &&
app.Router || (parent.app && (app.Router = parent.app.Router)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	// fire( eventType, id, valueObject, attachment )
	// register( handlerObject, checkElement, id )
	//
	
	app.Router = function(name){
		this.name = name || (app.Router.idx = (++app.Router.idx || 1));
		this.listeners = [];
		return this;
	},
	app.Router.prototype = {
		fire : function(t, id, eValue, eObj){
			top.debug && top.debug(this + ": fire: type=" + t + ", id=" + id);
			var a = this.listeners;
			for (var l, i = 0; i < a.length; ++i){
				l = a[i];
				try {
					l.e.nodeType; // in case of element
					l.e.nodeName; // in case of element
					l.e.toString(); // in case of element
					l.o.onFire.toString(); // IE6 IE7
				}catch(e){
					top.debug && top.debug(this + ": garbage: id=" + l.id + ", err=" + e.message);
					a.splice(i, 1);
					continue;
				}
				if(id && l.id != id){
					continue;
				}
				/*
				try{
					l.o.onFire(t, eValue, eObj);
					continue;
				}catch(e){
					if(e.message == "Can't execute code from a freed script"){
						top.debug && top.debug(this + ": IE garbage: id=" + l.id + ", err=" + e.message);
						a.splice(i, 1);
						continue;
					}
				}
				*/
				/**
				 * Have to repeat, otherwise stack trace is not accessible in IE debugger
				 */
				l.o.onFire(t, eValue, eObj);
			}
		},
		
		register : function(o, e, id){
			o && e || null(this + ": register: missing required parameters, o=" + o + ", e=" + e);
			o.onFire || null(this + ": register: id=" + id + ", object has no onFire method which is mandatory!");
			e.nodeName && e.nodeType && e.toString() || 
				null(this + ": register: id=" + id + ", element is not an element, n=" + e.nodeName + ", t=" + e.nodeType + "!");
			var a = this.listeners;
			for (var i = a.length - 1; i >= 0; --i){
				if(a[i].o === o && a[i].id == id) {
					top.debug && top.debug(this + ": register: id=" + id + ", skipped, already registered");
					return;
				}
			}
			a.push({
				o : o,
				e : e,
				id : id
			});
			top.debug && top.debug(this + ": register: id=" + id + ", listeners now:" + a.length);
		},
		
		unregister : function(o, id){
			top.debug && top.debug(this + ": unregister: id=" + id);
			var c = 0, a = this.listeners;
			for (var i = 0; i < a.length; ++i){
				if(a[i].o == o && (!id || id == a[i].id)){
					c ++;
					a.splice(i, 1);
				}
			}
			top.debug && top.debug(this + ": unregister: id=" + id + ", removed: " + c);
		},
		
		toString : function(){
			return "router(" + this.name + ')';
		}
	},
app.Router) // <%/FORMAT%>