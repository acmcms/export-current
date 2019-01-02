// <%FORMAT: 'js' %>
/**
 * 0.9a
 * 
 * -= MyX =-
 * 
 * reset.js
 * checks and adds essential abilities to JS. 
 * 
 * Array.isArray(x)
 * Array.prototype.forEach(fn, thisObject)
 * 
 * String.prototype.trim()
 */

/**
 * 
 */
Array.isArray || (Array.isArray = function(testObject) {
	return testObject && !(testObject.propertyIsEnumerable('length')) && (typeof testObject === 'object') && (typeof testObject.length === 'number');
});

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
});

String.prototype.trim || (String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/gm,"");
});

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
});

// <%/FORMAT%>