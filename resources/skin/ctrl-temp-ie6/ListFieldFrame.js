function goToPage(i,id){
	var obj = document.getElementById(id);
	obj.returnValue = false;
	obj.page = (i == 'all') ? i : i-1;
	obj.setLocation();
	oMenu.onFire('setListChangePage','path=<%= path %>',obj);
}
function refreshSetList(id){
	document.getElementById(id).refresh();
}
function changeLocationSetList(path,id){
	var obj = document.getElementById(id)
	if(!obj.ini){
		obj.ini = setListInitialize;
		obj.ini();
	}
	router.fire('ChangeLocation',id,{path:path},obj);
}
function setListInitialize(){
	this.page = 0;
	this.location = document.getElementById(this.id + "Frm").src;
	router.register(mForm, this, this.id);
	this.paging = this.cells[0].firstChild.cells[0].firstChild.cells[0];
	this.showPaging = function(eValue){
		var num = Number(eValue.size);
		var obj = this.paging;
		var title = eValue.title ? eValue.title : '<%= intl(en = "Objects", ru = "Объектов") %>';
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
				// left (should be double, but have single for now)
				txt+="<span style='line-height:7px'><a href='#' onclick='goToPage(1,\""+this.id+"\"); return false;'>&#x25C4;</a>";
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
				// right
				txt+="<span style='line-height:7px'><a href='#' onclick='goToPage("+(start+ppl)+",\""+this.id+"\"); return false;'>&#x25BA;</a>";
				txt+="<a href='#' onclick='goToPage("+totalPages+",\""+this.id+"\"); return false;'>8</a></span>&nbsp;";
			}
		}
		obj.innerHTML = txt;
	};
	this.putResult = function(arr){
		this.returnValue = arr;
	};
	this.refresh = function(){
		var oFrame = document.getElementById(this.id + "Frm");
		this.lastScrollPosition = oFrame.contentWindow.dtab.parentNode.scrollTop;
		router.fire('SetListRefresh',this.id,this.path,this);
		oFrame.document.location = oFrame.document.location;
	};
	this.setLocation = function(){
		var oFrame = document.getElementById(this.id + "Frm");
		var src = this.location + "&Page="+(this.page);
		oFrame.src = src;
	};
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
			router.fire('ItemSelect',this.id,{'path':this.path, 'id':eValue[0].id.substr(3), 'type':eValue[0].type},this);
			break;
		case "ItemsSelect":
			this.putResult(eValue);
			var ids = '';
			for(var i in eValue){
					ids += (i > 0 ? ',' : '') + eValue[i].id.substr(3);
			}
			router.fire('ItemsSelect', this.id, { 
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
			router.fire('ItemActivate',this.id,{'path':path,'id':id},this);
			break;
		case "ItemUnselect":
			this.returnValue = eValue;
			router.fire('ItemUnselect',this.id);
			break;
		case "SetListActive":
			this.returnValue = eValue;
			router.fire('SetListActive',this.id,{path:this.path});
			break;
	}
}