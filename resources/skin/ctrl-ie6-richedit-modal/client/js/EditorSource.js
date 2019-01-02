// <%FORMAT: 'js' %>
window.EditorSource || (EditorSource = function(target){
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
		
		var keys = [
			{
				cm		: "HTML_BOLD",
				cName	: "bold",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_ITALIC",
				cName	: "italic",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_UNDERLINE",
				cName	: "underline",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_STRIKETHROUGH",
				cName	: "strikethrough",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_SUBSCRIPT",
				cName	: "subscript",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_SUPERSCRIPT",
				cName	: "superscript",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_FONT",
				cName	: "font",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_NBSP",
				cName	: "nbsp",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_BREAK",
				cName	: "break",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_PARAGRAPH",
				cName	: "paragraph",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_RULE",
				cName	: "rule",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_COMMENT",
				cName	: "comment",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_CENTER",
				cName	: "center",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_IMAGE",
				cName	: "image",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_LINK", 
				cName	: "link",
				cType	: "TBCMD_CUSTOM"
			},
			{
				cm		: "HTML_SCRIPT",
				cName	: "script",
				cType	: "TBCMD_CUSTOM"
			},
			undefined
		];
		
		var editorCell = table.insertRow(-1).insertCell(-1);
		editorCell.setAttribute("height", "100%");
		editorCell.style.position = "relative";
		
		this.editor = document.createElement("textarea");
		editor.setAttribute("wrap", "soft"); // off
		//editor.style.position = "absolute";
		//editor.style.left = 0;
		//editor.style.top = 0;
		editor.style.width = "100%";
		editor.style.height = "100%";
		editor.style.whiteSpace = "pre";
		editor.style.overflow = "auto";
		
		editorCell.appendChild(editor);
		editor.edit = this;
		
		this.returnValue = function(){
			return this.DOM.body.innerHTML;
		};
		editor.toolbar = this.toolbar = new Toolbar(toolbarTarget, editor, keys);
		this.ShowContextMenu = showContextMenu;
		this.ContextMenuAction = contextMenuAction;
		Utils.Event.listen(
			editor,
			"change",
			function(){
				this.toolbar.refresh(this);
			}
		);
		Utils.Event.listen(
			editor,
			"blur",
			function(){
				this.toolbar.refresh(this);
			}
		);
		target.appendChild(table);
	}
},
EditorSource.prototype = {
	setFocus : function(){
		this.editor.focus();
	},
	setHtml	: function(html){
		this.editor.value = html;
	},
	getHtml		: function(){
		return this.editor.value;
	}
},
EditorSource) // <%/FORMAT%>