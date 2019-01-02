<script>
function clearSetMultiple(fieldName){
	var obj = document.getElementById('fld'+ fieldName +'_obj');
	obj.set.clear();
}

function setAllSetMultiple(fieldName){
	var obj = document.getElementById('fld'+ fieldName +'_obj');
	obj.set.setAll();
}

function setFilterSetMultiple(fieldName){
	var obj = document.getElementById('fld'+ fieldName +'_obj');
	obj.set.setFilter();
}
</script>