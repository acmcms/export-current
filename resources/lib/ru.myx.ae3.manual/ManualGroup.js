const Settings = require("ae3.util/Settings");

const ManualItemDoc = require('./ManualItemDoc');
const ManualItemLink = require('./ManualItemLink');

function ManualGroup(key, registryPath){
	this.IndexPage();
	this.key = key;
	this.registryPath = registryPath;
	Object.defineProperties(this, {
		"commands" : Settings.SettingsBuilder.builderCachedLazy()//
			.setInputFolderPath(registryPath)//
			.setDefaults({
				/**
				 * interface
				 */
				index:{
					icon : "help",
					title : "Manuals. Section: " + this.key,
					run : this,
					access : "public",
				},
				"../":{
					icon : "application_get",
					title : "Parent index menu",
					access : "public",
					ui : true,
				},
			})//
			.setDescriptorReducer((function(settings, description){
				if(description.url){
					const manual = new ManualItemLink(manual);
					manual.index = this;
					settings[key] = manual;

				}else//
				if(description.vfs){
					const manual = new ManualItemDoc(manual);
					manual.index = this;
					settings[key] = manual;
				}else{
					console.warn('>>>>>> invalid manual: name: %s, group: %s', manual.name, this.key);
				}
				return settings;
			}).bind(this))//
			.buildGetter()
	});
	return this;
}

ManualGroup.prototype = Object.create(require('ae3.web/IndexPage').prototype, {
	ManualGroup : {
		value : ManualGroup
	},
	icon : {
		value : "book_go"
	},
	title : {
		get : function(){
			return "Section: " + this.key;
		}
	},
	pageTitle : {
		get : function(){
			return this.systemName + "::manual/" + this.key +  "/ (" + this.title + ")";
		}
	},
	run : {
		get : function(){
			return this;
		}
	},
	commands : {
		value : null
	}
});

module.exports = ManualGroup;