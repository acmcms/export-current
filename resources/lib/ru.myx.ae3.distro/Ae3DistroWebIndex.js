const f = {
	DistroWebPresetItem : require('./DistroWebPresetItem'),
	createWebPresetItem : function(preset){
		return new f.DistroWebPresetItem(preset);
	}
};

/**
 * 
 * @param lib
 * @param props : {
 * 	pathPrefix
 * 	systemName
 * 	
 * }
 */
function Ae3DistroWebIndex(lib, props){
	this.IndexPage();
	this.lib = lib;
	this.systemName = props.systemName || 'Distro';
	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'distro/';
	this.link && (this.link.endsWith('/') || (this.link += '/'));
	this.pageTitle = (this.systemName) + "::" + this.link + "index (Download & Install / Distro)";
	return this;
}

Ae3DistroWebIndex.prototype = Object.create(require('ae3.web/IndexPage').prototype, {
	Ae3DistroWebIndex : {
		value : Ae3DistroWebIndex
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
		value : "disk"
	},
	title : {
		value : "Download & Install (Distro)"
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
					icon : "disk",
					title : "Download & Installation (AE3 Distro)",
					run : this,
					access : "public",
				},
				"../":{
					icon : "application_get",
					title : "Root index menu",
					access : "public",
					ui : true,
				}
			};
			
			const Distro = require("./Distro");

			var presets = Distro.listAllPresets();
			var preset;
			for(item of presets){
				if(item.instance){
					preset = item.instance;
				}else{
					preset = f.createWebPresetItem(item);
					if(!preset){
						console.warn('>>>>>> %s: invalid preset: name: %s', this, item.name);
						preset = "invalid";
					}
					Object.defineProperty(item, "instance", {
						value : preset
					});
				}
				if(preset === "invalid"){
					continue;
				}
				preset.lib = this.lib;
				preset.index = this;
				preset.systemName = this.systemName;
				// for the first level only
				preset.depthLimit = 2;
				commands[item.name] = preset;
			}
			return commands;
		}
	},
	toString : {
		value : function(){
			return "[Ae3DistroWebIndex]";
		}
	}
});

module.exports = Ae3DistroWebIndex;
