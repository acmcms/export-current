
function ManualItemAbstract(manual, tree){
	this.AbstractWebPage();
	Object.defineProperties(this, {
		manual : {
			value : manual
		},
		tree : {
			value : tree
		}
	});
	return this;
}

ManualItemAbstract.prototype = Object.create(require('ae3.web/AbstractWebPage').prototype, {
	ManualItemAbstract : {
		value : ManualItemAbstract
	},
	link : {
		get : function(){
			return this.manual.name + '/';
		}
	},
	icon : {
		get : function(){
			return this.manual.icon || "help";
		}
	},
	commands : {
		get : function(){
			var items = this.tree.groups[this.manual.name];
			if(!items){
				return undefined;
			}
			var commands = {
				/**
				 * interface
				 */
				index:{
					icon : "help",
					title : "Manuals: " + this.title,
					run : this,
					access : "public",
				},
				"../":{
					icon : "application_get",
					title : "Parent index menu",
					access : "public",
					ui : true,
				},
			};
			const Manual = require("./Manual");
			var key, manual;
			for(key of items){
				manual = Manual.createWebItem(this.tree.all[key], this.tree);
				if(!manual){
					console.warn('>>>>>> invalid manual: name: %s, group: %s', key, this.key);
					continue;
				}
				manual.index = this;
				manual.systemName = this.systemName;
				commands[key] = manual;
			}
			return commands;
		}
	},
	run : {
		get : function(){
			return this;
		}
	},
	access : {
		value : "public"
	},
	ui : {
		value : true
	},
	depthLimit : {
		value : undefined
	},
	toString : {
		value : function(){
			return "[ManualItemAbstract]";
		}
	}
});

module.exports = ManualItemAbstract;