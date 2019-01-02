// <%FORMAT: 'js' %>
(window.fields || (fields = parent.fields) || (fields = {})) &&
fields.Date || (parent.fields && (fields.Date = parent.fields.Date)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	fields.Date = function(document){
		this.document = document;
	},
	fields.Date.prototype = {
	},
	fields.Date.ini = function(id){
		var obj = document.getElementById(id);
		var valueObject = document.getElementById(id.substr(3));
		if (obj && valueObject) {
			obj.valueObject = valueObject;
			obj.valueObject.setValue = fields.Date.dateSetValue;
		}
	},
	fields.Date.dateSetValue = function(node){
		this.value = node.getAttribute('CMDvalue');
		this.Millis = node.getAttribute('CMDmillis');
		this.Format = node.getAttribute('CMDformat');
	},
	fields.Date.getCalendarDate = function(name) {
		var obj = document.getElementById(name);
		var arguments = {
			'format' : obj.Format,
			'millis' : obj.Millis
		};
		var result = showModalDialog(
				"Calendar.htm",
				arguments,
				"dialogWidth:150px; dialogHeight:225px; scroll:no; status:no; resizable:no; help:no");
		if (result && result.Date){
			obj.value = result.Date;
			obj.Millis = result.Millis;
		}
	},
fields.Date) // <%/FORMAT%>