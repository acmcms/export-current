function ControllPassword(obj){
	var cObj = document.getElementById(obj.name+'_confirm');
	if(!cObj) return;
	if(obj.value == '' && !cObj.readOnly){
		cObj.className = 'disable';
		cObj.value = '';
		cObj.readOnly = true;
	}
	if(obj.value != '' && cObj.readOnly){
		cObj.className = '';
		cObj.value = '';
		cObj.readOnly = false;
	}
}

function ConfirmPassword(mObj){
	var obj = document.activeElement;
	if(obj){
		var aObj = Dom.getSelectParent(obj, mObj.id);
		if(aObj) return;
	}
	var iName = mObj.id.substr(3)
	if(document.getElementById(iName).value != document.getElementById(iName+'_confirm').value){
		alert('<%= intl(en="Invalid password confirmation", ru="Неверное подтверждение пароля") %>')
		document.getElementById(iName+'_confirm').value = '';
		document.getElementById(iName).select();
	}
}
