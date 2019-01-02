var ContextMenu = [];

var GeneralContextMenu	= [];
var TableContextMenu	= [];
var LinkContextMenu		= [];
var AbsPosContextMenu	= [];

function ContextMenuItem(text, command, commandType){
	this.Text			= text ;
	this.cType			= commandType || TBCMD_DEC;
	
	switch (this.cType){
		case TBCMD_DEC :
			this.cm = command;
			this.action = decCommand;
			break ;
		case TBCMD_DOC :
			this.cm = command;
			this.action = docCommand;
			break ;
		default :
			this.action = eval(command);
			break ;
	}
}

var MENU_SEPARATOR = "";
GeneralContextMenu[0] = new ContextMenuItem("Cut", DECMD_CUT);
GeneralContextMenu[1] = new ContextMenuItem("Copy", DECMD_COPY);
GeneralContextMenu[2] = new ContextMenuItem("Paste", DECMD_PASTE);
GeneralContextMenu[3] = new ContextMenuItem("Paste text only", CM_PASTETEXT, TBCMD_CUSTOM);
GeneralContextMenu[4] = new ContextMenuItem("Paste from Word", CM_PASTEWORD, TBCMD_CUSTOM);

LinkContextMenu[0] = new ContextMenuItem(MENU_SEPARATOR, 0);
LinkContextMenu[1] = new ContextMenuItem("EditLink", CM_LINK, TBCMD_CUSTOM);
LinkContextMenu[2] = new ContextMenuItem("RemoveLink", DECMD_UNLINK);

TableContextMenu[0] = new ContextMenuItem(MENU_SEPARATOR, 0);
TableContextMenu[1] = new ContextMenuItem("Insert Row", DECMD_INSERTROW);
TableContextMenu[2] = new ContextMenuItem("Delete Rows", DECMD_DELETEROWS);
TableContextMenu[3] = new ContextMenuItem(MENU_SEPARATOR, 0);
TableContextMenu[4] = new ContextMenuItem("Insert Column", DECMD_INSERTCOL);
TableContextMenu[5] = new ContextMenuItem("Delete Columns", DECMD_DELETECOLS);
TableContextMenu[6] = new ContextMenuItem(MENU_SEPARATOR, 0);
TableContextMenu[7] = new ContextMenuItem("Insert Cell", DECMD_INSERTCELL);
TableContextMenu[8] = new ContextMenuItem("Delete Cells", DECMD_DELETECELLS);
TableContextMenu[9] = new ContextMenuItem("Merge Cells", DECMD_MERGECELLS);
TableContextMenu[10] = new ContextMenuItem("Split Cell", DECMD_SPLITCELL);
TableContextMenu[11] = new ContextMenuItem(MENU_SEPARATOR, 0);
TableContextMenu[12] = new ContextMenuItem("CellProperties", CM_CELLPROPERTIES, TBCMD_CUSTOM) ;
TableContextMenu[13] = new ContextMenuItem("TableProperties", CM_TABLEPROPERTIES, TBCMD_CUSTOM) ;

AbsPosContextMenu[0] = new ContextMenuItem(MENU_SEPARATOR, 0);
AbsPosContextMenu[1] = new ContextMenuItem("Send To Back", DECMD_SEND_TO_BACK);
AbsPosContextMenu[2] = new ContextMenuItem("Bring To Front", DECMD_BRING_TO_FRONT);
AbsPosContextMenu[3] = new ContextMenuItem(MENU_SEPARATOR, 0);
AbsPosContextMenu[4] = new ContextMenuItem("Send Backward", DECMD_SEND_BACKWARD);
AbsPosContextMenu[5] = new ContextMenuItem("Bring Forward", DECMD_BRING_FORWARD);
AbsPosContextMenu[6] = new ContextMenuItem(MENU_SEPARATOR, 0);
AbsPosContextMenu[7] = new ContextMenuItem("Send Below Text", DECMD_SEND_BELOW_TEXT);
AbsPosContextMenu[8] = new ContextMenuItem("Bring Above Text", DECMD_BRING_ABOVE_TEXT);

function showContextMenu(){
	this.ContextMenu = [];
	this.ContextMenu.editorObject = this;
	var i;
  	var index = 0;
  
	// Always show general menu options
	for ( i = 0 ; i < GeneralContextMenu.length ; i++ ){
		this.ContextMenu[index++] = GeneralContextMenu[i] ;
	}
	
	// If over a link


	if (checkDecCommand(DECMD_UNLINK,this) == OLE_TRISTATE_UNCHECKED){
		for ( i = 0 ; i < LinkContextMenu.length ; i++ ) {
			this.ContextMenu[index++] = LinkContextMenu[i] ;
		}	
	}

	if (this.QueryStatus(DECMD_INSERTROW) != DECMDF_DISABLED) {
		for ( i = 0 ; i < TableContextMenu.length ; i++ ) {
			this.ContextMenu[index++] = TableContextMenu[i] ;
		}
	}

	if (this.QueryStatus(DECMD_LOCK_ELEMENT) != DECMDF_DISABLED) {
		for (i=0; i<AbsPosContextMenu.length; ++i) {
			this.ContextMenu[idx++] = AbsPosContextMenu[i];
		}
	}

	var sel = this.DOM.selection.createRange();
	var sTag ;
	if (this.DOM.selection.type != 'Text' && sel.length == 1){
		sTag = sel.item(0).tagName ;
	}
	if (sTag == "TABLE"){
		this.ContextMenu[index++] = new ContextMenuItem(MENU_SEPARATOR, 0);
		this.ContextMenu[index++] = new ContextMenuItem("TableProperties", CM_TABLE, TBCMD_CUSTOM);
	}
	else if (sTag == "IMG"){
		this.ContextMenu[index++] = new ContextMenuItem(MENU_SEPARATOR, 0);
		this.ContextMenu[index++] = new ContextMenuItem("ImageProperties", CM_IMAGE, TBCMD_CUSTOM);
	}

	var menuStrings = [] ;
	var menuStates  = [] ;
	for ( i = 0 ; i < this.ContextMenu.length ; i++ ){
		this.ContextMenu[i].parent = this.ContextMenu;
		menuStrings[i] = this.ContextMenu[i].Text;
		
		if (menuStrings[i] != MENU_SEPARATOR) 
			switch (this.ContextMenu[i].cType){
				case TBCMD_DEC :
					menuStates[i] = checkDecCommand(this.ContextMenu[i].cm,this) ;
					break ;
				case TBCMD_DOC :
					menuStates[i] = checkDocCommand(this.ContextMenu[i].cm,this) ;
					break ;
				default :
					menuStates[i] = OLE_TRISTATE_UNCHECKED ;
					break ;
		}else
			menuStates[i] = OLE_TRISTATE_CHECKED ;
	}
  
	this.SetContextMenu(menuStrings, menuStates);
}

function contextMenuAction(itemIndex){
	this.ContextMenu[itemIndex].action();
}