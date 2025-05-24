const lib = require('ru.myx.ae3.web.iface/Ae3WebService');

const commands = {
	/**
	 * interface
	 */
	index:{
		icon : "house",
		title : "Root index menu",
		access : "public",
	},

	"administration":{
		icon : "wrench_orange",
		link : "administration/",
		title : "Administration",
		run : [ require, './administration/Index' ],
		access : "admin",
		ui : true,
		group : true,
	},
};

{
	const settings = require("ae3.util/Settings").SettingsBuilder.builderSimple()//
		.setInputFolderPath("settings/web/iface")//
		.setDescriptorReducer(function(settings, description){
			if(description.type !== "ae3.WebIndex"){
				return settings;
			}
			const name = description.name;
			const reference = description.reference;
			// actually name is mandatory
			if(name){
				const service = settings[name] ||= { 
					name : name,
				};
				service.reference = reference;
			}
			return settings;
		})//
		.get()//
	;
	
	var key, IndexClass, indexObject;
	
	for(key of Object.keys(settings)){
		console.log(">>>>>> ae3 iface index, add index: %s: %s", key, Format.jsObject(settings[key]));
		try{ 
			IndexClass = require(settings[key].reference);
		}catch(e){
			console.error(">>>>>> ae3 iface index, error adding index: %s: %s, error: %s", key, Format.jsObject(settings[key]), e);
			continue;
		}
		indexObject = new IndexClass(lib, {
			systemName : "AE3", 
			pathPrefix : key + "/", 
		});
		if(!indexObject){
			console.error(">>>>>> ae3 iface index, skipping index: %s: %s", key, Format.jsObject(settings[key]));
			continue;
		}
		commands[key] = indexObject;
	}
}

commands.putAll({
	"monitoring": require('ae3.web/StatsMonitoringPage').create({ 
		systemName : "AE3", 
		pathPrefix : "monitoring/", 
	}),
	
	"personal": require('ae3.web/AuthPersonalPage').create({ 
		systemName : "AE3", 
		pathPrefix : "personal/", 
	}),
	
	"developer":{
		icon : "user_red",
		link : "developer/",
		title : "Developer",
		run : [ require, './developer/Index' ],
		ui : true,
		group : true,
		access : "public",
	},

	resource:{
		title : "System: resource accessor",
		run : [ require, './Resource' ],
		ui : false,
		access : "public",
	},
	
	/**
	 * synthetic
	 */
	"resource/root-ca.crt":{
		icon : "shield_go",
		title : "Server's Root Certificate",
		access : "public",
		ui : false,
	},
});

try{
	// TODO: services should be managed regardless of web subsystem
	require('ru.myx.ae3.internal/discovery/DiscoveryWebService');
}catch(e){
	// ignore
}

module.exports = require('ae3.web/IndexPage').create({ 
	title : "AE3::index (Web Interface Welcome Page)", 
	commands : commands
});
