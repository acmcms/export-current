module.exports = {
	group : 'd',
	name : 'dt',
	title : 'tcp',
	keywords : ['tcp'],
	columns : {
		sl : {
			name : "sl",
			nameExport : "TcpSocketsListening",
			title : "TCP Sockets Listening (Servers)",
			titleShort : "TCP Σ(s)",
			type : "number",
		},
		sc : {
			name : "sc",
			nameExport : "TcpSocketsEstablished",
			title : "TCP Sockets Connected (Established)",
			titleShort : "TCP Σ(c)",
			keywords : 'monitoring',
			type : "number",
			log : "normal",
			chart : "value",
		},
		sw : {
			name : "sw",
			nameExport : "TcpSocketsWaiting",
			title : "TCP Sockets Waiting (Pending)",
			titleShort : "TCP Σ(w)",
			keywords : 'monitoring',
			type : "number",
			log : "normal",
			chart : "value",
		},
		sd : {
			name : "sd",
			nameExport : "TcpSocketsClosed",
			title : "TCP Sockets Closed (By Other Peer)",
			titleShort : "TCP Σ(d)",
			type : "number",
		},
	},
	getValues : function getValues(/*previous*/){
		const dt = require('ae3.util/Shell').executeHost(
				"(ae3 proc/tcp-server-count 2> /dev/null || (netstat -an | grep 'tcp' | grep LISTEN | wc -l)); " +
				"echo '%%'; " +
				"ae3 proc/tcp-session-count 2> /dev/null || (netstat -n | grep 'tcp' | grep ESTABLISHED | wc -l); " +
				"echo '%%'; " +
				"ae3 proc/tcp-waiting-count 2> /dev/null || (netstat -n | grep 'tcp' | egrep 'CLOSE_WAIT|TIME_WAIT|SYN_SENT|FIN_WAIT' | wc -l); " +
				"echo '%%'; " +
				"ae3 proc/tcp-pending-count 2> /dev/null || (netstat -n | grep 'tcp' | egrep 'CLOSED' | wc -l); " +
				"echo '%%'"
			).output.trim().split('%%');
		return {
			sl : dt[0].trim(),
			sc : dt[1].trim(),
			sw : dt[2].trim(),
			sd : dt[3].trim(),
		};
	},
};