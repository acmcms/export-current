<script>
function getCalendarDate(name){
	var obj = document.getElementById(name);
	var arguments = {'format':obj.Format, 'millis':obj.Millis};
	var result = window.showModalDialog("Calendar.htm",arguments,"dialogWidth:150px; dialogHeight:225px; scroll:no; status:no; resizable:no; help:no");
	if (!result.Date){
		return;
	}
	obj.value = result.Date;
	obj.Millis = result.Millis;
}

function dateIni(id){
	var obj = document.getElementById(id);
	var valueObject = document.getElementById(id.substr(3));
	if(obj && valueObject){
		obj.valueObject = valueObject;
		obj.valueObject.setValue = dateSetValue;
	}
}

function dateSetValue(node){
	this.value = node.getAttribute('CMDvalue');
	this.Millis = node.getAttribute('CMDmillis');
	this.Format = node.getAttribute('CMDformat');
}
</script>