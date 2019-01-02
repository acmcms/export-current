(window.Dom = window.top.Dom || {
	firstElement : function(node){
		for(node = node && node.firstChild; node; node = node.nextSibling){
			if(node.nodeType == 1){
				return node;
			}
		}
		return null;
	},
	nextElement : function(node){
		for(node = node && node.nextSibling; node; node = node.nextSibling){
			if(node.nodeType == 1){
				return node;
			}
		}
		return null;
	},
	parentElement : function(node){
		for(node = node && node.parentNode; node; node = node.parentNode){
			if(node.nodeType == 1){
				return node;
			}
		}
		return null;
	},
	searchParentByAttribute : function(node, atr){
		while(node.parentNode){
			if (node.getAttribute(atr)) {
				return node;
			}
			node = node.parentNode
		}
		return false;
	},
	searchParentByAttributeOrId : function(node, atr){
		while(node.parentNode){
			if (node.getAttribute(atr) || node.id == atr) {
				return node;
			}
			node = node.parentNode
		}
		return false;
	},
	getSelectParent : function(obj, atr) {
		while (obj.parentNode) {
			if (obj.getAttribute(atr) || obj.id == atr || (atr === undefined && obj.selectobj))
				return obj;
			obj = obj.parentNode
		}
		return false;
	},
	getSelectParentChild : function(obj, arr){
		arr || (arr = []);
		(obj.canBeSelected || obj.getAttribute("canBeSelected")) && arr.push(obj);
		var childNodes = obj.childNodes;
		for (var i = 0; i < childNodes.length; ++i){
			var child = obj.childNodes[i];
			child.nodeType == 1 && (arr = Dom.getSelectParentChild(child, arr));
		}
		return arr;
	},
	getElementsByAttributeName : function(oParent, aName, arr){
		arr || (arr = []);
		var children = oParent.childNodes;
		for(var i = 0; i<children.length; ++i){
			var cNode = children[i];
			cNode.getAttribute(aName) && (arr[cNode.getAttribute(aName)] = cNode);
			arr = Dom.getElementsByAttributeName(cNode, aName, arr)
		}
		return arr;
	},
	getElementsByAttribute : function(oParent, aName, aValue, arr){
		arr || (arr = []);
		var children = oParent.childNodes;
		for(var i = 0; i<children.length; ++i){
			var cNode = children[i];
			try{
				cNode.getAttribute(aName) == aValue && (arr[arr.length] = cNode);
			}catch(Error){
				//
			}
			arr = Dom.getElementsByAttribute(cNode, aName, aValue, arr)
		}
		return arr;
	},
	selectBlock : function(arr){
		for (var i = 0; i< arr.length; ++i){
			arr[i].style.backgroundColor = 'highlight';
			arr[i].style.color = 'highlighttext';
		}
	},
	unSelectBlock : function(arr){
		for (var i = 0; i< arr.length; ++i){
			arr[i].style.backgroundColor = '';
			arr[i].style.color = '';
		}
	}
})