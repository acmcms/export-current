<script>

function treeFormIni(name){
	var obj = document.all[name+'_container'];
	obj.onFire = function(eType,eValue){
		switch(eType){
			case "treeChange":
//				alert(eValue.path)
				CreateXMLBuffer(this, "formData.xml");
				break;
		}
	}

	obj.onLoad = function(xmlData){
		alert('onLoad');
	}

	eventMethods.register(obj,name+'_tree');
}

</script>