/**
 * 
 */

/**
 * first index menu INDEX, more INDEX added later in this script.
 */
const INDEX = {
	/**
	 * interface
	 */
	index:{
		icon : "house",
		title : "System Administration",
		access : "admin",
	},
	"../index":{
		icon : "application_get",
		title : "Root index menu",
		access : "public",
		ui : true,
	},
};

/**
 * Bind all accounts INDEX to administration root index 
 */
{
	const auth = require('ae3.web/AuthAccountsPage').create({ 
		systemName : "AE3", 
		pathPrefix : "administration/", 
	});
	
	for(let i of auth.commandKeys()){
		INDEX[i] ??= auth.getCommand(i);
	}
}

/*
INDEX['listActions'] = {
	icon : "book_edit",
	title : "List Tracked Actions",
	run : [ require, './ListActions' ],
	access : "admin",
	ui : true,
};
*/
/*
INDEX['readAction'] = {
	title : "Read Tracked Action",
	run : [ require, './ReadAction' ],
	access : "user",
	api : true,
};

*/

/*
INDEX['setupStats'] = {
	icon : "lock_edit",
	title : "Setup Stats",
	run : [ require, './SetupStats' ],
	ui : true,
	access : "admin",
};

*/

INDEX['tools'] = require('ae3.web/SystemToolsPage').create({ 
	systemName : "AE3", 
	pathPrefix : "administration/tools/", 
	access : "admin",
});


INDEX['../resource/documentation.xml'] = {
	icon : "help",
	title : "Documentation",
	access : "user",
	ui : true,
};


module.exports = require('ae3.web/IndexPage').create({
	title : "AE3::administration/index (System Administration)", 
	commands : INDEX,
	authRequired : true
});
