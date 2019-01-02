<script>

function getHtmlText(name){
	var W = 800,
		H = 600,
		winSize = getCookie('editorSize');
	if(winSize){
		W = winSize.split(',')[0];
		H = winSize.split(',')[1];
	}

	var v=window.showModalDialog("modal_ckeditor.html",document.all[name],"dialogWidth:"+W+"px; dialogHeight:"+H+"px; scroll:no; status:no; resizable:yes; help:no");
	if(v === undefined || v === "none") return;
	document.all[name].value=v;
	var oFrame = document.frames[name+"preview"];
	oFrame.document.body.innerHTML=v;
}

</script>