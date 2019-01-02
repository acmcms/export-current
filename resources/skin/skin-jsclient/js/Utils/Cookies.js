// <%FORMAT: 'js' %>
(window.Utils || (Utils = parent.Utils) || (Utils = {})) &&
Utils.Cookies || (parent.Utils && (Utils.Cookies = parent.Utils.Cookies)) || (
	// v 2.0b
	//
	//	-= MyX =-
	//

Utils.Cookies = {
	create: function(name, value, days) {
		top.debug && top.debug("cookie write: name=" + name + ", days=" + days + ", value=" + value);
		var expires;
		if (days > 0) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = name+"="+encodeURIComponent(value)+expires+"; path=/";
	},

	read: function(name, defaultValue) {
		top.debug && top.debug("cookie read: name=" + name);
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
	
	erase: function(name){
		this.create(name, "", -1);
	}
}) // <%/FORMAT%>