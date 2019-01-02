function RemoveChilds(obj) {
	for ( var i = obj.childNodes.length - 1; i >= 0; --i) {
		obj.childNodes.item(i).removeNode(true);
	}
}

var thr = [ 'plus', 'minus' ];
var Threads = [];
for ( var i = 0; i < thr.length; ++i) {
	Threads[thr[i]] = new Image();
	Threads[thr[i]].src = "$files/folder-" + thr[i] + ".gif";
}

function SwitchThreadMode() {
	if (this.childThread.hasChild != "true") {
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
		var tp = "<%= User.getUser().getProfile('mwmAdmin',true).TreeReloadPeriod || '60000' %>";
		if (new Date().getTime() - this.CTime > tp) {
			this.open();
		} else {
			this.show();
		}
	}
}

function OpenThread() {
	// if(this.childThread.displayMode || this.childThread.hasChild != "true")
	// return;
	// if(this.childThread.displayMode) return;
	this.firstChild.src = Threads['minus'].src;
	var oTable = this.parentNode.parentNode.parentNode;
	var path = oTable.path;
	var goToPath;
	if (oTable.TD.childs.goToPath) {
		goToPath = oTable.TD.childs.goToPath.replace(oTable.path, '/');
	}
	var request = '?cNode=' + path;
	if (goToPath) {
		request += '&path=' + goToPath;
	}
	var src = "<%= TreeDataSource || 'TreeData.xml' %>" + request;
	CreateXMLBuffer(this, src);
}

function DisplayThread() {
	if (this.childThread.displayMode || this.childThread.childLoad != true){
		return;
	}
	this.childThread.displayMode = true;
	this.childThread.parentNode.style.display = '';
	this.firstChild.src = Threads['minus'].src;
}

function HideThread() {
	if (!this.childThread.displayMode){
		return;
	}
	this.childThread.displayMode = false;
	this.childThread.parentNode.style.display = 'none';
	this.firstChild.src = Threads['plus'].src;
}

function RefreshThread() {
	this.hide();
	this.open();
}

function BuildTree(xmlData, oObj) {
	if (!oObj.getAttribute("treeLevel") && !oObj.isSwitchElement) {
		// alert(xmlData.xml)
		oObj.treeLevel = 0
		oObj.selectParent = true;
		oObj.multiSelect = true;
		oObj.returnValue = [];
		oObj.putResult = PutTreeResult;
		if (xmlData.getAttribute("id")){
			oObj.id = xmlData.getAttribute("id");
		}else{
			oObj.id = window.name;
		}
		// oObj.eventMethods = methods;
		oObj.style.cursor = 'default';
	}

	for ( var i = 0; i < xmlData.childNodes.length; ++i) {
		var CurrentNode = xmlData.childNodes[i];
		if (!oObj.isSwitchElement) {
			var oTable = document.createElement("TABLE");
			oObj.insertAdjacentElement("beforeEnd", oTable);

			oTable.border = 0;
			oTable.cellPadding = 0;
			oTable.cellSpacing = 0;

			var oTR = [oTable.insertRow(0), oTable.insertRow(1)];
			oTR[1].style.display = 'none';

			var oTD = [];
			oTD['switch'] = oTR[0].insertCell(0);
			oTD['header'] = oTR[0].insertCell(1);
			oTD['thread'] = oTR[1].insertCell(0);
			oTD['childs'] = oTR[1].insertCell(1);
			oTD['switch'].open = OpenThread;
			oTD['switch'].refresh = RefreshThread;
			oTD['switch'].show = DisplayThread;
			oTD['switch'].hide = HideThread;

			oTable.TD = oTD;
		} else {
			var oTable = oObj.parentNode.parentNode.parentNode;
			var oTD = oTable.TD;
			RemoveChilds(oTD['header']);
			RemoveChilds(oTD['switch']);
			RemoveChilds(oTD['childs']);
			oObj = oTable.parentNode;
		}
		oTD['switch'].CTime = new Date().getTime();
		oTable.path = (oObj.treeLevel == 0) ? GetParentPath(oTable) + '/'
				: (GetParentPath(oTable) + CurrentNode.getAttribute("name"))
						+ '/';

		oTable.id = "thread_" + oTable.path;

		var otbl = document.createElement("TABLE");
		oTD['header'].insertAdjacentElement("beforeEnd", otbl);

		otbl.border = 0;
		otbl.cellPadding = 0;
		otbl.cellSpacing = 0;
		otbl.selectobj = true;
		otbl.parent = oTable;
		var otr = otbl.insertRow();
		oTD['icon'] = otr.insertCell(0);
		oTD['title'] = otr.insertCell(1);
		oTD['title'].noWrap = true
		// oTD['title'].selectItem = true;

		var oFld = document.createElement("IMG");
		oTD['icon'].insertAdjacentElement("beforeEnd", oFld);

		oFld.className = "fldImg"
		oFld.src = "icons/" + CurrentNode.getAttribute("icon") + ".16.gif";
		oFld.icon = CurrentNode.getAttribute("icon");

		oTD['title'].className = "fldTxt";
		oTD['title'].innerHTML = CurrentNode.getAttribute("title");

		if (oObj.goToPath == oTable.path
				|| CurrentNode.getAttribute("selected"))
			selectOn(oTD['title']);

		oTD['switch'].isSwitchElement = true;
		oTD['switch'].childThread = oTD['childs'];
		oTD['childs'].hasChild = (CurrentNode.childNodes.length > 0) ? "true"
				: CurrentNode.getAttribute("children");
		
		var hasChild = oTD['childs'].hasChild == "true";
		if (i < (xmlData.childNodes.length - 1) || oTable.nextSibling) {
			oTD['thread'].className = "thread1";
			oTD['switch'].className = hasChild ? "thread4" : "thread2";
		} else {
			oTD['switch'].className = hasChild ? "thread5" : "thread3";
		}
		oTD['childs'].displayMode = false;

		if (oTD['childs'].hasChild == "true") {
			oTD['childs'].treeLevel = oObj.treeLevel + 1;
			oTD['switch'].onclick = SwitchThreadMode;
			var oimg = new Image();
			oTD['switch'].insertAdjacentElement("beforeEnd", oimg);
			oimg.className = "fldImg";

			if (CurrentNode.childNodes.length > 0) {
				oimg.src = Threads['minus'].src;
				if (oObj.goToPath && oObj.goToPath.indexOf(oTable.path) == 0
						&& oObj.goToPath != oTable.path) {
					oTD['childs'].goToPath = oObj.goToPath;
					oObj.goToPath = false;
				}
				BuildTree(CurrentNode, oTD['childs']);
			} else {
				oTD['childs'].childLoad = false;
				oimg.src = Threads['plus'].src;

				if (oObj.goToPath && oObj.goToPath.indexOf(oTable.path) == 0
						&& oObj.goToPath != oTable.path) {
					oTD['childs'].goToPath = oObj.goToPath;
					oObj.goToPath = false;
					oTD['switch'].open();
				}
			}
		} else {
			var oimg = new Image();
			oTD['switch'].insertAdjacentElement("beforeEnd", oimg);
			oimg.width = 16;
			oimg.height = 0;
		}
	}
	oObj.childLoad = true;
	if (oObj.parentNode != null){
		oObj.parentNode.style.display = '';
	}
	oObj.displayMode = true;
	return;
}

function GetParentPath(obj) {
	var parentObj = {};
	parentObj = obj.parentNode
	while (parentObj != null && parentObj.path == null) {
		parentObj = parentObj.parentNode;
	}
	if (parentObj == null || parentObj.path == ''){
		return '';
	}
	return parentObj.path;
}

function PutTreeResult() {
	eventMethods.fire('treeChange', this.id, this.returnValue)
}