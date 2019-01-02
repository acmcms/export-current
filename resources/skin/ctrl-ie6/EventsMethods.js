function CreateEventMethods(){
	var obj = {};
	obj.register = registerListener;
	obj.fire = fireMyEvent;
	obj.allListeners = [];
	return obj;
}


function fireMyEvent(eType,id,eValue,eObj){
	var arr = this.allListeners;
	var brokenObj = [];
	var isbroken = false;
	for (var i = 0; i < arr.length; ++i){
		try {arr[i].object.nodeType;brokenObj[i]=false;}
		catch(Error){
			brokenObj[i] = true;
			var isbroken = true
			continue;
		}
		if (arr[i].listenID == id){
			switch (arr[i].object.entryType){
				case "menu":
					arr[i].object.onFire(eType,eValue,eObj);
//					CreateXMLBuffer(arr[i].object,"command.xml",arr[i].object.eventMethods);
					break;
				case "form":
					arr[i].object.onFire(eType,eValue,eObj);
					break;
				default:
					arr[i].object.onFire(eType,eValue,eObj);
					break;
			}
		}
	}
//	if (isbroken) this.allListner = removeMarkedElements(arr,brokenObj);
}

function registerListener(oObj,listenID){
	if(!oObj) return false;
	var arr = this.allListeners;
	for (var i = 0; i < arr.length; ++i){
		if(arr[i].object == oObj && arr[i].listenID == listenID) return;
	}
	var obj = {};
	obj.object = oObj;
	obj.listenID = listenID;
	this.allListeners[this.allListeners.length] = obj;
}

function registerListener2(oObj,listenID){
	var obj = {};
	obj.object = oObj;
	obj.listenID = listenID;
//	this.allListeners[this.allListeners.length] = obj;
	this.allListeners[listenID] = obj;
}