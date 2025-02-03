/**
 * 
 */

const NioStats = require('java.class/ru.myx.ae3.transfer.nio.NioStatusProvider');

const DefaultNioCounters = {
	group : 'd',
	name : 'dn',
	title : 'NIO Counters',
	columns : {
		s : {
			name : "s",
			nameExport : "bytesSent",
			title : "NIO TX (Bytes Sent), Σ",
			titleShort : "NIO Σ(tx)",
			type : "number",
			variant : "bytes",
			log : "detail",
			chart : "counter",
		},
		ds : {
			name : "ds",
			title : "NIO TX (Bytes Sent), Δ",
			titleShort : "NIO Δ(tx)",
			type : "number",
			variant : "bytes",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 's'
			}
		},
		r : {
			name : "r",
			nameExport : "bytesReceived",
			title : "NIO RX (Bytes Received), Σ",
			titleShort : "NIO Σ(rx)",
			type : "number",
			variant : "bytes",
			log : "detail",
			chart : "counter",
		},
		dr : {
			name : "dr",
			title : "NIO RX (Bytes Received), Δ",
			titleShort : "NIO Δ(rx)",
			type : "number",
			variant : "bytes",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'r'
			}
		},
		sB : {
			name : "sB",
			title : "Socket Tx Buffer (Write/Send)",
			titleShort : "Tx Buf",
			type : "number",
			variant : "bytes",
		},
		rB : {
			name : "rB",
			title : "Socket Rx Buffer (Read/Receive)",
			titleShort : "Rx Buf",
			type : "number",
			variant : "bytes",
		},
	},
	getValues : function getValues(/*previous*/){
		return {
			s : NioStats.statsTotalBytesSent,
			r : NioStats.statsTotalBytesReceived,
			sB : NioStats.socketTxBuffer,
			rB : NioStats.socketRxBuffer,
		};
	},
};


module.exports = DefaultNioCounters;