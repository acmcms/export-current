var Containers = [];

var Dom = {
	firstElement : function(node){
		for(node = node && node.firstChild; node; node = node.nextSibling){
			if(node.nodeType == 1){
				return node;
			}
		}
		return null;
	}
}

function RemoveChilds(obj) {
	for ( var i = obj.childNodes.length - 1; i >= 0; --i) {
		obj.childNodes.item(i).removeNode(true);
	}
}

function getRandomId() {
	return new Date().getTime() + Math.ceil(Math.random() * 100000);
}

function CreateHTMLBuffer(obj, method) {
	var id = 'bfr' + getRandomId();
	var html = '<IFRAME src="__blank" name="'
			+ id
			+ '" id="'
			+ id
			+ '" style="position:absolute; top:-10px; left:-10px; width:1px; height:1px; display:none"></IFRAME>';
	document.body.insertAdjacentHTML('beforeEnd', html);
	var container = document.all[id];
	container.targetObj = obj;
	container.onDone = function() {
		try {
			ParsingByEntryType(
					document.frames[this.name].document.all.oMetaData,
					this.targetObj, this.eventMethods);
		} catch (error) {
			if(window.confirm('Error\nShow details?\n(url: ' + this.src + ')\n\n' + error + '\n' + error.message)){
				window.open(this.src, 'error', false);
				return;
			}
			throw error;
		}
		this.removeNode(true);
	}
	return container;
}

function CreateXMLBuffer(obj, src, methods) {
	new ContainerObject(src, obj, methods);
}

function ContainerObject(url, obj, methods) {
	obj.style.cursor = 'wait';

	this.Name = getRandomId();
	Containers[this.Name] = this;

	this.almostReady = false;
	this.oXML = new ActiveXObject("Microsoft.XMLDOM");

	this.targetObj = obj;
	this.onDone = ContainerOnDone;
	this.url = url;
	this.eventMethods = methods;

	this.oXML.onreadystatechange = new Function('var cnt = Containers["'
			+ this.Name + '"]; cnt && cnt.onDone();');
	if (!this.oXML.load(url)) {
		alert("Error!");
		Containers[this.Name] = null;
	}
}

function ContainerOnDone() {
	if (this.oXML.readyState != 4) {
		this.almostReady = true;
	}
	if (!this.almostReady || this.oXML.readyState != 4) {
		return;
	}
	delete Containers[this.Name];
	this.almostReady = false;
	this.targetObj.style.cursor = 'default';
	
	try {
		ParsingByEntryType(Dom.firstElement(this.oXML.documentElement), this.targetObj, this.eventMethods);
	} catch (error) {
		if(window.confirm('Error\nShow details?\n(url: ' + this.url + ')\n\n' + error + '\n' + error.message)){ 
			window.open(this.url, 'error', false);
			return;
		}
		throw error;
	}
}

function ParsingByEntryType(xmlElement, targetObject, methods) {
	switch (xmlElement.getAttribute("type")) {
	case "error":
		alert("Error");
		break;
	case "remote":
		var Location = xmlElement.getAttribute("location");
		if (Location.indexOf("http://") != 0) {
			Location = Location;
		}
		targetObject.id = xmlElement.getAttribute("id");
		CreateXMLBuffer(targetObject, Location, methods)
		break;
	case "frame":
		BuildFrame(xmlElement, targetObject, methods)
		break;
	case "layout":
		BuildFrameSet(xmlElement, targetObject, methods);
		break;
	case "tree":
		if (targetObject.treeLevel > 0) {
			xmlElement = xmlElement.childNodes[0];
		}
		BuildTree(xmlElement, targetObject, methods);
		break;
	case "menu":
		targetObject.build(xmlElement, targetObject, methods);
		break;
	case "menu2":
		if (!targetObject.entryType) {
			targetObject.menuMethods = setMenuMethods();
			targetObject.eventMethods = methods;
			targetObject.entryType = xmlElement.getAttribute("type");
			targetObject.eventMethods.register(targetObject, xmlElement
					.getAttribute("listen_id"));
		}
		targetObject.menuMethods.build(xmlElement, targetObject, methods);
		break;
	case "commandResult":
		targetObject.executed(xmlElement);
		break;
	default:
		targetObject.onLoad(xmlElement);
		break;
	}
}
