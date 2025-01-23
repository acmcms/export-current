/**
 * 
 */
const DefaultCountersHelper = require('java.class/ru.myx.ae3.state.base.DefaultCountersHelper');

module.exports = {
	group : 'd',
	name : 'da',
	title : 'ae3',
	columns : {
		pd : {
			name : "pd",
			nameExport : "PID",
			title : "Instance PID",
			titleShort : "PID",
			type : "number",
		},
		pc : {
			name : "pc",
			nameExport : "commandLine",
			title : "Command Line",
			titleShort : "Command",
			type : "string",
		},
	},
	getValues : function getValues(/*previous*/){
		return {
			pd : DefaultCountersHelper.getPid(),
			pc : DefaultCountersHelper.getCommandLine(),
		};
	},
};