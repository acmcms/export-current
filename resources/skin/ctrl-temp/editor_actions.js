function decCommand(){
	var obj = this.parent.editorObject;
	try{
		obj.ExecCommand(eval(this.cm),OLECMDEXECOPT_DODEFAULT) ;
	}catch(Error){
		//
	}
	obj.SetFocus();
}

function docCommand(){
	var obj = this.parent.editorObject;
	obj.DOM.execCommand(this.cm);
	obj.SetFocus();
}

function EditImage(){
	var image;
	var obj = this.parent.editorObject;
	var sel = obj.DOM.selection.createRange();
	obj.DOM.selection.type != 'Text' && sel.length == 1 && sel.item(0).tagName == "IMG" && (image = sel.item(0));
	var args = {object : image};
	var result = window.showModalDialog( "editor_image.control",args,"dialogWidth:400px; dialogHeight:260px; scroll:no; status:no; resizable:yes; help:no");
	if(!result) {
		obj.SetFocus();
		return;
	}
	result.html && insertHtml(result.html, obj);
}


function CellProperties(){
	var aTD = [];
	var obj = this.parent.editorObject;

	var oRange = obj.DOM.selection.createRange() ;
	var oParent = oRange.parentElement() ;
	while (oParent && oParent.tagName != "td" && oParent.tagName != "TABLE"){
		oParent = Dom.parentElement(oParent);
	}

	if ( oParent.tagName == "td" ){
		aTD[0] = oParent ;
	}else if ( oParent.tagName == "TABLE" ){
		for (i = 0 ; i < oParent.cells.length ; ++i){
			var oCellRange = obj.DOM.selection.createRange() ;
			oCellRange.moveToElementText(oParent.cells[i]) ;
			if ( oRange.inRange( oCellRange ) 
				|| ( oRange.compareEndPoints('StartToStart',oCellRange) >= 0 &&  oRange.compareEndPoints('StartToEnd',oCellRange) <= 0 )
				|| ( oRange.compareEndPoints('EndToStart',oCellRange) >= 0 &&  oRange.compareEndPoints('EndToEnd',oCellRange) <= 0 ) )
			{
				aTD[aTD.length] = oParent.cells[i] ;
			}
		}
	}
	if (aTD[0]){
		var args = {object : aTD[0]};
		var result = showModalDialog( "editor_cell.control",args,"dialogWidth:300px; dialogHeight:185px; scroll:no; status:no; resizable:no; help:no");
		if(!result){
			obj.SetFocus(); 
			return;
		}

		for( i = 0; i < aTD.length; i++ ){
			if(result.width			!= "") aTD[i].width			= result.width			; else aTD[i].removeAttribute("width");
			if(result.height		!= "") aTD[i].height		= result.height			; else aTD[i].removeAttribute("height");
			if(result.wrap			!= "") aTD[i].noWrap		= result.wrap == "true"	; else aTD[i].removeAttribute("noWrap");
			if(result.align			!= "") aTD[i].align			= result.align			; else aTD[i].removeAttribute("align");
			if(result.vAlign		!= "") aTD[i].vAlign		= result.vAlign			; else aTD[i].removeAttribute("vAlign");
			if(result.rowSpan		!= "") aTD[i].rowSpan		= result.rowSpan		; else aTD[i].removeAttribute("rowSpan");
			if(result.colSpan		!= "") aTD[i].colSpan		= result.colSpan		; else aTD[i].removeAttribute("colSpan");
			if(result.background	!= "") aTD[i].bgColor		= result.background		; else aTD[i].removeAttribute("bgColor");
			if(result.border		!= "") aTD[i].borderColor	= result.border			; else aTD[i].removeAttribute("borderColor");
			if(result.className		!= "") aTD[i].className		= result.className		; else aTD[i].removeAttribute("className");
		}
	}
}

function TableProperties(){
	EditTable(this);
}

function EditTable(item){
	var table;
	var searchParentTable = item ? true : false;
	var item = item ? item : this;
	var obj = item.parent.editorObject;

	if (searchParentTable){
		var oRange  = obj.DOM.selection.createRange() ;
		var oParent = oRange.parentElement() ;
		while (oParent && oParent.nodeName != "TABLE"){
			oParent = Dom.parentElement(oParent);
		}
		
		if (oParent && oParent.nodeName == "TABLE"){
			var oControlRange = obj.DOM.body.createControlRange();
			oControlRange.add(oParent) ;
			oControlRange.select();
		}else{
			return;
		}
	}

	var sel = obj.DOM.selection.createRange();
	obj.DOM.selection.type != 'Text' && sel.length == 1 && sel.item(0).tagName == "TABLE" && (table = sel.item(0));
	var args = {object : table};
	var result = showModalDialog( "editor_table.control",args,"dialogWidth:350px; dialogHeight:225px; scroll:no; status:no; resizable:no; help:no");
	if(!result || result.resultType == 'modify'){
		obj.SetFocus(); 
		return;
	}
	if(result.tableParams){
		obj.DOM.selection.clear();
		obj.ExecCommand(DECMD_INSERTTABLE,OLECMDEXECOPT_DODEFAULT, result.tableParams);
	}
}


function EditLink(){
	var obj = this.parent.editorObject;
	var link = getSelectionLink(obj);
	var path = '';

	if(link){
		var args = {path : link.getAttribute("href"), title : link.title, target : link.target};
		args.path && (path = '?path='+args.path);
	}
	var result = showModalDialog( "editor_link.control"+path,args,"dialogWidth:600px; dialogHeight:160px; scroll:no; status:no; resizable:yes; help:no");
	if(!result) {
		return;
	}
	if (result.path == ''){
		obj.ExecCommand(DECMD_UNLINK,OLECMDEXECOPT_DODEFAULT);
		return;
	}
	obj.ExecCommand(DECMD_HYPERLINK, OLECMDEXECOPT_DONTPROMPTUSER, "javascript:'';");

	for (i = 0 ; i < obj.DOM.links.length ; ++i){
		if ( obj.DOM.links[i].href == "javascript:'';" ){
			obj.DOM.links[i].href = result.path;
			(result.title == "") 
				? obj.DOM.links[i].removeAttribute("title",0) 
				: (obj.DOM.links[i].title  = result.title);
			(result.target == null || result.target == '') 
				? obj.DOM.links[i].removeAttribute("target",0) 
				: (obj.DOM.links[i].target = result.target);
		}
	}

	function getSelectionLink(obj){
		var oParent;
		var oRange;
		
		if (obj.DOM.selection.type == "Control"){
			oRange = obj.selection.createRange();
			for (var i = 0 ; i < oRange.length ; i++ ){
				if (oRange(i).parentNode){
					oParent = oRange(i).parentNode ;
					break ;
				}
			}
		}else{
			oRange  = obj.DOM.selection.createRange() ;
			oParent = oRange.parentElement() ;
		}

		while (oParent && oParent.nodeName != "A"){
			oParent = Dom.parentElement(oParent);
		}

		if (oParent && oParent.nodeName == "A"){
			obj.DOM.selection.empty() ;
			oRange = obj.DOM.selection.createRange() ;
			oRange.moveToElementText( oParent ) ;
			oRange.select() ;
			return oParent ;
		}else{
			return null ;
		}
	}
}


function ShowDetails(){
	var obj = this.parent.editorObject;
	obj.ShowDetails = !obj.ShowDetails;
	obj.SetFocus();
}

function CheckShowDetails(){
	return this.parent.editorObject.ShowDetails ? 1 : 0;
}

function ShowTableBorders(){
	var obj = this.parent.editorObject;
	obj.ShowBorders = !obj.ShowBorders;
	obj.SetFocus();
}

function CheckTableBorders(){
	return this.parent.editorObject.ShowBorders ? 1 : 0;
}


function PasteWord(){
	pasteWord(this.parent.editorObject);
}

function pasteWord(obj){
	insertHtml(cleanAndPaste(GetClipboardHTML()),obj);
}

function PasteText(){
	pasteText(this.parent.editorObject);
}

function pasteText(obj){
	var sText = HTMLEncode(clipboardData.getData("Text") ) ;
	sText = sText.replace(/\n/g,'<BR>');
	insertHtml(sText,obj);
}


function insertHtml(html,obj){
	obj.DOM.selection.type.toLowerCase() != "none" && obj.DOM.selection.clear();
	obj.DOM.selection.createRange().pasteHTML(html);
	obj.SetFocus();
}

function HTMLEncode(text){
	text = text.replace(/&/g, "&amp;") ;
	text = text.replace(/"/g, "&quot;") ;
	text = text.replace(/</g, "&lt;") ;
	text = text.replace(/>/g, "&gt;") ;
	text = text.replace(/'/g, "&#146;") ;
	return text ;
}


function GetClipboardHTML(){
	var oDiv = document.getElementById("divTemp")
	oDiv.innerHTML = "" ;
	var oTextRange = document.body.createTextRange() ;

	oTextRange.moveToElementText(oDiv) ;
	oTextRange.execCommand("Paste") ;
	var sData = oDiv.innerHTML ;
	oDiv.innerHTML = "" ;
	return sData ;
}

function cleanAndPaste( html ){
	html = html.replace(/<\/?SPAN[^>]*>/gi, "" );
	html = html.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	html = html.replace(/<(\w[^>]*) style="([^"]*)"([^>]*)/gi, "<$1$3") ;
	html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	html = html.replace(/<(\w[^>]*) bgColor=([^ |>]*)([^>]*)/gi, "<$1$3") ;

	html = html.replace(/(<table)([^|>]*)(>)/gi, "$1 border=1 width=100%$3") ;
	html = html.replace(/(<td)([^|>]*)(>)/gi, "$1$3") ;

	html = html.replace(/<\\?\?xml[^>]*>/gi, "") ;
	html = html.replace(/<\/?\w+:[^>]*>/gi, "") ;
	html = html.replace(/&nbsp;/, " " );
	var re = new RegExp("(<P)([^>]*>.*?)(<\/P>)","gi");
	html = html.replace( re, "<div$2</div>" ) ;
	return html;
}


function getClassNames(){
	return "Title,ClassName,Title2,ClassName2";
}