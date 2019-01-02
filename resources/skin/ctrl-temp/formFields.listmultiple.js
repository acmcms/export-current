<script>
function openEditList(objFieldName,fieldName){
	var obj = document.getElementById('fld'+ objFieldName +'_obj');
	var result = showModalDialog( "formDialog.editListMultiple?id=<%=Request.id%>&fieldname="+fieldName,obj.list.returnValue,"dialogWidth:500px; dialogHeight:400px; scroll:no; status:no; resizable:yes; help:no");
	result && obj.list.set(result);
}

function removeFromEditList(fieldName){
	document.getElementById('fld'+ fieldName +'_obj').list.remove();
}

function clearEditList(fieldName){
	document.getElementById('fld'+ fieldName +'_obj').list.clear();
}
</script>