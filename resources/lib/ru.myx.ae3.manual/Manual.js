const vfs = require("ae3/vfs");
const Settings = require("ae3.util/Settings");

const ManualItemDoc = require('./ManualItemDoc');
const ManualItemGroup = require('./ManualItemGroup');
const ManualItemLink = require('./ManualItemLink');


const Manual = {
		
	getTree : Settings.SettingsBuilder.builderCachedLazy()//
		.setInputFolderPath("settings/manual")//
		.setDescriptorReducer(function(settings, description){
			if(description.type !== "ae3.Manual"){
				return settings;
			}
			var name = description.name;
			if(!name){
				// actually name is mandatory
				return settings;
			}
			
			var all = settings.all || (settings.all = {});

			var group = description.group;
			var service = all[name] || (all[name] = { 
				name : name
			});
			service.group = group;
			service.title = description.title;
			service.url = description.url;
			service.vfs = description.vfs;

			if(!group){
				return settings;
			}
			
			var groups = (settings.groups || (settings.groups = {}));
			
			if(Array.isArray(group)){
				group.forEach(function(x){
					(groups[x] || (groups[x] = [])).push(name);
				});
			}else{
				(groups[group] || (groups[group] = [])).push(name);
			}
			
			return settings;
		})//
		.buildGetter(),
	createWebItem : function(item, tree){
		if(item.url){
			return new ManualItemLink(item, tree);
		}
		if(item.vfs){
			return new ManualItemDoc(item, tree);
		}
		if(item.title /* tree.groups[item.name] */){
			return new ManualItemGroup(item, tree);
		}
		{
			console.warn('>>>>>> invalid manual: name: %s', item.name);
			return null;
		}
	},
	createWebUnknown : function(name, tree){
		return new ManualItemGroup({
			name : name,
			title : "Group: " + name
		}, tree);
	},
	
	cacheExpire : 0,
	getGroups : function(){
		if(this.cacheExpire > Date.now()){
			return GROUPS;
		}
		const ManualGroup = require('./ManualGroup');

		const array = vfs.UNION.relativeFolder("settings/manual").getContentCollection(null).filter(vfs.isContainerNonEmpty).map(vfs.mapEntryToKey);
		var key;
		for(key of array){
			key[0] === '.' || key === 'CVS' || GROUPS[key] || (GROUPS[key] = new ManualGroup(key, "settings/manual/" + key));
		}
		var found, check;
		for(key of Object.keys(GROUPS)){
			found = false;
			for(check of array){
				if(check === key){
					found = true;
					break;
				}
			}
			if(!found){
				delete GROUPS[key];
			}
		}
		this.cacheExpire = Date.now() + 5000;
		return GROUPS;
	}
	
};

module.exports = Manual;