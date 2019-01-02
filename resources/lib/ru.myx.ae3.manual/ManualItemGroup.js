function ManualItemGroup(manual, tree){
	this.ManualItemAbstract(manual, tree);
	this.items = tree.groups[manual.name];
	return this;
}

const DUMMY = [];

ManualItemGroup.prototype = Object.create(require('./ManualItemAbstract').prototype, {
	ManualItemGroup : {
		value : ManualItemGroup
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
			return "[ManualItemGroup, itemCount=" + (this.items || DUMMY).length + "]";
		}
	}
});

module.exports = ManualItemGroup;