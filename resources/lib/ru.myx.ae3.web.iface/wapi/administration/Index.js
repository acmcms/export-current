const commands = {
	/**
	 * interface
	 */
	index:{
		icon : "house",
		title : "System Administration",
		access : "admin",
	},
	"../":{
		icon : "application_get",
		title : "Root index menu",
		access : "public",
		ui : true,
	},
};

{
	var auth = require('ae3.web/AuthAccountsPage').create({ 
		systemName : "AE3", 
		pathPrefix : "administration/", 
	});
	
	for(var i of auth.commandKeys()){
		commands[i] || (commands[i] = auth.getCommand(i));
	}
}

/*
commands['listActions'] = {
	icon : "book_edit",
	title : "List Tracked Actions",
	run : [ require, './ListActions' ],
	access : "admin",
	ui : true,
};
*/
/*
commands['readAction'] = {
	title : "Read Tracked Action",
	run : [ require, './ReadAction' ],
	access : "user",
	api : true,
};

*/

/*
commands['setupStats'] = {
	icon : "lock_edit",
	title : "Setup Stats",
	run : [ require, './SetupStats' ],
	ui : true,
	access : "admin",
};

*/

commands['tools'] = require('ae3.web/SystemToolsPage').create({ 
	systemName : "AE3", 
	pathPrefix : "administration/tools/", 
	access : "admin",
});


commands['../resource/documentation.xml'] = {
	icon : "help",
	title : "Documentation",
	access : "user",
	ui : true,
};


module.exports = require('ae3.web/IndexPage').create({
	title : "AE3::administration/index (System Administration)", 
	commands : commands,
	authRequired : true
});
