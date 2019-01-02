window.mForm || (mForm = parent.mForm) || (mForm = {
	id : 'form',
	form : undefined,
	buffer : undefined,
	statusbar : undefined,
	
	ini : function(){
		this.buffer = document.getElementById("formBuffer");
		this.form = document.getElementById("FBODY");
		this.statusbar = this.statusBarIni();
	},
	refresh : function(){
		parent.router && parent.router.fire("FormRefresh", mForm.id, mForm.path, mForm);
		document.location = document.location;
	},
	setLocation : function(path){
		document.location = path;
	},
	submit : function(eValue){
		if(this.Status){
			return;
		}
		this.Status = eValue.cmd;
		this.statusbar.processStart(eValue.cmd);
		eValue.src && (this.form.action = eValue.src);
		this.form.submit();
	},
	submitDone : function(){
		setTimeout("window.close();",500);
		window.dialogArguments && dialogArguments.sender && dialogArguments.sender.refresh();
	},
	applyDone : function(eValue){
		if(eValue){
			for(var i=0; i<eValue.childNodes.length; ++i){
				var currentNode = eValue.childNodes[i];
				if(currentNode.nodeType != 1){ // not an element
					continue;
				}
				var obj = document.getElementById( 'fld__'+currentNode.getAttribute('CMDid') );
				obj.valueObject && (obj = eval(obj.valueObject));
				currentNode.getAttribute('CMDvalue') ? obj.setValue(currentNode) : obj.refresh();
			}
		}
		this.Status = false;
		this.statusbar.processEnd();
		this.statusbar.setText("Done");
		if(eValue.getAttribute('type') && eValue.getAttribute('type') == 'apply'){
			window.dialogArguments && dialogArguments.sender && dialogArguments.sender.refresh();
		}
	},
	done : function(){
		this.Status = false;
		this.statusbar.processEnd();
		this.statusbar.setText("Done");
	},
	close : function(){
		window.close();
	},
	switchWholeWindowMode : function(objID){
		var tNode = document.getElementById('wholeWindowNode');
		if(!tNode){
			return;
		}
	
		var status = !tNode.status;
		tNode.status = status;
		var tNodeParent = document.getElementById('wholeWindow');
		var sNode = document.getElementById(objID+'_obj');
		{
			var next = sNode.nextSibling,
				// sibling could be null
				spar = sNode.parentNode;
			tNode.parentNode.replaceChild(sNode, tNode);
			spar.insertBefore(tNode, next);
			// tNode.swapNode(sNode);
		}
	
		var tables = Dom.getElementsByAttribute(document.body, 'object', 'formTable');
		for (var i=0; i<tables.length; ++i){
			table = tables[i];
			for(var j=0; j<table.rows.length; j++){
				table.rows[j].style.display = status ? 'none' : '';
			}
		}
	
		tables[0].style.height = status ? '100%' : tables[0].height ? tables[0].height : '';
		tNodeParent.firstChild.style.height = status ? '100%' : '';
		tNodeParent.style.display = status ? '' : 'none';
	},
	onFire : function(eType, eValue, eObj){
		switch (this.type){
			case 'Navigation':
				switch (eType){
					case 'ItemSelect':
						parent.router && parent.router.fire('ObjectSelect', this.id, {
							path : eValue.path,
							id : eValue.id
						}, mForm);
						router.fire('ObjectSelect', this.id, eValue, eObj);
						break;
					case 'ItemsSelect':
						parent.router && parent.router.fire('ObjectsSelect', this.id, {
							path : eValue.path,
							id : eValue.id
						}, mForm);
						router.fire('ObjectsSelect', this.id, eValue,eObj);
						break;
	
					case 'ItemUnselect':
						router.fire('ObjectUnselect', this.id, false);
						break;
	
					case 'ItemActivate':
						parent.router && parent.router.fire('ChangeLocation', this.id, {
							path : eValue.path + eValue.id
						}, mForm);
						this.setLocation('defaultAction?path=' + eValue.path + eValue.id + (mForm.mode == "link" ? "&mode=link" : ""));
						break;
					case 'ChangeLocation':
						parent.router && parent.router.fire('ChangeLocation',this.id,{path : eValue.path},mForm);
						this.setLocation('defaultAction?path=' + eValue.path + (mForm.mode == "link" ? "&mode=link" : ""));
						break;
	
					case 'SetListActive':
						parent.router && parent.router.fire('SetListActive',this.id,{path : eValue.path});
						break;
				}
	
			default:
				switch(eType){
					case "SetListSelected":
						parent.router && parent.router.fire(eType, mForm.id, eValue, mForm);
						router.fire('ObjectSelected', mForm.id, eValue.id, eObj);
						break;
					case "SetListUnselected":
						router.fire(eType, mForm.id, eValue, this);
						break;
					case "SetListRefresh":
						parent.router && parent.router.fire(eType, mForm.id, eValue, mForm);
						break;
					case "FormChangeLocation":
						parent.router && parent.router.fire(eType, mForm.id, eValue, mForm);
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
	},
	statusBarIni : function(){
		var status = document.getElementById("FormStatusBar");
		if(!status){
			return false;
		}
		var statusRow = status.rows[0].cells[0].firstElementChild.rows[0];
		status.StatusText = statusRow.cells[0];
		status.StatusWorm = statusRow.cells[1];
	
		status.onclick = function(){
			mForm.buffer.style.width = "100px";
			mForm.buffer.style.height = "100px";
			mForm.buffer.style.display = '';
		};
	
		status.processStart = function(text){
			this.processEnd();
			this.setText(text);
			var oTable = document.createElement("TABLE");
			oTable.border = 0;
			oTable.width = '100%'
			oTable.cellpadding = 0;
			oTable.cellspacing = 2;
			this.StatusWorm.insertBefore(oTable, this.StatusWorm.firstChild);
			var oTR = oTable.insertRow(-1);
			for(var i=0; i<12; ++i){
				var oTD = oTR.insertCell(-1);
				var oImg = document.createElement("IMG");
				oImg.width=1;
				oImg.height=8;
				oTD.appendChild(oImg);
			}
			this.ProcessCount = 0;
			this.ProcessTimer = setInterval("mForm.statusbar.processing()",10);
		};
	
		status.processing = function(){
			try{
				clearTimeout(this.ProcessTimer);
			}catch(Error){
				//
			}
			this.ProcessTimer = null;
			if(this.ProcessCount == 12){
				for(var i=0; i<12; ++i){
					this.StatusWorm.firstChild.rows[0].cells[i].style.backgroundColor = '';
				}
				this.ProcessCount = 0;
			}
			this.StatusWorm.firstChild.rows[0].cells[this.ProcessCount].style.backgroundColor = 'highlight';
			this.ProcessCount ++;
			this.ProcessTimer = setInterval("mForm.statusbar.processing()",100);	
		};
	
		status.processEnd = function(){
			try{
				clearTimeout(this.ProcessTimer);
			}catch(Error){
				//
			}
			this.ProcessTimer = null;
			this.StatusWorm.innerHTML = '';
		};
	
		status.setText = function(text){
			this.StatusText.innerHTML = text;
		};
	
		status.error = function(text){
			this.parent.Status = false;
			this.processEnd();
			this.setText("Error");
			if(text){
				this.StatusText.onclick = function(){
					Windows.alert(text);
				};
				this.StatusText.onclick();
			}
		};
		status.parent = this;
		return status;
	}
},
window.router || (window.require && requireScript("app/Router.js"), router = new Router("form")),
router.register(mForm,'ContextMenu'))
