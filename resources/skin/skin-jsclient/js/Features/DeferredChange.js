// <%FORMAT: 'js' %>
(window.Features || (Features = parent.Features) || (Features = {})) &&
Features.DeferredChange || (parent.Features && (Features.DeferredChange = parent.Features.DeferredChange)) || (
	// v 0.1d
	//
	//	-= MyX =-
	//
	// Abstract class provides deferred 'change' event handler for inputs.
	//
	// NOT uses CSS:
	//
	// HTML document types:
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	//		<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	//
	// properties {
	//	delay : amount of milliseconds to delay, defaults to 250.
	//	onChange : function to call. target element will be used as 'this'.
	// }
	//

Features.DeferredChange = function(target, properties){
	var t = this,
		delay = Number(properties.delay || 0);
	
	t.target = target.inner || target;
	t.plane = target.plane || target;
	
	(delay < 0 || isNaN(delay)) && (delay = 250);
	t.delay = delay;
	
	switch(target.type){
	case 'checkbox':
	case 'radio':
		t.valueField = 'checked';
		break;
	default:
		t.valueField = 'value';
	}
	t.previousValue = target[t.valueField];
	t.currentTimer = null;
	t.onChange = properties.onChange || t.dummy;
	
	t.plane.DeferredChange = t.target.DeferredChange = t.DeferredChange = t;

	Utils.Event.listen(t.target, ["change", "keypress", "keyup", "paste", "input", "textInput", "click"], function(){
		if(t.currentTimer){
			clearTimeout(t.currentTimer);
		}
		t.currentTimer = setTimeout(function(v){
			t.currentTimer = null;
			v = target[t.valueField];
			if(v !== t.previousValue){
				t.previousValue = v;
				t.onChange.call(target);
			}
		}, delay);
	});
	
	return t;
},
Features.DeferredChange.prototype = {
	// instance variable 'target' plane
	// instance variable 'plane' plane

	currentTimer : null,
	previousValue : null,
	onChange : null,
	
	cancel : function(){
		this.currentTimer && (clearTimeout(this.currentTimer), this.currentTimer = null);
	},
	
	/**
	 * 
	 */
	debug : function(text){
		text && top.debug && top.debug("Features.DeferredChange: " + text);
	},
	
	toString : function(){
		return "Features.DeferredChange";
	},
	
	dummy : function(){
		return false;
	}
},
// we still have to return a class we just defined, implemented and initialized 8-)
Features.DeferredChange) // <%/FORMAT%>