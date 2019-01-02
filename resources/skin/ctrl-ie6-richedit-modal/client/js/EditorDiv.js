// <%FORMAT: 'js' %>
window.EditorDiv || (EditorDiv = function(target){
	require("Utils.Event");
	with(this){
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
		editorCell.className = "FrameBorder2";
		editorCell.style.position = "relative";
		editorCell.style.width = "100%";
		editorCell.style.height = "100%";
		
		<%OUTPUT: source %><%
			%><div<%
				%> style="<%
					%>width:100%;<%
					%>height:100%;<%
					%>background-color:white;<%
					%>color:black;<%
					%>margin:2px<%
				%>"<%
				%> contentEditable="true"<%
			%>><%
			%></div><%
		%><%/OUTPUT%>
		editorCell.toolbarTarget = toolbarTarget;
		editorCell.edit = this;
		editorCell.innerHTML = <%= Format.jsString( source ) %>;
		this.editor = editorCell.firstChild;
		editor.edit = this;

		EditorDiv.setupDiv(editor);
		
		target.appendChild(table);
	}
},
EditorDiv.prototype = {
	setFocus	: function(){
		with(this){
			return editor.DOM
				? (Utils.Event.fire(editor, "focus"), editor.DOM.focus())
				: (editor.setFocus = true);
		}
	},
	setHtml		: function(html){
		with(this){
			return editor.DOM
				? (editor.DOM.innerHTML = html)
				: (editor.setHtml = html);
		}
	},
	getHtml		: function(){
		return this.editor.DOM.innerHTML;
	}
},
EditorDiv.setupDiv = function(editor){
	if(editor.DOM){
		return;
	}
	top.debug && top.debug("EditorDiv: setup div, editor=" + editor);
	editor.CMD_MAP = {
		"5000"	: "Bold",
		"5002"	: "Copy",
		"5003"	: "Cut",
		"5004"	: "Delete",
		"5010"	: "BackColor",
		"5013"	: "FontName",
		"5014"	: "FontSize",
		"5015"	: "ForeColor",
		"5016"	: "CreateLink",
		"5017"	: "InsertImage",
		"5018"	: "Indent",
		"5023"	: "Italic",
		"5024"	: "JustifyCenter",
		"5025"	: "JustifyLeft",
		"5026"	: "JustifyRight",
		"5028"	: "2D-Position",
		"5030"	: "InsertOrderedList",
		"5031"	: "Outdent",
		"5032"	: "Paste",
		"5033"	: "Redo",
		"5034"	: "RemoveFormat",
		"5035"	: "SelectAll",
		"5042"	: "BackColor",
		"5043"	: "FormatBlock",
		"5044"	: "FontName",
		"5045"	: "FontSize",
		"5046"	: "ForeColor",
		"5048"	: "Underline",
		"5049"	: "Undo",
		"5050"	: "Unlink",
		"5051"	: "InsertUnorderedList"
	};
	editor.QueryStatus || (editor.QueryStatus = function(command){
		command = this.CMD_MAP[String(command)];
		var result = DECMDF_NOTSUPPORTED;
		if(command && this.DOM.queryCommandSupported(command)) {
			result = this.DOM.queryCommandEnabled(command) ? DECMDF_ENABLED : DECMDF_DISABLED;
			if(DECMDF_ENABLED == result) {
				if(this.DOM.queryCommandIndeterm(command)){
					return DECMDF_NINCHED;
				}
				if(this.DOM.queryCommandState(command)) {
					return DECMDF_LATCHED;
				}
			}
		}
		return result;
	});
	editor.ExecCommand || (editor.ExecCommand = function(command, ui, value){
		command = this.CMD_MAP[String(command)];
		return command && this.DOM.execCommand(command,ui == OLE_TRISTATE_CHECKED,value);
	});
	editor.toolbar = new Toolbar(editor.parentNode.toolbarTarget, editor, EditorDiv.KEYS);
	editor.ShowContextMenu = showContextMenu;
	editor.ContextMenuAction = contextMenuAction;
	editor.contentEditable = true;
	editor.DOM = editor;
	for(var i in {focus:0,mousedown:0,cut:0,paste:0,drop:0,keydown:0,keyup:0}){
		Utils.Event.listen(
			editor.DOM,
			i,
			function(e){
				top.debug && top.debug("EditorDiv: event: " + (e.detail || e.type));
				editor.toolbar.refresh(editor);
			}
		);
	}
	Utils.Event.listen(
		editor.DOM,
		"contextmenu",
		function(){
			top.debug && top.debug("EditorDiv: context menu");
			this.ShowContextMenu();
		}
	);
	Utils.Event.listen(
		editor.DOM,
		"ContextMenuAction(itemIndex)",
		function(){
			top.debug && top.debug("EditorDiv: context menu action");
			this.ContextMenuAction(itemIndex);
		}
	);
	editor.toolbar.refresh(editor);
},
EditorDiv.KEYS = [
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
EditorDiv) // <%/FORMAT%>
