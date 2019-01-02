function ToolbarIni(obj,parent){
	obj.editorObject = parent;
	var items = obj.getElementsByTagName("DIV");
	for (var i=0; i<items.length; ++i){
		var item = items[i];
		if(!item.getAttribute('cm')){
			continue;
		}
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
		this.onEdit && (this.checkState = eval(this.onEdit));
		this.select = this.getElementsByTagName("SELECT")[0];
		this.select && setSelectOptions(this.select, eval(this.cValue));
	}

	function ButtonIni(){
		var obj = this.parent.editorObject;
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
			if (this.state){
				return;
			}
			this.Image.className = 'ButtonOver';
		}
		this.onmouseout = function(){
			if (this.state){
				return;
			}
			this.Image.className = '';
		}

		this.onmousedown = function(){
			if (this.state){
				return;
			}
			this.Image.className = 'ButtonActive';
		}
		this.onmouseup = function(){
			if (this.state){
				return;
			}
			this.Image.className = '';
		}
	}

	function ToolCommandIni(){
		this.onclick = eval(eval(this.cm));
	}

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
