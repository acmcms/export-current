// <%FORMAT: 'js' %>
(window.app || (app = parent.app) || (app = {})) &&
app.Menu || (parent.app && (app.Menu = parent.app.Menu)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	app.Menu = function(target, xmlData){
		var t = this.target = target,
			m = t.menu = this;
		t.shape = t.parentNode; // for Busy effect
		this.clickTimers = [];
		this.groupsContainer = t;
		this.menuTimer = {};
		router.register(this, t, 'form');
		
		Utils.Event.listen(t, "mouseout", function(){
			m.timer || !m.selectedItem || (m.timer = setTimeout(function(){
				m.unselect();
			}, 500));
		});
		Utils.Event.listen(t, "mouseover", function(){
			clearTimeout(m.timer);
			m.timer = null;
		});
		
		this.unselect = function(){
			this.selectedItem.className = '';
			this.selectedItem = null;
		};
	
		this.boxes = {};
		if(xmlData){
			var htmlMenuGroups = xmlData.childNodes;
			for (var i = 0; i < htmlMenuGroups.length; ++i){
				var boxData = htmlMenuGroups[i];
				if(boxData.nodeType != 1){ // not an element
					continue;
				}
				var box = new app.Menu.Box(this, target.appendChild(boxData.cloneNode(false)));
				this.boxes[box.id.split('ContextMenu')[1]] = box;
				// One menu folder can contain several menu groups mixed
				var childNodes = boxData.childNodes;
				for(var j = 0; j < childNodes.length; j++){
					var groupElement = childNodes[j];
					if(groupElement.nodeType != 1){ // not an element
						top.debug && top.debug("panel-menu: skip non element node, block=" + box.id);
						continue;
					}
					this.build(boxData);
				}
			}
		}
	},
	app.Menu.prototype = {
		listen : function(obj, event, fn){
		},
		hideGroups : function(){
			for (var i in this.boxes) {
				this.boxes[i].hideGroups();
			}
		},
		showGroups : function(){
			for (var i in this.boxes) {
				this.boxes[i].showGroups();
			}
		},
		onFire : function(eType, eValue, eObj){
			eObj && (this.sender = eObj);
			clearTimeout(this.menuTimer);
			this.menuTimer = null;
	
			var request = '';
			var path = false;
			switch(eType){
				case "ObjectSelect" :
					this.boxes.NodeForms.hideGroups();
					this.boxes.NodeCommands.hideGroups();
					this.boxes.TreeCommon.hideGroups();
					this.boxes.ContentCommands.loading();
					this.boxes.ContentForms.loading();
					this.boxes.ContentCommands.sender = eObj;
					this.boxes.ContentForms.sender = eObj;
					path = 'menu-object-commands-and-forms.xml?path=' + escape(eValue.path) + (escape(eValue.id) ? '&key='+escape(eValue.id) : '') + (eValue.type ? '&type='+eValue.type : '');
					break;
	
				case "ObjectsSelect" :
					this.boxes.NodeForms.hideGroups();
					this.boxes.NodeCommands.hideGroups();
					this.boxes.TreeCommon.hideGroups();
					this.boxes.ContentForms.loading();
					this.boxes.ContentCommands.loading();
					this.boxes.ContentCommands.sender = eObj;
					this.boxes.ContentForms.sender = eObj;
					path = 'menu-object-commands-and-forms.xml?path=' + escape(eValue.path) + (escape(eValue.ids) ? '&key='+escape(eValue.ids) : '') + (eValue.type ? '&type='+eValue.type : '');
					break;
	
				case "ObjectUnselect" :
					this.boxes.NodeForms.showGroups();
					this.boxes.NodeCommands.showGroups();
					this.boxes.TreeCommon.showGroups();
					this.boxes.ContentCommands.clearAll();
					this.boxes.ContentForms.clearAll();
					return;
	
				case "FieldActivate" :
					this.boxes.FieldContentCommands.clearAll();
					this.boxes.FieldCommands.clearAll();
					this.boxes.FieldCommands.loading();
					this.boxes.FieldCommands.sender = eObj;
					path = 'menu-field.xml?'+eValue.path;
					break;
	
				case "FieldDeactivate" :
					this.boxes.FieldContentCommands.clearAll();
					this.boxes.FieldCommands.clearAll();
					return;
	
				case "FieldItemSelectBegin" :
					this.boxes.FieldContentCommands.loading();
					break;
	
				case "FieldItemSelect" :
					this.boxes.FieldContentCommands.sender = eObj;
					this.build(eValue.xmlData);
					break;
	
				case "FieldItemUnselect" :
					this.boxes.FieldContentCommands.clearAll();
					break;
			}
	
			if(path){
				var target = this.target;
				this.menuTimer = setTimeout(function(){ 
					Containers.executeXmlQuery(target, path + request); 
				}, 250);
			}
		},
		build : function(xmlData){
			var document = this.target.ownerDocument;
			var childNodes = xmlData.childNodes;
			for (var j = 0; j < childNodes.length; j++){
				var currentNode = childNodes[j];
				if(currentNode.nodeType != 1){ // not an element
					continue;
				}
				if(!Dom.firstElement(currentNode)){ // empty group?
					continue;
				}
				var box = this.boxes[currentNode.getAttribute("group")];
				if(!box){
					top.debug && top.debug("panel-menu: skip unknown box: " + currentNode.getAttribute("group"));
					continue;
				}
				box.contentStatus = currentNode.getAttribute("status");
				if(box.contentStatus == 'empty'){
					top.debug && top.debug("panel-menu: clear empty box: " + box.id);
					box.clearAll();
					continue;
				}
				var groupId = currentNode.getAttribute("id");
				var group = box.groups[groupId];
				if(group){
					top.debug && top.debug("panel-menu: updating menu group from XML.");
					this.buildPoints(currentNode, group.List);
				}else{
					var oDiv = document.createElement("div");
					oDiv.id = groupId;
					oDiv.className = 'FrameBorder';
					oDiv.style.width = '100%';
					oDiv.style.overflow = 'hidden';
					oDiv.style.marginBottom = '2px';
					box.target.insertBefore(oDiv, box.target.firstChild);
					var oTable = document.createElement("table");
					oTable.cellPadding = 0;
					oTable.cellSpacing = 0;
					oTable.border = 0;
					oTable.width = '100%';
					oDiv.appendChild(oTable);
					var oTR = oTable.insertRow(-1);
					var oTD = oTR.insertCell(-1);
					oTD.className = 'SubMenuHeader';
	
					var otbl = document.createElement("table");
					otbl.cellPadding = 0;
					otbl.cellSpacing = 0;
					otbl.border = 0;
					otbl.width = '100%';
					oTD.appendChild(otbl);
					var oTR = otbl.insertRow(0);
					var oTD = oTR.insertCell(0);
					oTD.innerHTML = currentNode.getAttribute("title");
	
					var oTD = oTR.insertCell(1);
					oTD.style.textAlign = 'right';
					oTD.innerHTML = "&#x25BC;";
	
					var oTR = oTable.insertRow(1);
					oTR.style.display = 'none';
					var oTD = oTR.insertCell(0);
					oTD.className = 'SubmenuButton';
					oTD.style.backgroundColor = 'threedhighlight';
					if(currentNode.getAttribute("status") == 'true'){
						this.buildPoints(currentNode, oTD);
					}
					top.debug && top.debug("panel-menu: creating menu group from XML.");
					group = new app.Menu.Group(this, box, oDiv);
					box.groups[groupId] = group;
					group.commandType = currentNode.getAttribute("commandType");
				}
				if(currentNode.getAttribute("status") == 'true'){
					group.pointsIni();
					group.blockOn();
				}
			}
		},
		buildPoints : function(xmlData, target){
			if(!Dom.firstElement(xmlData)){
				target.innerHTML = "";
				top.debug && top.debug("panel-menu: build, empty data: cleaning items");
				return;
			}
			var document = target.ownerDocument;
			var table = document.createElement("table");
			table.setAttribute("border", 0);
			table.setAttribute("cellpadding", 2);
			table.setAttribute("cellspacing", 0);
			table.border = 0;
			table.cellPadding = 2;
			table.cellSpacing = 0;
			table.setAttribute("width", "100%");
			var childNodes = xmlData.childNodes;
			for (var j = 0; j < childNodes.length; j++){
				var node = childNodes[j];
				if(node.nodeType != 1){ // not an element
					top.debug && top.debug("panel-menu: build, skip item: not an element");
					continue;
				}
				var tr = table.insertRow(-1);
				function a(key, val){
					(val || (val = node.getAttribute(key))) && tr.setAttribute(key, val);
				}
				a("myCmd");
				a("path");
				a("key");
				a("cmd");
				a("description");
				var td1 = tr.insertCell(0);
				td1.setAttribute("valign", "top");
				var img = document.createElement("img");
				img.setAttribute("src", "icons/" + node.getAttribute("icon") + ".32.gif");
				img.style.height = "32px";
				img.style.width = "32px";
				td1.appendChild(img);
				var td2 = tr.insertCell(1);
				td2.setAttribute("width", "100%");
				td2.innerHTML = node.getAttribute("title");
				top.debug && top.debug("panel-menu: build, item inserted: element=" + node.nodeName + ", result=" + tr.innerHTML);
			}
			target.firstChild 
				? target.replaceChild(table, target.firstChild) 
				: target.appendChild(table);
		}
	},
	app.Menu.Box = function(menu, target, data){
		this.groups = {};
		this.menu = menu;
		this.target = target;
		this.id = target.id;
		this.displayStatus =  Utils.Cookies.read("menu_"+this.id, "");
	},
	app.Menu.Box.prototype = {
		hideGroups : function(){
			for (var i in this.groups){
				this.groups[i].blockOff();
			}
		},
		showGroups : function(){
			for (var i in this.groups){
				this.groups[i].blockOn();
			}
		},
		clearAll : function(){
			this.groups = {};
			this.sender = null;
			this.eType = null;
			this.eValue = null;
			this.contentStatus = false;
			this.target.innerHTML = "";
		},
		loading : function(){
			this.clearAll();
		}
	},
	app.Menu.Group = function(menu, box, oDiv){
		this.menu = menu;
		this.box = box;
		var firstElement = Dom.firstElement(oDiv);
		this.headerRow = firstElement.rows[0];
		this.headerRow.parent = this;
		this.headerRow.onclick = function(){
			this.parent.switchBlock();
		};
		this.headerRow.switcher = Dom.firstElement(this.headerRow.cells[0]).rows[0].cells[1];
		this.List = firstElement.rows[1].cells[0];
		this.List || (window.top.debug && window.top.debug("panel-menu: group list is undefined"));
		this.status = false;
	},
	app.Menu.Group.prototype = {
		switchBlock : function(){
			if(!this.status){
				this.box.displayStatus = '';
				Utils.Cookies.erase("menu_"+this.box.id);
				if (this.box.contentStatus == 'hide'){
					menu.onFire(this.box.eType, this.box.eValue, this.box.sender);
					return;
				}
				this.blockOn();
			}else{
				this.box.displayStatus = 'none';
				Utils.Cookies.create("menu_"+this.box.id, 'none', 3650);
				this.blockOff();
			}
		},
		blockOn : function(){
			this.status = true;
			this.List.parentNode.style.display = '';
			this.headerRow.switcher.innerHTML = "&#x25BC;";
		},
		blockOff : function(){
			this.status = false;
			this.List.parentNode.style.display = 'none';
			this.headerRow.switcher.innerHTML = "&#x25C4;";
		},
		pointsIni : function(){
			var table = Dom.firstElement(this.List);
			for (var i = 0; i < table.rows.length; ++i){
				curTR = table.rows[i];
				curTR.path = curTR.getAttribute("path");
				curTR.cmd = curTR.getAttribute("cmd");
				curTR.myCmd = curTR.getAttribute("myCmd");
				curTR.key = curTR.getAttribute("key");
				curTR.title = curTR.getAttribute("title");
				curTR.parent = this;
				curTR.ondblclick = function(){
					return false;
				};
				curTR.onmousedown = function(){
					this.className = '';
				};
				curTR.onmouseover = function(){
					this.parent.box.menu.selectedItem && (this.parent.box.menu.selectedItem.className = '');
					this.parent.box.menu.selectedItem = this;
					this.className = 'on';
				};
				curTR.openWindow = function(url){
					var W = 600; H = 400;
					var winSize = Utils.Cookies.read("winSize", "");
					if(winSize){
						W = winSize.split(',')[0];
						H = winSize.split(',')[1];
					}
					var arg = [];
					arg.sender = this.parent.box.sender;
					Windows.open(url, arg, "", "height="+H+", width="+W);
				};
				curTR.onclick = function(){
					switch(this.parent.commandType){
					case 'form' :
						if(this.myCmd){
							var src = 'execute.xml?type=form' + (this.path ? '&path=' + this.path : '') + (this.key ? '&key=' + escape(this.key) : '') + (this.myCmd ? '&' + this.myCmd + '=true' : '');
							Containers.executeXmlQuery(this, src, router);
						}else{
							var src = 'execute.xml?type=form' + (this.path ? '&path=' + this.path : '') + (this.key ? '&key=' + escape(this.key) : '') + (this.cmd ? '&cmd=' + this.cmd : '');
							router.fire("Submit", this.parent.menu.id, {
								src : src,
								cmd : this.cmd,
								cbk : this
							}, this.parent.menu);
						}
						break;
		
					case 'form_field' :
						if(this.myCmd){
							var w = window.showModalDialog(this.path, {sender : this.parent.box.sender}, "dialogWidth:500px; dialogHeight:145px; scroll:no; status:no; resizable:yes; help:no");
							return;
						}else{
							var src = 'execute.xml?type=form' + (this.key ? '&key=' + escape(this.key) : '') + (this.cmd ? '&'+this.cmd+'=1' : '');
							Containers.executeXmlQuery(this, src, router);
						}
						break;
		
					default:
						var src = 'execute.xml?type='+this.parent.commandType + (this.path ? '&path=' + this.path : '') + (this.key ? '&key=' + escape(this.key) : '') + (this.cmd ? '&cmd=' + this.cmd : '');
						Containers.executeXmlQuery(this, src, router);
						break;
					}
				};
				curTR.executed = function(xmlData){
					var currentNode = Dom.firstElement(xmlData);
					if(!currentNode){
						router.fire("CommandError", this.parent.menu.id, false, this.parent.menu);
						return;
					}
					var type = currentNode.getAttribute("type");
					var sender = (this.parent.sender || this.parent.box.sender);
					switch(type){
						case 'error':
							alert(currentNode.text || currentNode.textContent);
							router.fire("CommandError", this.parent.menu.id, false, this.parent.menu);
							break;
						case 'string':
							alert(currentNode.text || currentNode.textContent);
							sender ? sender.refresh() : router.fire("SubmitDone");
							break;
						case 'url':
							var text = currentNode.text || currentNode.textContent;
							window.open(text, '', '');
							router.fire("Done", this.parent.menu.id, text, this.parent.menu);
							break;
						case 'confirmation':
							var confirm = Windows.confirm(currentNode.getAttribute("title"));
							if(!confirm){
								return;
							}
							var src = 'execute.xml?type=form&key=' + currentNode.getAttribute("id") + '&cmd=' + currentNode.getAttribute("cmd") + '&__confirmation=1';
							Containers.executeXmlQuery(this, src, router);
							break;
						case 'form':
							var src = 'form.htm?id=' + currentNode.getAttribute("id");
							if(this.parent.commandType != 'form'){
								this.openWindow(src);
							}else{
								if(currentNode.getAttribute("id") == this.key){
									router.fire("FormRefresh", this.parent.menu.id, src, this.parent.menu);
								}else{
									router.fire("FormChangeLocation", this.parent.menu.id, src, this.parent.menu);
								}
							}
							break;
						case 'apply':
							if(this.parent.commandType != 'node_form_open'){
								if(xmlData.childNodes){
									var oXML = new ActiveXObject("Microsoft.XMLDOM");
									var oRoot = oXML.createNode(1,"entry","");
									oRoot.setAttribute('type','apply');
									oXML.appendChild(oRoot);
									var childNodes = currentNode.childNodes;
									for(var i = 0; i < childNodes.length; ++i){
										var cNode = childNodes[i];
										if(cNode.nodeType != 1){ // not an element
											continue;
										}
										if(cNode.getAttribute('type') == 'field'){
											var oNode = oXML.createNode(1,"entry","");
											oNode.setAttribute('type','field');
											for (var j = 0; j < cNode.attributes.length; j++){
												if(cNode.attributes[j].nodeName.indexOf('cmd') == 0){
													oNode.setAttribute(cNode.attributes[j].nodeName, cNode.attributes[j].nodeValue);
												}
											}
											oRoot.appendChild(oNode);
										}
									}
									currentNode = oRoot;
								}
								sender 
									? sender.refresh()
									: router.fire("ApplyDone", this.parent.menu.id, currentNode, this.parent.menu);
							}
							break;
						case 'done':
							if(this.parent.commandType != 'node_form_open'){
								sender 
									? sender.refresh()
									: router.fire("SubmitDone");
							}
							break;
					}
				};
				curTR.setLocation = function(path){
					router.fire("FormChangeLocation", this.parent.menu.id, path, this.parent.menu);
				};
				curTR.submit = function(path,targettype){
					router.fire("Submit", this.parent.menu.id, {Url : path, TargetType : targettype}, this.parent.menu);
				};
				curTR.close = function(){
					router.fire("Close", this.parent.menu.id, false, this.parent.menu);
				};
			}
		}
	},
app.Menu) // <%/FORMAT%>