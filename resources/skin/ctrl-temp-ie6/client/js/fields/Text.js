// <%FORMAT: 'js' %>
(window.fields || (fields = parent.fields) || (fields = {})) &&
fields.Text || (parent.fields && (fields.Text = parent.fields.Text)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	fields.Text = function(document){
		this.document = document;
	},
	fields.Text.prototype = {
	},
	fields.Text.CONST = {
		// Command Type Enum
		TBCMD_DEC : 0,
		TBCMD_DOC : 1,
		TBCMD_CUSTOM : 2,
		TBCMD_SELECT : 3,

		// Custom Commands
		CM_IMAGE : "EditImage",
		CM_TABLE : "EditTable",
		CM_TABLEPROPERTIES : "TableProperties",
		CM_CELLPROPERTIES : "CellProperties",
		CM_SHOWDETAILS : "ShowDetails",
		CM_SHOWTABLEBORDER : "ShowTableBorders",
		CM_LINK : "EditLink",
		CM_PASTEWORD : "PasteWord",
		CM_PASTETEXT : "PasteText",

		// HTML_CUT : "htmlCut",
		// HTML_COPY : "htmlCopy",
		// HTML_PASTE : "htmlPaste",
		HTML_BOLD : "htmlBold",
		HTML_ITALIC : "htmlItalic",
		HTML_UNDERLINE : "htmlUnderline",
		HTML_STRIKETHROUGH : "htmlStrikethrough",
		HTML_SUBSCRIPT : "htmlSubscript",
		HTML_SUPERSCRIPT : "htmlSuperscript",
		HTML_FONT : "htmlFont",
		HTML_COMMENT : "htmlComment",
		HTML_NBSP : "htmlNBSP",
		HTML_BREAK : "htmlBreak",
		HTML_PARAGRAPH : "htmlParagraph",
		HTML_RULE : "htmlRule",
		HTML_CENTER : "htmlCenter",
		HTML_LINK : "htmlLink",
		HTML_IMAGE : "htmlImage",
		HTML_SCRIPT : "htmlScript"
	},
	(function(){
		for(var i in fields.Text.CONST){
			window[i] = fields.Text.CONST[i];
		}
	})(),
	fields.Text.KEYS = [
		{
			cm : "HTML_BOLD",
			cName : "bold",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_ITALIC",
			cName : "italic",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_UNDERLINE",
			cName : "underline",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_STRIKETHROUGH",
			cName : "strikethrough",
			cType : "TBCMD_CUSTOM"
		},

		{
			cm : "HTML_SUBSCRIPT",
			cName : "subscript",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_SUPERSCRIPT",
			cName : "superscript",
			cType : "TBCMD_CUSTOM"
		},

		{
			cm : "HTML_FONT",
			cName : "font",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_NBSP",
			cName : "nbsp",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_BREAK",
			cName : "break",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_PARAGRAPH",
			cName : "paragraph",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_RULE",
			cName : "rule",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_COMMENT",
			cName : "comment",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_CENTER",
			cName : "center",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_IMAGE",
			cName : "image",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_LINK",
			cName : "link",
			cType : "TBCMD_CUSTOM"
		},
		{
			cm : "HTML_SCRIPT",
			cName : "script",
			cType : "TBCMD_CUSTOM"
		}
	],
fields.Text) // <%/FORMAT%>