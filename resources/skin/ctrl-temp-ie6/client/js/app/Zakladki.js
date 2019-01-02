// <%FORMAT: 'js' %>
(window.app || (app = parent.app) || (app = {})) &&
app.Zakladki || (parent.app && (app.Zakladki = parent.app.Zakladki)) || (
	// v 1.0c
	//
	//	-= MyX =-
	//
	//
	
	app.Zakladki = function(target){
		// TODO: search Zakladki and create table here dynamically
	},
	app.Zakladki.prototype = {
		//
	},
	app.Zakladki.tabSplitter1 = "<table border=0 cellpadding=0 cellspacing=0><tr><td><img height=3 width=1></td><td></td><td></td><td></td></tr><tr><td bgcolor=buttonshadow><img height=1 width=1></td><td></td><td></td><td bgcolor=buttonhighlight><img height=1 width=1></td></tr><tr><td bgcolor=buttonface><img height=1 width=1></td><td bgcolor=buttonshadow><img height=16 width=1></td><td bgcolor=buttonhighlight><img height=16 width=1></td><td bgcolor=buttonface><img height=1 width=1></td></tr></table>",
	app.Zakladki.tabSplitter2 = "<table border=0 cellpadding=0 cellspacing=0><tr><td><img height=3 width=2></td><td></td><td></td></tr><tr><td></td><td></td><td bgcolor=buttonhighlight><img height=1 width=1></td></tr><tr><td></td><td bgcolor=buttonhighlight><img height=16 width=1></td><td bgcolor=buttonface><img height=1 width=1></td></tr></table>",
	app.Zakladki.tabSplitter3 = "<table border=0 cellpadding=0 cellspacing=0><tr><td></td><td></td><td bgcolor=buttonhighlight><img height=1 width=2></td></tr><tr><td></td><td bgcolor=buttonhighlight><img height=1 width=1></td><td bgcolor=buttonface><img height=1 width=1></td></tr><tr><td bgcolor=buttonhighlight><img height=18 width=1></td><td bgcolor=buttonface><img height=1 width=1></td><td bgcolor=buttonface><img height=1 width=1></td></tr></table>",
	app.Zakladki.tabSplitter4 = "<table border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=buttonhighlight><img height=1 width=2></td><td></td><td></td></tr><tr><td bgcolor=buttonface><img height=1 width=1></td><td bgcolor=buttonshadow><img height=1 width=1></td><td></td></tr><tr><td bgcolor=buttonface><img height=1 width=1></td><td bgcolor=buttonface><img height=1 width=1></td><td bgcolor=buttonshadow><img height=18 width=1></td></tr></table>",
	app.Zakladki.tabSplitter5 = "<table border=0 cellpadding=0 cellspacing=0><tr><td></td><td></td><td><img height=3 width=2></td></tr><tr><td bgcolor=buttonshadow><img height=1 width=1></td><td></td><td></td></tr><tr><td bgcolor=buttonface><img height=1 width=1></td><td bgcolor=buttonshadow><img height=16 width=1></td><td></td></tr></table>",
	app.Zakladki.TabIni = function(){
		this.contentFrame = this.offsetParent.offsetParent.cells[1].firstChild;
		this.holders = [];
		for (var i = 0; i < this.rows[0].cells.length; ++i){
			if (this.cells[i].id == 'holder'){
				this.cells[i].parent = this;
				this.cells[i].tabNum = this.holders.length;
				this.holders[this.holders.length] = this.cells[i];
				if (this.cells[i].className == 'TabOn') this.select = this.cells[i];
			}
		}
	},
	app.Zakladki.SwitchTab = function(obj){
		obj.parent || (obj.parent = obj.offsetParent);
		if (!obj.parent.select) {
			obj.parent.ini = app.Zakladki.TabIni;
			obj.parent.ini();
		}
		this.TabHolderOff(obj.parent.select);
		obj.parent.contentFrame.rows[obj.parent.select.tabNum].style.display = 'none';
		this.TabHolderOn(obj);
		obj.parent.contentFrame.rows[obj.tabNum].style.display = '';
		obj.parent.currentTabIndex = obj.tabNum;
	},
	app.Zakladki.TabHolderOff = function(obj){
		var oTable = obj.parent;
		obj.className = 'TabOff';
		oTable.rows[0].cells[obj.tabNum * 2].innerHTML = (obj.tabNum > 0) ? app.Zakladki.tabSplitter1 : app.Zakladki.tabSplitter2;
		oTable.rows[0].cells[obj.tabNum * 2 + 2].innerHTML = (obj.tabNum < oTable.holders.length - 1) ? app.Zakladki.tabSplitter1 : app.Zakladki.tabSplitter5;
		oTable.rows[1].cells[obj.tabNum * 2].className = 'TabOn';
		oTable.rows[1].cells[obj.tabNum * 2 + 1].className = 'TabOn';
		oTable.rows[1].cells[obj.tabNum * 2 + 2].className = 'TabOn';
	},
	app.Zakladki.TabHolderOn = function(obj){
		var oTable = obj.parent;
		oTable.select = obj;
		obj.className = 'TabOn';
		oTable.rows[0].cells[obj.tabNum * 2].innerHTML = app.Zakladki.tabSplitter3;
		oTable.rows[0].cells[obj.tabNum * 2 + 2].innerHTML = app.Zakladki.tabSplitter4;
		oTable.rows[1].cells[obj.tabNum * 2].className = 'TabOffl'
		oTable.rows[1].cells[obj.tabNum * 2 + 1].className = ''
		oTable.rows[1].cells[obj.tabNum * 2 + 2].className = 'TabOffr';
	},
app.Zakladki) // <%/FORMAT%>