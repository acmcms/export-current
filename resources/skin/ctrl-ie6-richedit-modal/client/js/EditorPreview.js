// <%FORMAT: 'js' %>
window.EditorPreview || (EditorPreview = function(target){
	with(this){
		this.table = document.createElement("table");
		table.setAttribute("border", 0);
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		table.style.width = "100%";
		table.style.height = "100%";
		
		this.preview = table.insertRow(-1).insertCell(-1);
		preview.style.position = "relative";
		preview.style.width = "100%";
		preview.style.height = "100%";
		preview.style.backgroundColor = "white";
		preview.style.color = "black";
		preview.style.border = "1px solid black";
		preview.className = "BorderBox";
		
		<%OUTPUT: source %><%
			%><iframe<%
				%> src="javascript:parent.EditorPreview.prototype.blank()"<%
				%> style="width:100%;height:100%"<%
				%> width="100%"<% 
				%> height="100%"<%
				%> frameborder="0"<%
				%> onload="EditorPreview.setupIFrame(this)"<%
			%>><%
			%></IFRAME><%
		%><%/OUTPUT%>
		preview.innerHTML = <%= Format.jsString( source ) %>;
		this.editor = preview.firstChild;
	
		target.appendChild(table);
	}
},
EditorPreview.prototype = {
	blank		: function(){
		return '<html><head></head><body></body></html>';
	},
	setFocus	: function(){
		with(this){
			return editor.DOM && editor.DOM.body
				? (Utils.Event.fire(editor, "focus"), editor.DOM.body.focus())
				: (editor.setFocus = true);
		}
	},
	setHtml	: function(html){
		with(this){
			return editor.DOM && editor.DOM.body
				? (editor.DOM.body.innerHTML = html)
				: (editor.setHtml = html);
		}
	}
},
EditorPreview.setupIFrame = function(editor){
	top.debug && top.debug("EditorPreview: setup iframe, editor=" + editor);
	var DOM = (editor.contentWindow && editor.contentWindow.document) || editor.contentDocument || editor.document;
	if(editor.DOM == DOM){
		return;
	}
	editor.DOM = DOM;
	if(editor.setHtml){
		editor.edit.setHtml(editor.setHtml);
		editor.setHtml = undefined;
	}
	if(editor.setFocus){
		editor.edit.setFocus();
		editor.setFocus = undefined;
	}
},
EditorPreview) // <%/FORMAT%>