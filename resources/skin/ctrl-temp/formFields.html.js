<script>
function getHtmlText(name){
	var W = 600, H = 500;
	var winSize =  (requireScript("lib/standard.js"), Standard.readCookie('editorSize'));
	if(winSize){
		W = winSize.split(',')[0];
		H = winSize.split(',')[1];
	}
	var v=window.showModalDialog("editor_default.htm",document.getElementById(name),"dialogWidth:"+W+"px; dialogHeight:"+H+"px; scroll:no; status:no; resizable:yes; help:no");
	if(v == "none"){
		return;
	}
	document.getElementById(name).value = v;
	var oFrame = document.frames[name+"preview"];
	oFrame.document.body.innerHTML = v;
}
</script>