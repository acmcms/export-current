
function EditImage() {
	var image;
	var obj = this.parent.editorObject;
	var sel = obj.DOM.selection.createRange();
	if (obj.DOM.selection.type != 'Text') {
		if (sel.length == 1) {
			if (sel.item(0).tagName == "IMG")
				image = sel.item(0);
		}
	}
	var args = {
		'object' : image
	};
	var result = window.showModalDialog(
		"shared-editor_image.control",
		args,
		"dialogWidth:400px; dialogHeight:260px; scroll:no; status:no; resizable:yes; help:no");
	if (!result) {
		obj.setFocus();
		return;
	}
	if (result['html']){
		insertHtml(result['html'], obj);
	}
}

function CellProperties() {
	var aTD = [];
	var obj = this.parent.editorObject;

	var oRange = obj.DOM.selection.createRange();
	var oParent = oRange.parentElement();
	while (oParent && oParent.tagName != "td" && oParent.tagName != "TABLE"){
		oParent = oParent.parentNode;
	}

	if (oParent.tagName == "td"){
		aTD[0] = oParent;
	}else if (oParent.tagName == "TABLE") {
		for (i = 0; i < oParent.cells.length; ++i) {
			var oCellRange = obj.DOM.selection.createRange();
			oCellRange.moveToElementText(oParent.cells[i]);
			if (oRange.inRange(oCellRange)
					|| (oRange.compareEndPoints('StartToStart', oCellRange) >= 0 && oRange
							.compareEndPoints('StartToEnd', oCellRange) <= 0)
					|| (oRange.compareEndPoints('EndToStart', oCellRange) >= 0 && oRange
							.compareEndPoints('EndToEnd', oCellRange) <= 0)) {
				aTD[aTD.length] = oParent.cells[i];
			}
		}
	}
	if (aTD[0]) {
		var args = {
			object : aTD[0]
		};
		var result = showModalDialog(
				"editor_cell.control",
				args,
				"dialogWidth:300px; dialogHeight:185px; scroll:no; status:no; resizable:no; help:no");
		if (!result) {
			obj.setFocus();
			return;
		}

		for (i = 0; i < aTD.length; ++i) {
			if (result['width'] != ""){
				aTD[i].width = result['width'];
			}else{
				aTD[i].removeAttribute("width");
			}
			if (result['height'] != ""){
				aTD[i].height = result['height'];
			}else{
				aTD[i].removeAttribute("height");
			}
			if (result['wrap'] != ""){
				aTD[i].noWrap = result['wrap'] == "true";
			}else{
				aTD[i].removeAttribute("noWrap");
			}
			if (result['align'] != ""){
				aTD[i].align = result['align'];
			}else{
				aTD[i].removeAttribute("align");
			}
			if (result['vAlign'] != ""){
				aTD[i].vAlign = result['vAlign'];
			}else{
				aTD[i].removeAttribute("vAlign");
			}
			if (result['rowSpan'] != ""){
				aTD[i].rowSpan = result['rowSpan'];
			}else{
				aTD[i].removeAttribute("rowSpan");
			}
			if (result['colSpan'] != ""){
				aTD[i].colSpan = result['colSpan'];
			}else{
				aTD[i].removeAttribute("colSpan");
			}
			if (result['background'] != ""){
				aTD[i].bgColor = result['background'];
			}else{
				aTD[i].removeAttribute("bgColor");
			}
			if (result['border'] != ""){
				aTD[i].borderColor = result['border'];
			}else{
				aTD[i].removeAttribute("borderColor");
			}
			if (result['className'] != ""){
				aTD[i].className = result['className'];
			}else{
				aTD[i].removeAttribute("className");
			}
		}

	}
	// FCKShowDialog("dialog/fck_tablecell.html", window, 500, 220);
	// setFocus() ;
}

function TableProperties() {
	EditTable(this);
}

function EditTable(item) {
	var table;
	var searchParentTable = item ? true : false;
	var item = item ? item : this;
	var obj = item.parent.editorObject;

	if (searchParentTable) {
		var oRange = obj.DOM.selection.createRange();
		var oParent = oRange.parentElement();
		while (oParent && oParent.nodeName != "TABLE") {
			oParent = oParent.parentNode;
		}

		if (oParent && oParent.nodeName == "TABLE") {
			var oControlRange = obj.DOM.body.createControlRange();
			oControlRange.add(oParent);
			oControlRange.select();
		} else
			return;
	}

	var sel = obj.DOM.selection.createRange();
	if (obj.DOM.selection.type != 'Text') {
		if (sel.length == 1) {
			if (sel.item(0).tagName == "TABLE")
				table = sel.item(0);
		}
	}
	var args = {
		'object' : table
	};
	var result = showModalDialog(
			"editor_table.control",
			args,
			"dialogWidth:350px; dialogHeight:225px; scroll:no; status:no; resizable:no; help:no");
	if (!result) {
		obj.setFocus();
		return;
	}
	if (result['resultType'] == 'modify') {
		obj.setFocus();
		return;
	}
	if (result['tableParams']) {
		obj.DOM.selection.clear();
		obj.ExecCommand(DECMD_INSERTTABLE, OLECMDEXECOPT_DODEFAULT,
				result['tableParams']);
	}
}

function EditLink() {
	var obj = this.parent.editorObject;
	var link = getSelectionLink(obj);
	var path = '';

	if (link) {
		var args = {
			'path' : link.getAttribute("href"),
			'title' : link.title,
			'target' : link.target
		};
		if (args.path)
			path = '?path=' + args.path;
	}
	var result = showModalDialog(
			"linkchooser-modal/" + path,
			args,
			"dialogWidth:600px; dialogHeight:160px; scroll:no; status:no; resizable:yes; help:no");
	if (!result)
		return;
	if (result['path'] == '') {
		obj.ExecCommand(DECMD_UNLINK, OLECMDEXECOPT_DODEFAULT);
		return;
	}
	obj.ExecCommand(DECMD_HYPERLINK, OLECMDEXECOPT_DONTPROMPTUSER,
			"javascript:'';/*fckeditortemplink*/");

	for (i = 0; i < obj.DOM.links.length; ++i) {
		if (obj.DOM.links[i].href == "javascript:'';/*fckeditortemplink*/") {
			obj.DOM.links[i].href = result['path'];
			if (result['title'] == "")
				obj.DOM.links[i].removeAttribute("title", 0);
			else
				obj.DOM.links[i].title = result['title'];
			if (result['target'] == null || result['target'] == '')
				obj.DOM.links[i].removeAttribute("target", 0);
			else
				obj.DOM.links[i].target = result['target'];
		}
	}

	function getSelectionLink(obj) {
		var oParent;
		var oRange;

		if (obj.DOM.selection.type == "Control") {
			oRange = obj.selection.createRange();
			for ( var i = 0; i < oRange.length; ++i) {
				if (oRange(i).parentNode) {
					oParent = oRange(i).parentNode;
					break;
				}
			}
		} else {
			oRange = obj.DOM.selection.createRange();
			oParent = oRange.parentElement();
		}

		while (oParent && oParent.nodeName != "A") {
			oParent = oParent.parentNode;
		}

		if (oParent && oParent.nodeName == "A") {
			obj.DOM.selection.empty();
			oRange = obj.DOM.selection.createRange();
			oRange.moveToElementText(oParent);
			oRange.select();
			return oParent;
		} else {
			return null;
		}
	}
}

function ShowDetails() {
	var obj = this.parent.editorObject;
	obj.ShowDetails = !obj.ShowDetails;
	obj.setFocus();
}


function ShowTableBorders() {
	var obj = this.parent.editorObject;
	obj.ShowBorders = !obj.ShowBorders;
	obj.setFocus();
}




function insertHtml(html, obj) {
	if (obj.DOM.selection.type.toLowerCase() != "none"){
		obj.DOM.selection.clear();
	}
	obj.DOM.selection.createRange().pasteHTML(html);
	obj.setFocus();
}

function HTMLEncode(text) {
	text = text.replace(/&/g, "&amp;");
	text = text.replace(/"/g, "&quot;");
	text = text.replace(/</g, "&lt;");
	text = text.replace(/>/g, "&gt;");
	text = text.replace(/'/g, "&#146;");
	return text;
}

function GetClipboardHTML() {
	var oDiv = document.getElementById("divTemp")
	oDiv.innerHTML = "";
	var oTextRange = document.body.createTextRange();
	oTextRange.moveToElementText(oDiv);
	oTextRange.execCommand("Paste");
	var sData = oDiv.innerHTML;
	oDiv.innerHTML = "";
	return sData;
}


function getClassNames() {
	return "Title,ClassName,Title2,ClassName2";
}

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
	if (Toolbar.checkDecCommandImpl(DECMD_UNLINK,this) == OLE_TRISTATE_UNCHECKED){
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
	var sel = this.DOM.selection.createRange() ;
	var sTag ;
	if (this.DOM.selection.type != 'Text' && sel.length == 1){
		sTag = sel.item(0).tagName;
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
				case TBCMD_DEC:
					menuStates[i] = Toolbar.checkDecCommandImpl(this.ContextMenu[i].cm,this);
					break;
				case TBCMD_DOC:
					menuStates[i] = checkDocCommand(this.ContextMenu[i].cm,this);
					break;
				default :
					menuStates[i] = OLE_TRISTATE_UNCHECKED;
					break ;
		}else
			menuStates[i] = OLE_TRISTATE_CHECKED;
	}
	this.SetContextMenu(menuStrings, menuStates);
}

function contextMenuAction(itemIndex){
	this.ContextMenu[itemIndex].action();
}
