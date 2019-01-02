(window.Containers = window.top.Containers || {
	all : {},
	
	createSubmitBuffer : function(obj, form, url, router){
		return (require("Utils.Comms"), Utils.Comms.createFormSubmissionBuffer(form, url, function(content){
			Containers.parseByEntryType(
				url,
				(requireScript("/!/skin/ctrl-ie6-abstract/client/js/app/Dom.js"), Dom.firstElement(content.body || content.documentElement)), 
				obj, 
				router);
		}));
	},
	
	createFormSubmissionBuffer : function(target, form, url){
		(window.Effects && Effects.Busy) || setTimeout(function(){
			window.require && require("Effects.Busy");
		}, 0);
		var object = {
		};
		var frame = (require("Utils.Comms"), Utils.Comms.createFormSubmissionBuffer(form, url, function(element){
			element || (top.debug && top.debug("createFrame: empty or not valid frame for: " + url));
			Containers.parseByEntryType(
				url,
				(requireScript("/!/skin/ctrl-ie6-abstract/client/js/app/Dom.js"), Dom.firstElement(Dom.firstElement(element))), 
				form || (target && target.canvas) || target,
				router);
			object.progress && (object.progress.destroy(), object.progress = null);
		}));
		return frame;
	},
	
	createHiddenFrame : function(target, url, callback){
		var frame = Containers.createFrame(target, url, callback);
		frame.style.visibility = "hidden";
		return frame;
	},
	
	createFrame : function(target, url, callback){
		(window.Effects && Effects.Busy) || setTimeout(function(){
			window.require && require("Effects.Busy");
		}, 0);
		var object = {
			// earlier if possible
			progress : window.Effects && Effects.Busy && new Effects.Busy(target)
		};
		var frame = (require("Utils.Comms"), Utils.Comms.createFrame(target, "javascript:''", function(element){
			element || (top.debug && top.debug("createFrame: empty or not valid frame for: " + url));
			callback && callback(element);
			object.progress && (object.progress.destroy(), object.progress = null);
		}));
		frame.setLocation = function(url){
			object.progress || (object.progress = window.Effects && Effects.Busy && new Effects.Busy(target));
			this.src = url;
		};
		url && frame.setLocation(url);
		return frame;
	},
	
	executeXmlQuery : function(obj, url, router){
		var Busy = window.require && require("Effects.Busy"),
			progress = Busy && new Busy((obj && obj.shape) || obj);
		var element = (require("Utils.Comms"), Utils.Comms.queryXmlAsync(url, function(status, element){
			element || (window.top.debug && window.top.debug("executeXmlQuery: empty or not valid xml for: " + url));
			Containers.parseByEntryType(
				url,
				(requireScript("/!/skin/ctrl-ie6-abstract/client/js/app/Dom.js"), Dom.firstElement(element)), 
				(obj && obj.canvas) || obj,
				router);
			progress && (progress.destroy(), progress = null);
		}));
	},
	
	parseByEntryType : function(url, xmlElement, targetObject, router){
		if(!xmlElement){
			window.top.debug && window.top.debug("containers: parse: result contains no data!");
			null("Result contains no data!\n(url: " + url + ")");
			return;
		}
		var type = xmlElement.getAttribute("type");
		window.top.debug && window.top.debug("containers: parse, entryType=" + type + ", nodeType=" + xmlElement.nodeType + ", nodeName=" + xmlElement.nodeName + ", targetObject=" + (targetObject.nodeName || targetObject.id || targetObject));
		switch ( type ) {
			case "error":
				alert("Error");
				break;
			case "remote":
				var location = xmlElement.getAttribute("location");
				targetObject.id = xmlElement.getAttribute("id");
				Containers.executeXmlQuery(targetObject, location, router);
				break;
			case "frame":
				BuildFrame(xmlElement, targetObject, router)
				break;
			case "layout":
				BuildFrameSet(xmlElement, targetObject, router);
				break;
			case "tree":
				(targetObject.treeLevel > 0) && (xmlElement = (requireScript("/!/skin/ctrl-ie6-abstract/client/js/app/Dom.js"), Dom.firstElement(xmlElement)));
				targetObject.tree.build(xmlElement, targetObject, router);
				break;
			case "menu":
				targetObject.menu.build(xmlElement, targetObject, router);
				break;
			case "commandResult":
				targetObject.executed(xmlElement);
				break;
			default:
				targetObject.onLoad && targetObject.onLoad(xmlElement);
				targetObject.onLoad || (window.top.debug && window.top.debug("containers: parse - there seems to be broken XML on input!"));
				break;
		}
	},
	
	// just to allow commas everywhere above
	fake : undefined
})