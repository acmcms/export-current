window.Tree || (Tree = parent.Tree) || (Tree = function(target, action, highlight){
	// v0.2
	top.debug && top.debug("Tree: initialize: target=" + target + ", targetNodeName=" + target.nodeName + ", action=" + action);
	this.element = (target && target.canvas) || target;
	this.element.element = target;
	this.tree = this.element.tree = this;
	this.dataSource = action || "tree.xml";
	this.dataSource += this.dataSource.indexOf('?') == -1 ? '?' : '&';
	this.element.returnValue = {};
	router.register(this, this.element, 'form');
	top.debug && top.debug("Tree: document ready, initiating xml query");
	requireScript("/!/skin/ctrl-ie6-abstract/client/js/app/Containers.js");
	Containers.executeXmlQuery(
					target,
					this.dataSource + (highlight ? "path=" + highlight + "&" : "" ) + "maxlevel=2",
					router);
	this.element.onclick = function(e){
		e || (e = window.event);
		var o = (e.srcElement || e.target);
		top.debug && top.debug("Tree: onclick event");
		this.tree.selectOn(o) && this.putResult();
		return false;
	};
	this.element.oncontextmenu = function(e){
		e || (e = window.event);
		var o = (e.srcElement || e.target);
		o.click();
		return true;
	};
	this.element.onselectstart = function(){
		return false;
	};
	this.element.ondblclick = function(){
		top.debug && top.debug("Tree: ondblclick event");
		this.tree.searchOpenThreads();
	};
},
Tree.prototype = {
	reloadPeriod : 60000,
	tree : undefined,

	_preloaded : {},
	
	_preload : function(name){
		this._preloaded[name] = new Image(16, 16);
		this._preloaded[name].src = "$files/folder-"+name+".gif";
	},
	
	onFire : function(eType, eValue, eObj){
		switch(eType){
			case "ChangeLocation":
				(eValue.path.substr(eValue.path.length - 1) != '/') && (eValue.path += '/');
				this.goToPath = eValue.path;
				this.gotoThread();
				break;
			case "FormRefresh":
			case "SetListRefresh":
				this.reloadThread(eValue);
				break;
			case "SetListActive":
				(eValue.path.substr(eValue.path.length - 1) != '/') && (eValue.path += '/');
				this.goToPath = eValue.path;
				this.gotoThread();
				break;
		}
	},
	executeCollapseAll : function(){
		window.top.debug && window.top.debug("Tree command: executeCollapseAll, id=" + this.element.id);
		Containers.executeXmlQuery(this.element, this.dataSource, router);
	},
	executeRefreshTree : function(collapse){
		window.top.debug && window.top.debug("Tree command: executeCollapseAll, id=" + this.element.id);
		Containers.executeXmlQuery(this.element, this.dataSource + "maxlevel=2", router);
	},
	_treeChange : function() {
		top.debug && top.debug("Tree: item clicked: value=" + this.returnValue.path);
		router.fire("treeChange", "tree", this.returnValue);
	},
	_refreshThread : function(){
		window.top.debug && window.top.debug("Tree: refresh leaf: id=" + this.id);
		this.hide();
		this.open();
	},
	_hideThread : function(){
		if(!this.childThread.displayMode) {
			return;
		}
		window.top.debug && window.top.debug("Tree: hide lead: id=" + this.id);
		this.childThread.displayMode = false;
		this.childThread.parentNode.style.display = 'none';
		this.firstChild.src = Tree.prototype._preloaded.plus.src;
	},
	_displayThread : function(){
		if(this.childThread.displayMode || this.childThread.childLoad != true) {
			return;
		}
		window.top.debug && window.top.debug("Tree: display leaf: id=" + this.id);
		this.childThread.displayMode = true;
		this.childThread.parentNode.style.display = '';
		this.firstChild.src = Tree.prototype._preloaded.minus.src;
	},
	_openThread : function(){
		window.top.debug && window.top.debug("Tree: open leaf: id=" + this.id);
		this.firstChild.src = Tree.prototype._preloaded.minus.src;
		var oTable = this.parentNode.parentNode.parentNode;
		var goToPath = oTable.TD.childs.goToPath && oTable.TD.childs.goToPath.replace(oTable.path,'/');
		var request = 'root=' + oTable.path;
		goToPath && (request += '&path=' + goToPath);
		Containers.executeXmlQuery(this, this.tree.dataSource + request);
	},
	_switchThreadMode : function(){
		if (String(this.childThread.hasChild) != "true") {
			return;
		}
		if (!this.childThread.childLoad) {
			this.open();
			return;
		}
		if (this.childThread.displayMode) {
			this.hide();
			return;
		}
		if (!this.childThread.displayMode) {
			var tp = this.reloadPeriod;
			(new Date().getTime() - this.CTime > tp) ? this.open() : this.show();
			return;
		}
	},
	build : function(xmlData, node){
		if (!node.treeLevel && !node.isSwitchElement){
			node.treeLevel = 0
			node.selectParent = true;
			node.multiSelect = true;
			node.tree = this;
			node.putResult = this._treeChange;
			node.style.cursor = 'default';
			node.innerHTML = "";
		}
		for (var i = 0; i < xmlData.childNodes.length; ++i){
			var currentNode = xmlData.childNodes[i];
			if(currentNode.nodeType != 1){ // not an element
				continue;
			}
			var oTable;
			var oTD;
			if(!node.isSwitchElement){
				oTable = document.createElement("table");
				node.appendChild(oTable);
				oTable.border = 0;
				oTable.cellPadding = 0;
				oTable.cellSpacing = 0;
				var oTR = [oTable.insertRow(-1), oTable.insertRow(-1)];
				oTR[1].style.display = 'none';
				oTD = {};
				oTD.switcher = oTR[0].insertCell(0);
				oTD.header = oTR[0].insertCell(1);
				oTD.thread = oTR[1].insertCell(0);
				oTD.childs = oTR[1].insertCell(1);
				oTD.switcher.tree = this;
				oTD.switcher.open = this._openThread;
				oTD.switcher.refresh = this._refreshThread;
				oTD.switcher.show = this._displayThread;
				oTD.switcher.hide = this._hideThread;
				oTable.TD = oTD;
			}else{
				oTable = node.parentNode.parentNode.parentNode;
				oTD = oTable.TD;
				oTD.header.innerHTML = "";
				oTD.switcher.innerHTML = "";
				oTD.childs.innerHTML = "";
				node = oTable.parentNode;
			}
			oTD.switcher.CTime = new Date().getTime();
			var name = currentNode.getAttribute("name");
			var path = this._getParentPath(oTable);
			oTable.path = node.treeLevel ? path + name + '/' : path + '/';
			window.top.debug && window.top.debug("Tree Build: item: path=" + oTable.path + ", name=" + name + ", level=" + node.treeLevel + ", parentPath=" + path);
			oTable.id = "thread_" + oTable.path;
			var otbl = document.createElement("table");
			oTD.header.appendChild(otbl);
			otbl.border = 0;
			otbl.cellPadding = 0;
			otbl.cellSpacing = 0;
			otbl.selectobj = true;
			otbl.parent = oTable;
			var otr = otbl.insertRow(-1);
			oTD.icon = otr.insertCell(0);
			oTD.title = otr.insertCell(1);
			oTD.title.noWrap = true
			var oFld = document.createElement("img");
			oTD.icon.appendChild(oFld);
			oFld.style.height = "16px";
			oFld.style.width = "16px";
			oFld.style.borderWidth = 0;
			oFld.style.border = 0;
			oFld.src = "icons/" + currentNode.getAttribute("icon") + ".16.gif";
			oFld.icon = currentNode.getAttribute("icon");
			oTD.title.className = "fldTxt";
			oTD.title.innerHTML = currentNode.getAttribute("title");
			(node.goToPath == oTable.path || currentNode.getAttribute("selected")) && this.selectOn(oTD.title);
			oTD.switcher.isSwitchElement = true;
			oTD.switcher.childThread = oTD.childs;
			oTD.childs.hasChild = (requireScript("app/Dom.js"), Dom.firstElement(currentNode)) ? "true" : currentNode.getAttribute("children");
			if( Dom.nextElement(currentNode) || Dom.nextElement(oTable.nextSibling) ){
				oTD.thread.className = "thread1";
				oTD.switcher.className = (String(oTD.childs.hasChild) == "true") ? "thread4" : "thread2"
			}else{
				oTD.switcher.className = (String(oTD.childs.hasChild) == "true") ? "thread5" : "thread3"
			}
			oTD.childs.displayMode = false;
			if(String(oTD.childs.hasChild) == "true"){
				oTD.childs.treeLevel = node.treeLevel + 1;
				oTD.switcher.onclick = this._switchThreadMode;
				var oimg = new Image();
				oTD.switcher.appendChild(oimg);
				oimg.className = "fldImg";
				oimg.style.height = "16px";
				oimg.style.width = "16px";
				oimg.style.borderWidth = 0;
				oimg.style.border = 0;
				if ((requireScript("app/Dom.js"), Dom.firstElement(currentNode))){
					oimg.src = Tree.prototype._preloaded.minus.src;
					if(node.goToPath && node.goToPath.indexOf(oTable.path) == 0 && node.goToPath != oTable.path){
						oTD.childs.goToPath = node.goToPath;
						node.goToPath = false;
					}
					this.build(currentNode,oTD.childs);
				}else{
					oTD.childs.childLoad = false;
					oimg.src = Tree.prototype._preloaded.plus.src;
					if(node.goToPath && node.goToPath.indexOf(oTable.path) == 0 && node.goToPath != oTable.path){
						oTD.childs.goToPath = node.goToPath;
						node.goToPath = false;
						oTD.switcher.open();
					}
				}
			}else{
				var oimg = new Image();
				oTD.switcher.appendChild(oimg);
				oimg.style.width = "16px";
				oimg.style.height = 0;
				oimg.style.border = 0;
			}
		}
		node.childLoad = true;
		node.parentNode != null && (node.parentNode.style.display = '');
		node.displayMode = true;
		return;
	},
	_getParentPath : function(node){
		for(;node = node.parentNode;){
			if(node.path){
				return node.path;
			}
		}
		return "";
	},
	searchOpenThreads : function(){
		var arr = this.element.getElementsByTagName("TABLE");
		var threads = [];
		for(var i = 0; i<arr.length; ++i){
			(arr[i].path && arr[i].TD.switcher.childThread.displayMode) && (threads[threads.length] = arr[i].path);
		}
		for(var i = 0; i<threads.length; ++i){
			if (!threads[i]) {
				continue;
			}
			for(var j=0; j<threads.length; j++){
				i != j && threads[j] && threads[i].indexOf(threads[j]) == 0 && (threads[j] = false);
			}
		}
	},
	reloadThread : function(path){
		var thread = document.getElementById("thread_" + path);
		thread && thread.TD.switcher.refresh();
	},
	selectOn : function(obj){
		with(this){
			var o = getSelectedParent(obj);
			if(!o) {
				return false;
			}
			if(element.currentSelect){
				element.currentSelect.TD.title.className = 'fldTxt';
				element.currentSelect = null;
			}
			o.parent.TD.title.className = 'fldTxtOn';
			element.currentSelect = o.parent;
			element.returnValue.path = o.parent.path;
			setTimeout(function(){
				setTimeout(function(){
					require("Utils.Coordinates");
					var oh = element.currentSelect.firstChild.firstChild.offsetHeight;
					var cy = new Utils.Coordinates(element.currentSelect).relativeTo(element).ty;
					var st = element.scrollTop;
					var ch = element.clientHeight;
					window.top.debug && window.top.debug("Tree: scroll correction: oh=" + oh + ", cy=" + cy + ", st=" + st + ", ch=" + ch);
					(cy - oh < st) && (element.scrollTop = cy - oh);
					(cy + 2 * oh > st + ch) && (element.scrollTop = cy + 2 * oh - ch);
				
				},100);
				require("Utils.Coordinates");
			},0);
			return element.currentSelect;
		}
	},
	getSelectedParent : function(obj){
		for(;obj;obj = obj.parentNode){
			if (obj.selectobj) {
				return obj;
			}
		}
		return false;
	},
	gotoThread : function(){
		for (var i in this.element.childNodes){
			var child = this.element.childNodes[i];
			if(child.nodeType != 1 || child.nodeName != "TABLE"){
				continue;
			}
			if(this.goToPath == child.path){
				this.selectOn(child.TD.title);
				this.goToPath = false;
				return;
			}
			if(this.goToPath && this.goToPath.indexOf(child.path) == 0){
				child.TD.childs.goToPath = this.goToPath;
				this.goToPath = false;
				if(child.TD.childs.childLoad){
					child.TD.switcher.show();
					this.gotoThread(child.TD.childs);
					break;
				}
				child.TD.switcher.open();
				return;
			}
		}
		this.goToPath = false;
	}
},
Tree.prototype._preload("plus"),
Tree.prototype._preload("minus"),
Tree)