function ManualItemLink(manual, tree){
	this.ManualItemAbstract(manual, tree);
	return this;
}

ManualItemLink.prototype = Object.create(require('./ManualItemAbstract').prototype, {
	ManualItemLink : {
		value : ManualItemLink
	},
	icon : {
		get : function(){
			return this.manual.icon || "link_go";
		}
	},
	title : {
		get : function(){
			return this.manual.title || ("Link: " + this.manual.name);
		}
	},
	link : {
		get : function(){
			return this.manual.url;
		}
	},
	toString : {
		value : function(){
			return "[ManualItemLink]";
		}
	}
});

module.exports = ManualItemLink;