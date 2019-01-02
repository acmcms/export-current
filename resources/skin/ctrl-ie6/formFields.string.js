<script>

function stringIni(id){
	var obj = document.all[id];
	var valueObject = document.all[id.substr(3)];
	if(obj && valueObject){
		obj.valueObject = valueObject;
		obj.valueObject.setValue = stringSetValue;
	}
}

function stringSetValue(node){
	this.value = node.getAttribute('CMDvalue');
}
</script>