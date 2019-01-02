// <%FORMAT: 'js' %>
(window.fields || (fields = parent.fields) || (fields = {})) &&
fields.TextHtml || (parent.fields && (fields.TextHtml = parent.fields.TextHtml)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	fields.TextHtml = function(document){
		this.document = document;
	},
	fields.TextHtml.prototype = {
	},
	fields.TextHtml.getHtmlText = function (name) {
		var W = 600, H = 500;
		var winSize = (window.require && require("Utils.Cookies").read("editorSize", ""));
		if (winSize) {
			W = winSize.split(',')[0] || W;
			H = winSize.split(',')[1] || H;
		}
		var field = document.getElementById(name);
		var frame = document.getElementById(name + "_preview");
		var value = showModalDialog("richedit-modal/", field.value,
				"dialogWidth:" + W + "px; dialogHeight:" + H
						+ "px; scroll:no; status:no; resizable:yes; help:no");
		if (typeof value == "string"){
			var src = frame.src;
			top.debug && top.debug("FieldTextHtml: setting result, reloading frame, source=" + src);
			field.value = value;
			frame.contentWindow.location.replace(src);
		}
	},
fields.TextHtml) // <%/FORMAT%>