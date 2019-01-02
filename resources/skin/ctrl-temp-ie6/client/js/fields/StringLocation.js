// <%FORMAT: 'js' %>
(window.fields || (fields = parent.fields) || (fields = {})) &&
fields.StringLocation || (parent.fields && (fields.StringLocation = parent.fields.StringLocation)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	fields.StringLocation = function(document){
		this.document = document;
	},
	fields.StringLocation.prototype = {
	},
	fields.StringLocation.showLinkChooser = function(name){
		var obj = document.getElementById(name);
		var arguments = {path : obj.value || ''};
		var result = showModalDialog( "linkchooser-modal/",arguments,"dialogWidth:600px; dialogHeight:160px; scroll:no; status:no; resizable:yes; help:no");
		result && result.path && (obj.value = result.path);
		return false;
	},
	fields.StringLocation.goToUrl = function(name){
		var obj = document.getElementById(name);
		window.open(obj.value,'','');
		return false;
	},
fields.StringLocation) // <%/FORMAT%>