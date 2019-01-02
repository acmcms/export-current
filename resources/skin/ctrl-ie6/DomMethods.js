function getElementsByAttributeName(oParent,aName,arr){
	if(!arr) arr = [];
	var children = oParent.childNodes;
	for(var i=0; i<children.length; ++i){
		var cNode = children[i];
		try{
			if(cNode.getAttribute(aName))
				arr[cNode.getAttribute(aName)] = cNode;
		}catch(Error){}
		arr = getElementsByAttributeName(cNode,aName,arr)
	}
	return arr;
}


function getElementsByAttribute(oParent,aName,aValue,arr){
	if(!arr) arr = [];
	var children = oParent.childNodes;
	for(var i=0; i<children.length; ++i){
		var cNode = children[i];
		try{
			if(cNode.getAttribute(aName) == aValue)
				arr[arr.length] = cNode;
		}catch(Error){}
		arr = getElementsByAttribute(cNode,aName,aValue,arr)
	}
	return arr;
}




function getSelectParent(obj,atr){
	while(obj.parentNode){
		if (obj.getAttribute(atr) || obj.id == atr) return obj;
		obj = obj.parentNode
	}
	return false;
}

function getSelectParentChild(obj,arr){
	if (!arr) arr = [];
	if (obj.canBeSelected) arr[arr.length] = obj;
	for (var i=0; i<obj.childNodes.length; ++i){
		arr = getSelectParentChild(obj.childNodes.item(i), arr);
	}
	return arr;
}

function selectBlock(arr){
	for (var i=0; i< arr.length; ++i){
		arr[i].style.backgroundColor = 'highlight';
		arr[i].style.color = 'highlighttext';
	}
}

function unSelectBlock(arr){
	for (var i=0; i< arr.length; ++i){
		arr[i].style.backgroundColor = '';
		arr[i].style.color = '';
	}
}