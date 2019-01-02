window.Router || (Router = parent.Router) || ((Router = function(name){
	this.name = name || (Router.idx = (++Router.idx || 1));
	this.listeners = [];
	return this;
}),
Router.prototype = {
	fire : function(eType, id, eValue, eObj){
		window.top.debug && window.top.debug("router(" + this.name + "): fire: type=" + eType + ", id=" + id);
		var arr = this.listeners;
		for (var i = 0; i < arr.length; ++i){
			try {
				arr[i].object.nodeType;
			}catch(Error){
				window.top.debug && window.top.debug("router(" + this.name + "): garbage: id=" + arr[i].listenID);
				arr.splice(i, 1);
				continue;
			}
			(arr[i].listenID == id) && arr[i].object.onFire(eType, eValue, eObj);
		}
	},
	
	register : function(oObj, id){
		if(!oObj) {
			return false;
		}
		window.top.debug && window.top.debug("router(" + this.name + "): register: id=" + id);
		var arr = this.listeners;
		for (var i = arr.length - 1; i >= 0; --i){
			if(arr[i].object === oObj && arr[i].listenID == id) {
				return;
			}
		}
		arr.push({object : oObj, listenID : id});
	}
});