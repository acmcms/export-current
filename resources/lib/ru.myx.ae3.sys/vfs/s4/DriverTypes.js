var Settings = require("ae3.util/Settings");

const getSettings = Settings.SettingsBuilder.builderCachedLazy()//
	.setInputFolderPath("settings/system/s4/driver")//
	.setDescriptorReducer(function(settings, description){
		if (description.type != "ae3/Factory") {
			return settings;
		}
		/**
		 * 'order of appearance'
		 */
		var name = description.name;
		var info = description.description;
		var reference = description.reference;
		/**
		 * 
		 */

		/**
		 * actually name and reference are mandatory
		 */
		if (name && reference) {
			var type = settings[name] || (settings[name] = {
				name : name
			});
			type.description = info;
			type.reference = reference;
		}else //
		if(name){
			console.warn('S4 DRIVERS: settings for ' + name + ' driver info do not have required "reference" parameter, skipped');
		}
		return settings;
	})//
	.buildGetter()
;

module.exports.listDrivers = function listDrivers(){
	var result = {}, type;
	for(type of getSettings()){
		result[type.name] = {
			name : type.name,
			description : type.description,
		};
	}
	return result;
};

module.exports.getDriver = function getDriver(type){
	var type = getSettings()[type];
	if(!type){
		return undefined;
	}
	return {
		name : type.name,
		description : type.description,
	};
};

module.exports.createDriver = function createDriver(typeName, args){
	var settings = getSettings()[typeName];
	if(!settings){
		throw new Error('Unknown driver type: ' + typeName);
	}
	var type = require(settings.reference);
	if(!type){
		throw new Error("Can't resolve driver reference: " + settings.reference);
	}
	if("function" === typeof type.newInstance){
		return type.newInstance();
	}
	if("function" === typeof type.create){
		return type.create(args);
	}
	try{
		// newInstance above doesn't work with classes somehow 8-(
		return new type();
	}catch(e){
		//
	}
	throw new Error("Can't create driver instance: " + settings.reference + ", type: " + Format.jsDescribe(type));
};