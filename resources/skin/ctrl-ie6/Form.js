//var Windows = [];
var Objects = [];
var iBuffers = [];

try{
	ParentEventMethods = parent.eventMethods;
}catch(Error){}
var eventMethods = CreateEventMethods();

try{
	Windows = parent.Windows;
}catch(Error){}


var mForm = {};
mForm.id = 'form';
eventMethods.register(mForm,'ContextMenu');

mForm.ini = function(){
	this.buffer = document.all['formBuffer'];
	this.fBody = FBODY;
	this.statusbar = this.statusBarIni();
}

mForm.refresh = function(){
	parent.eventMethods.fire("FormRefresh",mForm.id,mForm.path,mForm);
	document.location = document.location;
}

mForm.setLocation = function(path){
	document.location = path;
}

mForm.submit = function(eValue){
	if(this.Status) return;
	this.Status = eValue.cmd;
	this.statusbar.processStart(eValue.cmd);
//	this.fBody.target = '_blank';
	this.fBody.action = eValue.src;
	this.fBody.target = eValue.target;
//	this.fBody.action = <&type=FormMethodExecutionResult.htm";
	this.fBody.submit();
}

mForm.submitDone = function(){
	setTimeout("window.close();",500);
	dialogArguments['sender'].refresh();
/*
	switch(this.Status){
		case "submit-":
			setTimeout("window.close();",1000);
			break;
		case "submit-apply-":
			if(url && url!=""){
				this.Status = false;
				this.statusbar.processEnd();
				this.statusbar.text("Done");
				window.document.location=url;
				return;
			}
			this.Status = false;
			this.statusbar.processEnd();
			this.statusbar.text("Done");
			break;
	}
	dialogArguments['sender'].refresh();
*/
}

mForm.applyDone = function(eValue){
	if(eValue){
		for(var i=0; i<eValue.childNodes.length; ++i){
			try{
				var currentNode = eValue.childNodes[i];
				var obj = eval( 'fld__'+currentNode.getAttribute('CMDid') );
				if(obj.valueObject) obj = eval(obj.valueObject);
				if(currentNode.getAttribute('CMDvalue')){
					obj.setValue(currentNode)
				}else{
					obj.refresh();
				}
			}catch(Error){}
		}
	}
	this.Status = false;
	this.statusbar.processEnd();
	this.statusbar.text("Done");
	if(eValue.getAttribute('type') && eValue.getAttribute('type') == 'apply'){
		try{
			dialogArguments.sender.refresh();
		}catch(Error){}
	}
}

mForm.done = function(){
	this.Status = false;
	this.statusbar.processEnd();
	this.statusbar.text("Done");
}

mForm.close = function(){
	window.close();
}

mForm.switchWholeWindowMode = function(objID){
	var tNode = document.all.wholeWindowNode;
	if(!tNode) return;

	var status = tNode.status ? false : true;
	tNode.status = status;
	var tNodeParent = document.all.wholeWindow;
	var sNode = document.all[objID+'_obj'];
	tNode.swapNode(sNode);

	var tables = getElementsByAttribute(document.body,'object','formTable');
	for (var i=0; i<tables.length; ++i){
		table = tables[i];
		for(var j=0; j<table.rows.length; j++){
			table.rows[j].style.display = status ? 'none' : '';
		}
	}

	tables[0].style.height = status ? '100%' : tables[0].height ? tables[0].height : '';
	tNodeParent.firstChild.style.height = status ? '100%' : '';
	tNodeParent.style.display = status ? '' : 'none';
}

mForm.onFire = function(eType,eValue,eObj){
	switch (this.type){
		case 'Navigation':
			switch (eType){
				case 'ItemSelect':
					try{
						ParentEventMethods.fire('ObjectSelect',this.id,{'path':eValue.path,'id':eValue.id},mForm);
					}catch(Error){
						//
					}
					eventMethods.fire('ObjectSelect',this.id,eValue,eObj);
					break;
				case 'ItemsSelect':
					try{
						ParentEventMethods.fire('ObjectsSelect',this.id,{'path':eValue.path,'id':eValue.id},mForm);
					}catch(Error){
						//
					}
					eventMethods.fire('ObjectsSelect',this.id,eValue,eObj);
					break;
				case 'ItemUnselect':
					eventMethods.fire('ObjectUnselect',this.id,false);
					break;
				case 'ItemActivate':
					try{ParentEventMethods.fire('ChangeLocation',this.id,{'path':eValue.path + eValue.id},mForm);}
					catch(Error){}
					this.setLocation('defaultAction?path=' + eValue.path + eValue.id + '<%=mode=='link' ? '&mode=link' : ''%>')
					break;
				case 'ChangeLocation':
					try{ParentEventMethods.fire('ChangeLocation',this.id,{'path':eValue.path},mForm);}
					catch(Error){}
					this.setLocation('defaultAction?path=' + eValue.path + '<%=mode=='link' ? '&mode=link' : ''%>')
					break;

				case 'SetListActive':
					try{ParentEventMethods.fire('SetListActive',this.id,{'path':eValue.path});}
					catch(Error){}
					break;
			}

		default:
			switch(eType){
				case "SetListSelected":
					parent.eventMethods.fire(eType,mForm.id,eValue,mForm);
					eventMethods.fire('ObjectSelected',mForm.id,eValue['id'],eObj);

		//			mForm.eventMethods.fire(eType,mForm.id,srcz+"&Key="+eValue['id'],eObj);
					break;
				case "SetListUnselected":
					eventMethods.fire(eType,mForm.id,eValue,this);
					break;
				case "SetListRefresh":
					parent.eventMethods.fire(eType,mForm.id,eValue,mForm);
					break;
				case "FormChangeLocation":
					parent.eventMethods.fire(eType,mForm.id,eValue,mForm);
					this.setLocation(eValue);
					break;
				case "FormRefresh":
					this.setLocation(eValue);
					break;
				case "Submit":
					this.submit(eValue);
					break;
				case "SubmitDone":
					this.submitDone();
					break;
				case "ApplyDone":
					this.applyDone(eValue);
					break;
				case "Done":
					this.done();
					break;
				case "Close":
					this.close();
					break;
				case "CommandError":
					this.statusbar.error(eValue);
					break;
			}

	}
}

mForm.statusBarIni = function(){
	var obj = FormStatusBar;
	if(!obj) return false;
	obj.StatusText = obj.cells[0].firstChild.cells[0];
	obj.StatusWorm = obj.cells[0].firstChild.cells[1];

	obj.onclick = function(){
		document.all['formBuffer'].style.display = '';
		document.all['formBuffer'].style.width = 100;
		document.all['formBuffer'].style.height = 100;
	}

	obj.processStart = function(text){
		this.processEnd();
		this.text(text);
		var oTable = document.createElement("TABLE");
		oTable.border = 0;
		oTable.width = '100%'
		oTable.cellpadding = 0;
		oTable.cellspacing = 2;
		this.StatusWorm.insertAdjacentElement("afterBegin",oTable);
		var oTR = oTable.insertRow();
		for(var i=0; i<12; ++i){
			var oTD = oTR.insertCell();
			var oImg = document.createElement("IMG");
			oImg.width=1;
			oImg.height=8;
			oTD.insertAdjacentElement("afterBegin",oImg);
		}
		this.ProcessCount = 0;
		this.ProcessTimer = setInterval("mForm.statusbar.processing()",10);
	}

	obj.processing = function(){
		try{clearTimeout(this.ProcessTimer);}catch(Error){}
		this.ProcessTimer = null;
		if(this.ProcessCount == 12){
			for(var i=0; i<12; ++i) this.StatusWorm.firstChild.cells[i].style.backgroundColor = '';
			this.ProcessCount = 0;
		}
		this.StatusWorm.firstChild.cells[this.ProcessCount].style.backgroundColor = 'highlight';
		this.ProcessCount ++;
		this.ProcessTimer = setInterval("mForm.statusbar.processing()",100);	
	}

	obj.processEnd = function(){
		try{clearTimeout(this.ProcessTimer);}catch(Error){}
		this.ProcessTimer = null;
		this.StatusWorm.innerHTML = '';
	}

	obj.text = function(text){
		this.StatusText.innerHTML = text;
	}

	obj.error = function(text){
		this.parent.Status = false;
		this.processEnd();
		this.text("Error");
		if(text){
			this.StatusText.onclick = function(){
				WIN.alert(text);
			}
			this.StatusText.onclick();
		}
	}
	obj.parent = this;
	return obj;
}


function getSelectParent(obj,atr){
	while(obj.parentNode){
		if (obj.getAttribute(atr) || obj.id == atr) return obj;
		obj = obj.parentNode;
	}
	return false;
}