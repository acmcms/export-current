// <%FORMAT: 'js' %>
(window.fields || (fields = parent.fields) || (fields = {})) &&
fields.String || (parent.fields && (fields.String = parent.fields.String)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	fields.String = function(document){
		this.document = document;
	},
	fields.String.prototype = {
	},
	fields.String.ini = function(id){
		var obj = document.getElementById(id);
		var valueObject = document.getElementById(id.substr(3));
		if(obj && valueObject){
			obj.valueObject = valueObject;
			obj.valueObject.setValue = fields.String.stringSetValue;
		}
	},
	fields.String.stringSetValue = function(node){
		this.value = node.getAttribute('CMDvalue');
	},
fields.String) // <%/FORMAT%>