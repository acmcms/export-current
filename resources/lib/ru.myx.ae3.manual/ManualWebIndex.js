const ManualWebRoot = require('./ManualWebRoot');
/**
 * 
 * @param props : {
 * 	pathPrefix
 * 	systemName
 * 	
 * }
 */
function ManualWebIndex(props){
	this.IndexPage();
	this.systemName = props.systemName || 'Manuals';
	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'manual/';
	this.link && (this.link.endsWith('/') || (this.link += '/'));
	this.pageTitle = (this.systemName) + "::" + this.link + "index (Documentation / Manuals)";
	return this;
}

ManualWebIndex.prototype = Object.create(require('ae3.web/IndexPage').prototype, {
	ManualWebIndex : {
		value : ManualWebIndex
	},
	run : {
		get : function(){
			return this;
		}
	},
	authRequired : {
		value : false
	},
	icon : {
		value : "help"
	},
	title : {
		value : "Documentation (Manuals)"
	},
	access : {
		value : "public"
	},
	ui : {
		value : true
	},
	group : {
		value : true
	},
	commands : {
		get : function(){
			var commands = {
				/**
				 * interface
				 */
				index:{
					icon : "help",
					title : "Documentation (Manuals)",
					run : this,
					access : "public",
				},
				"../index":{
					icon : "application_get",
					title : "Root index menu",
					access : "public",
					ui : true,
				}
			};
			
			const Manual = require("./Manual");

			const tree = Manual.getTree();
			
			var key, item, items = [];
			// all root manuals
			for(key of Object.keys(tree.all)){
				item = tree.all[key];
				if(!item.group){
					items.push(item);
				}
			}
			// all orphaned groups
			for(key of Object.keys(tree.groups)){
				if(!tree.all[key]){
					item = tree.groups[key];
					if(item){
						item.instance || Object.defineProperties(item, {
							instance : {
								value : Manual.createWebUnknown(key, tree)
							},
							name : {
								value : key
							}
						});
						items.push(item);
					}
				}
			}
			items.sort(function(a,b){
				return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
			});
			var manual;
			for(item of items){
				if(item.instance){
					manual = item.instance;
				}else{
					manual = Manual.createWebItem(item, tree);
					if(!manual){
						console.warn('>>>>>> %s: invalid manual: name: %s', this, item.name);
						manual = "invalid";
					}
					Object.defineProperty(item, "instance", {
						value : manual
					});
				}
				if(manual === "invalid"){
					continue;
				}
				manual.index = this;
				manual.systemName = this.systemName;
				// for the first level only
				manual.depthLimit = 2;
				commands[item.name] = manual;
			}
			return commands;
		}
	},
	toString : {
		value : function(){
			return "[ManualWebIndex]";
		}
	}
});

Object.defineProperties(ManualWebIndex, {
	"create" : {
		value : function(props){
			var manualGroup = (props || {}).manualGroup;
			if(manualGroup){
				return new ManualWebRoot(manualGroup, props);
			}
			return new ManualWebIndex(props);
		}
	}
});

module.exports = ManualWebIndex;
