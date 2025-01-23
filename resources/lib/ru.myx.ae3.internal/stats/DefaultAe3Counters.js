/**
 * 
 */
const ProcessHandle = require('java.class/java.lang.ProcessHandle');

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
		const commandLine = ProcessHandle.current​().info()?.commandLine();
		return {
			pd : ProcessHandle.current​().pid​(),
			pc : commandLine?.isPresent() && commandLine.get()
		};
	},
};