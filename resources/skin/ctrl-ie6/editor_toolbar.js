function ToolbarIni(obj,parent){
	obj.editorObject = parent;
	var items = obj.getElementsByTagName("DIV");
	for (var i=0; i<items.length; ++i){
		var item = items[i];
		if(!item.getAttribute('cm')) continue;
		item.parent = obj;
		item.cType = item.cType ? eval(item.cType) : TBCMD_DEC;
		switch (item.cType){
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

	function SelectIni(){
		var obj = this.parent.editorObject;
		if(this.onEdit){
			this.checkState = eval(this.onEdit);
		}
		this.select = this.getElementsByTagName("SELECT")[0];
		if(!this.select) return;
		setSelectOptions(this.select, eval(this.cValue));
	}

	function ButtonIni(){
		var obj = this.parent.editorObject;

		if(this.onEdit){
			this.checkState = eval(this.onEdit);
		}else{
			switch (this.cType){
				case TBCMD_DEC:
					this.checkState = function(){
						return checkDecCommand(eval(this.cm),this.parent.editorObject);
					}
					break;
				case TBCMD_DOC:
					this.checkState = function(){
						return checkDocCommand(this.cm,this.parent.editorObject);
					}
					break;
				default:
					this.checkState = function(){
						return OLE_TRISTATE_UNCHECKED;
					}
					break;
			}
		}

		this.onFire = onEditing;
		eventMethods.register(this,obj.id);

		if(this.firstChild.nodeName == 'IMG'){
			this.Image = this.firstChild;
			this.Image.src = '$files/toolbar/button.'+this.cName+'.gif';
			try{
				this.title = CM_LANG[this.cName] || this.cName;
			}catch(Error){
				this.title = this.cName;
			}
		}
		this.onmouseover = function(){
			if (this.state) return;
			this.Image.className = 'ButtonOver';
		}
		this.onmouseout = function(){
			if (this.state) return;
			this.Image.className = '';
		}

		this.onmousedown = function(){
			if (this.state) return;
			this.Image.className = 'ButtonActive';
		}
		this.onmouseup = function(){
			if (this.state) return;
			this.Image.className = '';
		}
		
		this.setActive = function(){
			if(this.state == 'active') return;
			this.state = 'active';
			this.Image.className = 'ButtonActive';
		}
		this.setEnable = function(){
			if(this.state == '') return;
			this.state = '';
			this.Image.className = '';
		}
		this.setDisabled =function(){
			if(this.state == 'dusabled') return;
			this.state = 'disabled';
			this.Image.className = 'ButtonDisabled';
		}
	}

	function ToolCommandIni(){
		switch (this.cType){
			case TBCMD_DEC:
				this.onclick = decCommand;
				break;
			case TBCMD_DOC:
				this.onclick = docCommand;
				break;
			case TBCMD_CUSTOM:
				var command = eval(this.cm)
				this.onclick = eval(command);
				break;
		}
	}

}


function onEditing(eType,eValue,eObj){
//	try{
		var state = this.checkState();
//	}catch(Error){
//		var state = OLE_TRISTATE_UNCHECKED;
//	}
	switch(state){
		case OLE_TRISTATE_GRAY:
			this.setDisabled();
			break;
		case OLE_TRISTATE_UNCHECKED:
			this.setEnable();
			break;
		case OLE_TRISTATE_CHECKED:
			this.setActive();
			break;
	}
}

function CheckDecCommand(){
	var command = this.cmEdit ? eval(this.cmEdit) : eval(this.cm);
	return checkDecCommand(command,this.parent.editorObject);
}

function CheckDocCommand(){
	var command = this.cmEdit || this.cm;
	return checkDocCommand(command,this.parent.editorObject);
}

function checkDecCommand(command,obj){
	if (obj.Busy) return OLE_TRISTATE_GRAY;
	var state = obj.QueryStatus(command); 
	switch (state){
		case (DECMDF_DISABLED || DECMDF_NOTSUPPORTED) :
			return OLE_TRISTATE_GRAY ;
		case (DECMDF_ENABLED || DECMDF_NINCHED) :
			return OLE_TRISTATE_UNCHECKED ;
		default :
			return OLE_TRISTATE_CHECKED ;
	}
}


function checkDocCommand(command,obj){
	if (obj.Busy) return OLE_TRISTATE_GRAY;
	var state = (obj.DOM && obj.DOM.queryCommandValue(command)) ;
	return state ? 1 : 0;
}


function setSelectOptions(obj, value){
	var vArr = value.split(',');
	for(var i=0; i<vArr.length; i+=2){
		var oOption = document.createElement("OPTION");
		oOption.text=vArr[i];
		oOption.value=vArr[i+1];
		obj.add(oOption);
	}
}
