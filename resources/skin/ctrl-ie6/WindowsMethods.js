var Windows = new Window();

function Window(){
	obj = [];
	obj.open = function(url,args,name,option){
		var obj = {};
		if(!name || name == "") name = "win" + new Date().getTime() + Math.ceil(Math.random() * 10000);
		var w = window.open(url,name,"resizable=yes,"+option);
		obj.frame = w;
		obj.dialogArguments = args;
		this[name] = obj;
		return this[name];
	}
	return obj;
}