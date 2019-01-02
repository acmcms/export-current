function ToolbarIni(obj, parent) {

	function SelectIni() {
		var obj = this.parent.editorObject;
		if (this.onEdit) {
			this.checkState = eval(this.onEdit);
		}
		this.select = this.getElementsByTagName("SELECT")[0];
		if (!this.select)
			return;
		setSelectOptions(this.select, eval(this.cValue));
	}

	function ToolCommandIni() {
		switch (this.cType) {
		case TBCMD_DEC:
			this.onclick = DHTMLEd.decCommand;
			break;
		case TBCMD_DOC:
			this.onclick = DHTMLEd.docCommand;
			break;
		case TBCMD_CUSTOM:
			var command = eval(this.cm)
			this.onclick = eval(command);
			break;
		}
	}
	
	obj.editorObject = parent;
	var items = obj.getElementsByTagName("DIV");
	for ( var i = 0; i < items.length; ++i) {
		var item = items[i];
		if (!item.getAttribute("cm")){
			continue;
		}
		item.parent = obj;
		item.cType = item.cType ? eval(item.cType) : TBCMD_DEC;
		switch (item.cType) {
		case TBCMD_SELECT:
			item.ini = SelectIni;
			break;
		default:
			item.ini = ButtonIni;
			break;
		}
		item.ini();
		item.commandIni = ToolCommandIni;
		item.commandIni();
	}
}

function checkDocCommand(command, obj) {
}

function setSelectOptions(obj, value) {
	var vArr = value.split(',');
	for ( var i = 0; i < vArr.length; i += 2) {
		var oOption = document.createElement("OPTION");
		oOption.text = vArr[i];
		oOption.value = vArr[i + 1];
		obj.add(oOption);
	}
}
