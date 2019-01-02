var WIN = new modalWindow();

function modalWindow(){
	var obj = {};
	obj.alert = function(txt,type,ok){
		if(!txt) return false;
		type = (!type) ? 'error' : type;
		ok = (!ok) ? 'OK' : ok;
		var args = {"type":type, "txt":txt, "ok":ok};
		var w = window.showModalDialog("message.alert",args,"dialogWidth:300px; dialogHeight:150px; help:no; scroll:no; status:no; resizable:no;")
		return w;
	}

	obj.confirm = function(txt,type,ok,cancel){
		if(!txt) return false;
		type = (!type) ? 'type' : type;
		ok = (!ok) ? 'OK' : ok;
		cancel = (!cancel) ? 'Cancel' : cancel;
		var args = {"type":type, "txt":txt, "ok":ok, "cancel":cancel};
		var w = window.showModalDialog("confirm.alert",args,"dialogWidth:300px; dialogHeight:150px; help:no; scroll:no; status:no; resizable:no;")
		return w;
	}

	return obj;
}