<%IF:!styleSheets || !scripts%>
	<%EXEC:styleSheets = []%>
	<%EXEC:scripts = []%>
<%/IF%>

<%IF:!styleSheets.contains('zakladka.css')%>
	<style>
		<%INCLUDE: 'zakladki.css' %>
	</style>
	<%EXEC:styleSheets.add('zakladka.css')%>
<%/IF%>

<%IF:!scripts.contains('zakladki.splitters.js')%>
	<script>
		<%INCLUDE: 'zakladki.splitters.js' %>
	</script>
	<%EXEC:scripts.add('zakladki.splitters.js')%>
<%/IF%>


<%IF:!scripts.contains('zakladki.controls')%>
	<%EXEC:scripts.add('zakladki.controls')%>
	<script>
	function TabIni(){
		this.contentFrame = this.offsetParent.offsetParent.cells[1].firstChild;
		this.holders = [];
		for (var i=0; i < this.rows[0].cells.length; ++i){
			if (this.cells[i].id == 'holder'){
				this.cells[i].parent = this;
				this.cells[i].tabNum = this.holders.length;
				this.holders[this.holders.length] = this.cells[i];
				if (this.cells[i].className == 'TabOn') this.select = this.cells[i];
			}
		}
	}

	function SwitchTab(obj){
		if (!obj.parent) obj.parent = obj.offsetParent;
		if (!obj.parent.select) {
			obj.parent.ini = TabIni;
			obj.parent.ini();
		}
		TabHolderOff(obj.parent.select);
		obj.parent.contentFrame.rows[obj.parent.select.tabNum].style.display = 'none';
		TabHolderOn(obj);
		obj.parent.contentFrame.rows[obj.tabNum].style.display = '';
		obj.parent.currentTabIndex = obj.tabNum;
	}

	function TabHolderOff(obj){
		var oTable = obj.parent;
		obj.className = 'TabOff';
		oTable.rows[0].cells[obj.tabNum * 2].innerHTML = (obj.tabNum > 0) ? tabSplitter1 : tabSplitter2;
		oTable.rows[0].cells[obj.tabNum * 2 + 2].innerHTML = (obj.tabNum < oTable.holders.length - 1) ? tabSplitter1 : tabSplitter5;
		oTable.rows[1].cells[obj.tabNum * 2].className = 'TabOn';
		oTable.rows[1].cells[obj.tabNum * 2 + 1].className = 'TabOn';
		oTable.rows[1].cells[obj.tabNum * 2 + 2].className = 'TabOn';
	}

	function TabHolderOn(obj){
		var oTable = obj.parent;
		oTable.select = obj;
		obj.className = 'TabOn';
		oTable.rows[0].cells[obj.tabNum * 2].innerHTML = tabSplitter3;
		oTable.rows[0].cells[obj.tabNum * 2 + 2].innerHTML = tabSplitter4;
		oTable.rows[1].cells[obj.tabNum * 2].className = 'TabOffl'
		oTable.rows[1].cells[obj.tabNum * 2 + 1].className = ''
		oTable.rows[1].cells[obj.tabNum * 2 + 2].className = 'TabOffr';
	}

	</script>
<%/IF%>