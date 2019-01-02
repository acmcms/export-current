<script>

function getUrl(name){
	var obj = document.all[name];
	var arguments = {path : obj.value || ''};
	var result = showModalDialog( "editor_link.control",arguments,"dialogWidth:600px; dialogHeight:160px; scroll:no; status:no; resizable:yes; help:no");
	result && result.path && (obj.value = result.path);
}

function goToUrl(name){
	var obj = document.all[name];
	window.open(obj.value,'','');
}

</script>