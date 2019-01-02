(Windows = parent.Windows || {
	open : function(url,args,name,option){
		name || (name = "win" + String(new Date().getTime()) + Math.ceil(Math.random() * 10000));
		var obj = {
			dialogArguments : args,
			frame : window.open(url, name, "resizable=yes," + option)
		};
		return this[name] = obj;
	},
	alert : function(txt,type,ok){
		if(!txt) {
			return false;
		}
		type || (type = 'error');
		ok || (ok = 'OK');
		var args = {type : type, txt : txt, ok : ok};
		return window.showModalDialog("message.alert",args,"dialogWidth:300px; dialogHeight:150px; help:no; scroll:no; status:no; resizable:no;");
	},
	confirm : function(txt,type,ok,cancel){
		if(!txt) {
			return false;
		}
		type || (type = 'type');
		ok || (ok = 'OK');
		cancel || (cancel = 'Cancel');
		var args = {type : type, txt : txt, ok : ok, cancel : cancel};
		return window.showModalDialog("confirm.alert",args,"dialogWidth:300px; dialogHeight:150px; help:no; scroll:no; status:no; resizable:no;");
	}
})