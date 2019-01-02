<script>


function setImage(objID,fieldName){
	var result = showModalDialog( "formDialog.upload?id=<%=Request.id%>&data="+fieldName,false,"dialogWidth:500px; dialogHeight:145px; scroll:no; status:no; resizable:yes; help:no");
	if(!result) return;
	var iFields = getElementsByAttributeName(document.all[objID], 'info');
	if(result.type != 'error'){

		iFields.remove.disabled = false;
		iFields.download.disabled = false;
		if (iFields.remove.status) removeImage(objID,fieldName);
		iFields.contenttype.innerHTML = '<i>' + result.contenttype + '</i>';

		if(result.isImage){
			var iWidth = result.width;
			var iHeight = result.height;
			var max = result.width > result.height ? result.width : result.height;
			if(max > 200){
				var k = Math.ceil(max/200);
				iWidth = result.width/k;
				iHeight = result.height/k;
				result.width += ' px';
				result.height += ' px';
			}
			iFields.width.parentNode.style.display = '';
			iFields.height.parentNode.style.display = '';
			iFields.img.innerHTML = '<img class=FrameBorder width="'+iWidth+'" height="'+iHeight+'" src="show.field?type=form&id=<%=Request.id%>&fieldname='+fieldName+'&gwidth='+iWidth+'&gheight='+iHeight+'">';
		}else{
			iFields.width.parentNode.style.display = 'none';
			iFields.height.parentNode.style.display = 'none';
			iFields.img.innerHTML = '<a href="show.field?type=form&id=<%=Request.id%>&fieldname='+fieldName+'"><img width=32 height=32 src="icons/command-save.32.gif" border=0></a>';
		}


		iFields.size.innerHTML = '<i>' + result.size + '</i>';
		iFields.width.innerHTML = '<i>' + result.width + '</i>';
		iFields.height.innerHTML = '<i>' + result.height + '</i>';

	}
}

function removeImage(objID,fieldName){
	var iFields = getElementsByAttributeName(document.all[objID], 'info');
	var status = iFields.remove.status ? false : true;
	iFields.remove.status = status;
	iFields.commandRemove.value = status ? status : '';
	iFields.remove.className = status ? 'active' : '';
	iFields.contenttype.disabled = iFields.size.disabled = iFields.width.disabled = iFields.height.disabled = status;
	iFields.img.style.filter = status ? "gray() alpha(opacity=30)" : '';
}


</script>