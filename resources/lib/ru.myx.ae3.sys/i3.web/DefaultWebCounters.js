const HttpIfaceStats = require('java.class/ru.myx.ae3.i3.web.http.HttpStatusProvider');
const HttpClientStats = require('java.class/ru.myx.ae3.i3.web.http.client.HttpClientStatusProvider');

module.exports = {
	group : 'd',
	name : 'dw',
	nameExport : "ae3.web",
	title : 'Web Counters',
	columns : {
		c : {
			name : "c",
			nameExport : "httpIncomingConnections",
			title : "HTTP Incoming Connections, Σ",
			titleShort : "HTTP Σ(in)",
			type : "number",
			variant : "integer",
//			log : "detail",
//			chart : "counter",
		},
		dc : {
			name : "dc",
			title : "HTTP Incoming Connections, Δ",
			titleShort : "HTTP Δ(in)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'c'
			}
		},
		r : {
			name : "r",
			nameExport : "httpQueriesParsed",
			title : "HTTP Queries Parsed, Σ",
			titleShort : "HTTP Σ(rq)",
			type : "number",
			variant : "integer",
//			log : "detail",
//			chart : "counter",
		},
		dr : {
			name : "dr",
			title : "HTTP Queries Parsed, Δ",
			titleShort : "HTTP Δ(rq)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'r'
			}
		},
		C : {
			name : "C",
			nameExport : "httpOutgoingConnections",
			title : "HTTP Outgoing Connections, Σ",
			titleShort : "HTTP Σ(out)",
			type : "number",
			variant : "integer",
//			log : "detail",
//			chart : "counter",
		},
		dC : {
			name : "dC",
			title : "HTTP Outgoing Connections, Δ",
			titleShort : "HTTP Δ(out)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'C'
			}
		},
		R : {
			name : "R",
			nameExport : "httpResponsesParsed",
			title : "HTTP Responses Parsed, Σ",
			titleShort : "HTTP Σ(rs)",
			type : "number",
			variant : "integer",
//			log : "detail",
//			chart : "counter",
		},
		dR : {
			name : "dR",
			title : "HTTP Responses Parsed, Δ",
			titleShort : "HTTP Δ(rs)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'R'
			}
		},
		F : {
			name : "F",
			nameExport : "httpResponsesFinished",
			title : "HTTP Responses Finished, Σ",
			titleShort : "HTTP Σ(rf)",
			type : "number",
			variant : "integer",
//			log : "detail",
//			chart : "counter",
		},
		dF : {
			name : "dF",
			title : "HTTP Responses Finished, Δ",
			titleShort : "HTTP Δ(rf)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'F'
			}
		},
	},
	getValues : function getValues(/*previous*/){
		return {
			c : HttpIfaceStats.statsConnections,
			r : HttpIfaceStats.statsRequests,
			C : HttpClientStats.statsConnections,
			R : HttpClientStats.statsRequests,
			F : HttpClientStats.statsRequestsFinished,
		};
	},
};
