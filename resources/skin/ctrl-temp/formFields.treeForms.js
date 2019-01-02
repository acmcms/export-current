<script>
function treeFormIni(name){
	var obj = document.getElementById(name+'_container');
	obj.onFire = function(eType,eValue){
		switch(eType){
			case "treeChange":
				Containers.executeXmlQuery(this, "formData.xml");
				break;
		}
	};

	obj.onLoad = function(xmlData){
		alert('onLoad');
	};

	router.register(obj,name+'_tree');
}
</script>