// <%FORMAT: 'js' %>
//
// target - element
// value - value object (with .value property)
//
window.EditorActiveX || (EditorActiveX = function(target, value){
	require("Utils.Event");
	with(this){
		this.value = value;
		this.table = document.createElement("table");
		table.setAttribute("border", 0);
		table.setAttribute("cellspacing", 0);
		table.setAttribute("cellpadding", 0);
		table.style.width = "100%";
		table.style.height = "100%";
		
		var toolbarCell = table.insertRow(-1).insertCell(-1);
		toolbarCell.style.padding = "0 0 3px 0";
		toolbarCell.className = "toolbar BorderBox";
		
		this.toolbarTarget = toolbarCell;
		
		var editorCell = table.insertRow(-1).insertCell(-1);
		editorCell.style.position = "relative";
		editorCell.style.width = "100%";
		editorCell.style.height = "100%";
		
		target.appendChild(table);

		editorCell.toolbarTarget = toolbarTarget;
		editorCell.edit = this;
		<%OUTPUT: source %><%
			%><OBJECT<%
				%> CLASSID="clsid:2D360201-FFF5-11d1-8D03-00A0C959BC0A"<% 
				%> style="width:100%;height:100%"<%
				%> WIDTH="100%"<% 
				%> HEIGHT="100%"<%
				%> BORDER="0"<%
				%> ONDOCUMENTCOMPLETE="EditorActiveX.setupObject(this,'documentcomplete')"<%
				%> ONLOAD="EditorActiveX.setupObject(this,'load')"<%
				%> ONREADY="EditorActiveX.setupObject(this,'ready')"<%
				%> ONREADYSTATECHANGE="(this.readyState == '4' || this.readyState == 'loaded' || this.readyState == 'complete')<%
											%> && EditorActiveX.setupObject(this,'statechange')"<%
			%>><%
			%></OBJECT><%
		%><%/OUTPUT%>
		editorCell.innerHTML = <%= Format.jsString( source ) %>;
		this.editor = editorCell.firstChild;
		editor.edit = this;

		Utils.Event.listen(
			editor,
			"readystatechange",
			function(){
				(this.readyState == '4' || this.readyState == 'loaded' || this.readyState == 'complete')
					&& setTimeout( function(){EditorActiveX.setupObject(editor,'jsstatechange')}, 50 );
			}
		);

		//editor.DocumentHTML = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><html><head><title></title></head><body></body></html>';
	}
},
EditorActiveX.prototype = {
	setFocus	: function(){
		this.editor.done === true
			? this.editor.DOM.focus()
			: (this.editor.setFocus = true);
	},
	setHtml		: function(html){
		with(this){
			return editor.done === true
				? (editor.DOM.body.innerHTML = html)
				: (editor.setHtml = html);
		}
	},
	getHtml		: function(){
		with(this){
			return editor.done === true
				? editor.DOM.body.innerHTML
				: editor.setHtml;
		}
	}
},
EditorActiveX.setupObject = function(editor, cause){
	if(!editor.parentNode.toolbarTarget){
		top.debug && top.debug("EditorActiveX: setupObject - too early, cause=" + cause + ", editor=" + editor);
		return;
	}
	try{
		top.debug && top.debug("EditorActiveX: setupObject, cause=" + cause + ", editor=" + editor + ", editor.DOM=" + editor.DOM );
	}catch(e){
		top.debug && top.debug("EditorActiveX: setupObject - error, cause=" + cause + ", editor=" + editor + ", e.message=" + e.message );
		return;
	}
	if(editor.done){
		return;
	}
	editor.done = "almost";
	editor.toolbar = new Toolbar(editor.parentNode.toolbarTarget, editor, EditorActiveX.KEYS);
	editor.ShowContextMenu = showContextMenu;
	editor.ContextMenuAction = contextMenuAction;
	editor.done = true;
	if(editor.setHtml){
		editor.parentNode.edit.setHtml(editor.setHtml);
		editor.setHtml = undefined;
	}
	if(editor.setFocus){
		editor.parentNode.edit.setFocus();
		editor.setFocus = undefined;
	}
	Utils.Event.listen(
		editor,
		"DisplayChanged",
		function(){
			top.debug && top.debug("EditorActiveX: update, toolbarReady=" + (!!this.toolbar));
			this.toolbar && this.toolbar.refresh(this);
		}
	);
	Utils.Event.listen(
		editor,
		"ShowContextMenu",
		function(){
			top.debug && top.debug("EditorActiveX: context menu");
			this.ShowContextMenu();
		}
	);
	Utils.Event.listen(
		editor,
		"ContextMenuAction(itemIndex)",
		function(){
			top.debug && top.debug("EditorActiveX: context menu action");
			this.ContextMenuAction(itemIndex);
		}
	);
},
EditorActiveX.KEYS = [
	{
		cm		: "DECMD_UNDO",
		cName	: "undo"
	},
	{
		cm		: "DECMD_REDO",
		cName	: "redo"
	},
	{
		cm		: "DECMD_CUT",
		cName	: "cut"
	},
	{
		cm		: "DECMD_COPY",
		cName	: "copy"
	},
	{
		cm		: "DECMD_PASTE",
		cName	: "paste"
	},
	{
		cm		: "CM_PASTETEXT",
		cName	: "pastetext",
		cType	: "TBCMD_CUSTOM",
		onEdit	: "Toolbar.checkDecCommand",
		cmEdit	: "DECMD_PASTE"
	},
	{
		cm		: "CM_PASTEWORD",
		cName	: "pasteword",
		cType	: "TBCMD_CUSTOM",
		onEdit	: "Toolbar.checkDecCommand",
		cmEdit	: "DECMD_PASTE"
	},
	{
		cm		: "DECMD_BOLD",
		cName	: "bold"
	},
	{
		cm		: "DECMD_ITALIC",
		cName	: "italic"
	},
	{
		cm		: "DECMD_UNDERLINE",
		cName	: "underline"
	},
	{
		cm		: "StrikeThrough",
		cName	: "strikethrough",
		cType	: "TBCMD_DOC"
	},
	{
		cm		: "Subscript",
		cName	: "subscript",
		cType	: "TBCMD_DOC"
	},
	{
		cm		: "Superscript",
		cName	: "superscript",
		cType	: "TBCMD_DOC"
	},
	{
		cm		: "DECMD_JUSTIFYLEFT",
		cName	: "justifyleft"
	},
	{
		cm		: "DECMD_JUSTIFYCENTER",
		cName	: "justifycenter"
	},
	{
		cm		: "DECMD_JUSTIFYRIGHT",
		cName	: "justifyright"
	},
	{
		cm		: "JustifyFull",
		cName	: "justifyfull",
		cType	: "TBCMD_DOC"
	},
	{
		cm		: "DECMD_ORDERLIST",
		cName	: "insertorderedlist"
	},
	{
		cm		: "DECMD_UNORDERLIST",
		cName	: "insertunorderedlist"
	},
	{
		cm		: "DECMD_OUTDENT",
		cName	: "outdent"
	},
	{
		cm		: "DECMD_INDENT",
		cName	: "indent"
	},
	{
		cm		: "CM_LINK",
		cName	: "link",
		cType	: "TBCMD_CUSTOM",
		onEdit	: "Toolbar.checkDecCommand",
		cmEdit	: "DECMD_HYPERLINK"
	},
	{
		cm		: "DECMD_UNLINK",
		cName	: "unlink"
	},
	{
		cm		: "InsertHorizontalRule",
		cName	: "rule",
		cType	: "TBCMD_DOC"
	},
	{
		cm		: "CM_IMAGE",
		cName	: "image",
		cType	: "TBCMD_CUSTOM"
	},
	{
		cm		: "CM_TABLE",
		cName	: "table",
		cType	: "TBCMD_CUSTOM"
	},
	{
		cm		: "DECMD_INSERTROW",
		cName	: "insertrow"
	},
	{
		cm		: "DECMD_INSERTCOL",
		cName	: "insertcol"
	},
	{
		cm		: "DECMD_INSERTCELL",
		cName	: "insertcell"
	},
	{
		cm		: "DECMD_DELETEROWS",
		cName	: "deleterows"
	},
	{
		cm		: "DECMD_DELETECOLS",
		cName	: "deletecols"
	},
	{
		cm		: "DECMD_DELETECELLS",
		cName	: "deletecells"
	},
	{
		cm		: "DECMD_MERGECELLS",
		cName	: "mergecellsright"
	},
	{
		cm		: "DECMD_SPLITCELL",
		cName	: "splitcellvertical"
	},
	{
		cm		: "CM_SHOWTABLEBORDER",
		cName	: "showtableborders",
		cType	: "TBCMD_CUSTOM",
		onEdit	: "Toolbar.checkTableBorders"
	},
	{
		cm		: "CM_SHOWDETAILS",
		cName	: "showdetails",
		cType	: "TBCMD_CUSTOM",
		onEdit	: "Toolbar.checkShowDetails"
	},
	undefined
],
EditorActiveX) // <%/FORMAT%>