const vfs = require("ae3/vfs");
const Settings = require("ae3.util/Settings");

const getSettings = Settings.SettingsBuilder.builderCachedLazy()//
	.setInputFolderPath("settings/system/vfs/type")//
	.setDescriptorReducer(function(settings, description){
		if (description.type != "ae3/Factory") {
			return settings;
		}
		/**
		 * 'order of appearance'
		 */
		const name = description.name;
		const info = description.description;
		const reference = description.reference;
		/**
		 * 
		 */

		/**
		 * actually name and reference are mandatory
		 */
		if (name && reference) {
			const type = settings[name] || (settings[name] = {
				name : name
			});
			type.description = info;
			type.reference = reference;
			return settings;
		}
		
		if(name){
			console.warn('VFS TYPES: settings for ' + name + ' filesystem type do not have required "reference" parameter, skipped');
		}
		return settings;
	})//
	.buildGetter()
;

module.exports.listFilesystemTypes = function listFilesystemTypes(){
	var result = {}, type;
	for(type of getSettings()){
		result[type.name] = {
			name : type.name,
			description : type.description,
		};
	}
	return result;
};

module.exports.getFilesystemType = function getFilesystemType(type){
	var type = getSettings()[type];
	if(!type){
		return undefined;
	}
	return {
		name : type.name,
		description : type.description,
	};
};

module.exports.createFilesystem = function createFilesystem(typeName, args){
	var settings = getSettings()[typeName];
	if(!settings){
		throw new Error('Unknown filesystem type: ' + typeName);
	}
	var type = require(settings.reference);
	if(!type){
		
		throw new Error("Can't resolve filesystem type reference: " + type.reference);
	}
	return type.create(args);
};