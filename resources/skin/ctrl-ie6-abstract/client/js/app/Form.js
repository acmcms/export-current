// <%FORMAT: 'js' %>
(window.app || (app = parent.app) || (app = {})) &&
app.Form || (parent.app && (app.Form = parent.app.Form)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	app.Form = function(document){
		this.document = document;
	},
	app.Form.prototype = {
		id : 'form',
		form : undefined,
		mode : 'none',
		statusbar : undefined,
	
		ini : function(){
			this.form = this.document.getElementById("FBODY");
			this.statusbar = this.createStatusBar();
		},
		refresh : function(){
			router.fire("FormRefresh", this.id, this.path, this);
			this.document.location.replace(this.document.location.href);
		},
		setLocation : function(path){
			this.document.location = path;
		},
		submit : function(eValue){
			if(this.Status){
				return;
			}
			this.Status = eValue.cmd;
			this.statusbar.processStart(eValue.cmd);
			this.form.submit();
		},
		submitDone : function(){
			setTimeout("window.close()",250);
			window.dialogArguments && dialogArguments.sender && dialogArguments.sender.refresh();
		},
		applyDone : function(eValue){
			if(eValue){
				var childNodes = eValue.childNodes;
				for(var i = 0; i < childNodes.length; ++i){
					var node = childNodes[i];
					if(node.nodeType != 1){ // not an element
						continue;
					}
					var obj = this.document.getElementById( 'fld__'+node.getAttribute('CMDid') );
					obj.valueObject && (obj = eval(obj.valueObject));
					node.getAttribute('CMDvalue') ? obj.setValue(node) : obj.refresh();
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
			if(this.statusbar){
				this.statusbar.processEnd();
				this.statusbar.setText("Done");
			}
		},
		close : function(){
			this.done();
			this.statusbar = undefined;
			window.close();
		},
		switchWholeWindowMode : function(objID){
			var tNode = this.document.getElementById("wholeWindowNode");
			if(!tNode){
				return;
			}
		
			var status = !tNode.status;
			tNode.status = status;
			var tNodeParent = this.document.getElementById("wholeWindow");
			var sNode = document.getElementById(objID+'_obj');
			{
				var next = sNode.nextSibling,
					// sibling could be null
					spar = sNode.parentNode;
				tNode.parentNode.replaceChild(sNode, tNode);
				spar.insertBefore(tNode, next);
				// tNode.swapNode(sNode);
			}
		
			var tables = Dom.getElementsByAttribute(this.document.body, 'object', 'formTable');
			for (var i = 0; i<tables.length; ++i){
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
							router.fire('ObjectSelect',this.id,{
								path : eValue.path,
								id : eValue.id
							},this);
							router.fire('ObjectSelect',this.id,eValue,eObj);
							break;
						case 'ItemsSelect':
							router.fire('ObjectsSelect',this.id,{
								path : eValue.path,
								id : eValue.id
							},this);
							router.fire('ObjectsSelect',this.id,eValue,eObj);
							break;
		
						case 'ItemUnselect':
							router.fire('ObjectUnselect',this.id);
							break;
		
						case 'ItemActivate':
							router.fire('ChangeLocation',this.id,{
								path : eValue.path + eValue.id
							},this);
							this.setLocation('defaultAction?path=' + eValue.path + eValue.id + (this.mode == "link" ? "&mode=link" : ""));
							break;
						case 'ChangeLocation':
							router.fire('ChangeLocation',this.id,{
								path : eValue.path
							},this);
							this.setLocation('defaultAction?path=' + eValue.path + (this.mode == "link" ? "&mode=link" : ""));
							break;
		
						case 'SetListActive':
							router.fire('SetListActive',this.id,{
								path : eValue.path
							});
							break;
					}
		
				default:
					switch(eType){
						case "SetListSelected":
							router.fire(eType, this.id, eValue, this);
							router.fire('ObjectSelect', this.id, eValue.id, eObj);
							break;
						case "SetListUnselected":
							router.fire(eType, this.id, eValue, this);
							break;
						case "SetListRefresh":
							router.fire(eType, this.id, eValue, this);
							break;
						case "FormChangeLocation":
							router.fire(eType, this.id, eValue, this);
							this.setLocation(eValue);
							break;
						case "FormRefresh":
							this.setLocation(eValue);
							break;
						case "Submit":
							top.debug && top.debug("form: submit event: src=" + eValue.src + ", cbk=" + eValue.cbk);
							eValue.cbk && (this.form.executed = function(xmlData){
								eValue.cbk.executed(xmlData);
							});
							var container = Containers.createFormSubmissionBuffer(this.form.ownerDocument.body, this.form, eValue.src);
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
		createStatusBar : function(){
			var status = this.document.getElementById("FormStatusBar");
			if(!status){
				return false;
			}
			var statusRow = status.rows[0];
			status.StatusText = statusRow.cells[0];
			status.StatusWorm = statusRow.cells[1];
			
			status.document = this.document;
		
			status.onclick = function(){
				return false;
			};
		
			status.processStart = function(text){
				this.processEnd();
				this.setText(text);
				var oTable = this.document.createElement("TABLE");
				oTable.border = 0;
				oTable.width = '100%'
				oTable.cellpadding = 0;
				oTable.cellspacing = 2;
				this.StatusWorm.insertBefore(oTable, this.StatusWorm.firstChild);
				var oTR = oTable.insertRow(-1);
				for(var i = 0; i<12; ++i){
					var oTD = oTR.insertCell(-1);
					var oImg = this.document.createElement("IMG");
					oImg.width=1;
					oImg.height=8;
					oTD.appendChild(oImg);
				}
				this.ProcessCount = 0;
				this.ProcessTimer = setTimeout(function(){
					status.processing();
				}, 110);
			};
		
			status.processing = function(){
				if(this.ProcessCount == 12){
					for(var i = 0; i<12; ++i){
						this.StatusWorm.firstChild.rows[0].cells[i].style.backgroundColor = '';
					}
					this.ProcessCount = 0;
				}
				this.StatusWorm.firstChild.rows[0].cells[this.ProcessCount].style.backgroundColor = 'highlight';
				this.ProcessCount ++;
				/**
				 * if cancelled, reduce race
				 */
				this.ProcessTimeout != null || (this.ProcessTimer = setTimeout(function(){
					status.processing();
				}, 110));
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
				this.form.Status = false;
				this.processEnd();
				this.setText("Error");
				if(text){
					this.StatusText.onclick = function(){
						Windows.alert(text);
					};
					this.StatusText.onclick();
				}
			};
			status.form = this;
			return status;
		}
	},
app.Form) // <%/FORMAT%>