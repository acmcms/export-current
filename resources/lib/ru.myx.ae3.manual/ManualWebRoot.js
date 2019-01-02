function ManualWebRoot(manualGroup, props){
	const Manual = require("./Manual");
	const tree = Manual.getTree();
	
	this.ManualItemAbstract({
		name : manualGroup,
		title : props.title || null,
		icon : props.icon || 'info'
	}, tree);
	this.items = tree.groups[manualGroup];

	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'manual/';
	
	return this;
}

const DUMMY = [];

ManualWebRoot.prototype = Object.create(require('./ManualItemAbstract').prototype, {
	ManualWebRoot : {
		value : ManualWebRoot
	},
	icon : {
		get : function(){
			return this.manual.icon || "pictures";
		}
	},
	title : {
		get : function(){
			return this.manual.title || ("Group: " + this.manual.name);
		}
	},
	group : {
		value : true
	},
	depthLimit : {
		get : function(){
			return (this.items || DUMMY).length !== 0 ? 3 : undefined;
		}
	},
	toString : {
		value : function(){
			return "[ManualWebRoot, itemCount=" + (this.items || DUMMY).length + "]";
		}
	}
});

module.exports = ManualWebRoot;