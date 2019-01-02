module.exports = {
	group : 'd',
	name : 'du',
	title : 'Unix',
	columns : {
		hn : {
			name : "hn",
			nameExport : "hostName",
			title : "Host Name",
			titleShort : "Host",
			type : "string",
		},
		un : {
			name : "un",
			nameExport : "unixName",
			title : "Unix Name",
			titleShort : "Uname",
			type : "string",
		},
		l0 : {
			name : "l0",
			title : "Load Averages (in 1 minute)",
			titleShort : "LA 1",
			type : "number",
		},
		l1 : {
			name : "l1",
			nameExport : "LA5",
			title : "Load Averages (in 5 minutes)",
			titleShort : "LA 5",
			type : "number",
			log : "normal",
			chart : "value",
		},
		l2 : {
			name : "l2",
			title : "Load Averages (in 15 minutes)",
			titleShort : "LA 15",
			type : "number",
		},
	},
	getValues : function getValues(/*previous*/){
		const dt = require('ae3.util/Shell').executeHost(
				"uptime | grep -o 'load.*'  | cut -d ':' -f2- | sed s/,//g; " +
				"echo '%%'; " +
				"hostname; " +
				"echo '%%'; " +
				"uname;"  +
				"echo '%%'; "
				// "(netstat -an | grep tcp | grep LISTEN | wc -l) || echo -1; "
				// "(netstat -n | grep tcp | grep ESTABLISHED | wc -l) || echo -1; " +
				// "(netstat -n | grep tcp | egrep 'CLOSE_WAIT|TIME_WAIT|SYN_SENT' | wc -l) || echo -1; " +
			).output.trim().split('%%');
		const la = dt[0].trim().split(' ');
		return {
			l0 : la[0],
			l1 : la[1],
			l2 : la[2],
			hn : dt[1].trim(),
			un : dt[2].trim(),
		};
	},
};