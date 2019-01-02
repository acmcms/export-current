<script>
function openEditList(objFieldName,fieldName){
	var obj = document.getElementById('fld'+ objFieldName +'_obj');


//	window.open("formDialog.editListMultiple?id=<%=Request.id%>&fieldname="+fieldName,null,null);

	var result = showModalDialog( "formDialog.editListMultiple?id=<%=Request.id%>&fieldname="+fieldName,obj.list.returnValue,"dialogWidth:500px; dialogHeight:400px; scroll:no; status:no; resizable:yes; help:no");
	if(!result) return;
	obj.list.set(result);
}

function removeFromEditList(fieldName){
	var obj = document.getElementById('fld'+ fieldName +'_obj');
	obj.list.remove();
}

function clearEditList(fieldName){
	var obj = document.getElementById('fld'+ fieldName +'_obj');
	obj.list.clear();
}
</script>