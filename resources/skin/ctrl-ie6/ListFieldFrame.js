
function goToPage(i,id){
	var obj = eval(id);
	obj.returnValue = false;
	obj.page = (i == 'all') ? i : i-1;
	obj.setLocation();
	oMenu.onFire('setListChangePage','path=<%=path%>',obj);
}

function refreshSetList(id){
	eval(id).refresh();
}

function changeLocationSetList(path,id){
	var obj = eval(id)
	try{
		if(!obj.ini){
			obj.ini = setListInitialize;
			obj.ini();
		}
	}catch(Error){}
	eventMethods.fire('ChangeLocation',id,{'path':path},obj);
}

function setListInitialize(){
//	this.path = "<%=path%>";
	this.page = 0;
//	this.viewType = "SetList.field";
	this.location = document.all(this.id + "Frm").src;

	try{
		eventMethods.register(mForm,this.id);
	}catch(Error){}

	this.paging = this.cells[0].firstChild.cells[0].firstChild.cells[0];


/*
	this.viewTypeControl = this.cells[0].firstChild.cells[3].firstChild;
	this.viewTypeControl.parent = this;
	this.viewTypeControl.onchange = function(){
		this.parent.viewType = this.options[this.selectedIndex].value;
		this.parent.setLocation();
	}
*/
/*
	this.groups = this.cells[0].firstChild.cells[1].firstChild;
	this.groups.parent = this;
	this.groups.onchange = function(){
		var oFrame = document.all(this.parent.id + "Frm");
		oFrame.src = this.options[this.selectedIndex].value + "&type="+this.parent.vewType;
	}
*/

	this.showPaging = function(eValue){
		var num = Number(eValue.size);
		var obj = this.paging;
		var title = eValue.title ? eValue.title : '<%= intl(en = "Objects", ru = "Объектов")%>';
		var txt = "<b>"+title+":</b> <a href='#' onclick='goToPage(\"all\",\""+this.id+"\"); return false;'>" + num + "</a>";
		if(eValue.length ==1){
			obj.innerHTML = txt;
			return;
		}

		var cp = eValue.page;
		var count = Number(eValue.count);
		var ppl = 10;
		var totalPages = Math.ceil(num/count);
		if (totalPages > 1){
			txt += " &nbsp; ";
			var start = Math.ceil( (cp!='all' ? Number(cp) : 1)/ppl) * ppl - ppl + 1;
			var end = (totalPages >= start + ppl) ? start + ppl : totalPages + 1;
			if (start > 1){
				txt+="<span style='font-family: Webdings; line-height:7px'><a href='#' onclick='goToPage(1,\""+this.id+"\"); return false;'>7</a>";
				txt+="<a href='#' onclick='goToPage("+(start-ppl)+",\""+this.id+"\"); return false;'>3</a></span>&nbsp;";
			}
			txt += "<B>";
			for (var i=start; i<end; ++i){
				if (i==cp) txt+="[";
				txt+="<a href='#' onclick='goToPage("+i+",\""+this.id+"\"); return false;'>" + i + "</a>";
				if (i==cp) txt+="]";
				txt+=" ";
			}
			txt += "</B>"
			if (totalPages > start + ppl - 1){
				txt+="<span style='font-family: Webdings; line-height:7px'><a href='#' onclick='goToPage("+(start+ppl)+",\""+this.id+"\"); return false;'>4</a>";
				txt+="<a href='#' onclick='goToPage("+totalPages+",\""+this.id+"\"); return false;'>8</a></span>&nbsp;";
			}
		}
		obj.innerHTML = txt;
	}
	this.putResult = function(arr){
		this.returnValue = arr;
	}
	this.refresh = function(){
		var oFrame = document.frames(this.id + "Frm");
		this.lastScrollPosition = oFrame.blockParent.parentNode.scrollTop;
		eventMethods.fire('SetListRefresh',this.id,this.path,this);
		oFrame.document.location = oFrame.document.location;
	}

	this.setLocation = function(){
		var oFrame = document.all(this.id + "Frm");
		var src = this.location + "&Page="+(this.page);
		oFrame.src = src;
	}

/*
	this.setLocation = function(){
		var oFrame = document.all(this.id + "Frm");
		var src = "<%=resourceIdentifier%>?path=<%=Request.path ? Request.path : Request.src%><%=Request.key ? '&key='+Request.key : ''%><%=Request.method ? '&method='+Request.method : ''%>&type="+this.viewType+"&Page="+(this.page);
		alert(src)
		oFrame.src = src;
	}
*/

}

function setListFire(eType,eValue){
	if(!this.ini){
		this.ini = setListInitialize;
		this.ini();
	}
	switch(eType){
		case "setListPaging":
			this.showPaging(eValue);
			break;
		case "ItemSelect":
			this.putResult(eValue);
			eventMethods.fire('ItemSelect', this.id, {
				path : this.path, 
				id : eValue[0].id.substr(3), 
				type : eValue[0].type
			}, this);
			break;
		case "ItemsSelect":
			this.putResult(eValue);
			var ids = '';
			for(var i in eValue){
				ids += (i > 0 ? ',' : '') + eValue[i].id.substr(3);
			}
			eventMethods.fire('ItemsSelect', this.id, {
				path : this.path, 
				ids : ids, 
				type : 'content_multi'
			}, this);
			break;
		case "ItemActivate":
			this.putResult(eValue);

			if(eValue[eValue.length-1].id == '..'){
				var path = this.path.substr(0,this.path.lastIndexOf('/', this.path.length-2)+1)
				var id = '';
			}else{
				var path = this.path;
				var id = eValue[eValue.length-1].id.substr(3);
			}
			eventMethods.fire('ItemActivate',this.id,{'path':path,'id':id},this);
//			eventMethods.fire('ItemActivate',this.id,{'id':eValue[eValue.length-1].id.split('zzz')[1],'path':this.path},this);
//			eventMethods.fire('ItemActivate',this.id,{'id':eValue[eValue.length-1].id.split('zzz')[1]},this);
			break;
		case "ItemUnselect":
			this.returnValue = eValue;
			eventMethods.fire('ItemUnselect',this.id,false);
			break;
		case "SetListActive":
			this.returnValue = eValue;
			eventMethods.fire('SetListActive',this.id,{'path':this.path});
			break;
	}
}