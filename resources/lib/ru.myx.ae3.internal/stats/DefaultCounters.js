const Engine = require('java.class/ru.myx.ae3.Engine');
const Act = require('java.class/ru.myx.ae3.act.ImplementAct');
const Wte = require('java.class/ru.myx.ae3.common.WaitTimeoutExceptionStats');
const Runtime = require('java.class/java.lang.Runtime');



const STARTED = (new Date(Engine.STARTED)).toISOString();
const ROOT_GRP = (function ff(g){ return g.parent ? ff(g.parent) : g; })(require('java.class/java.lang.Thread').currentThread().threadGroup);

module.exports = {
	group : 'd',
	name : 'd',
	title : 'System',
	columns : {
		s : {
			name : "s",
			title : "Started",
			type : "date",
			variant : "date",
//			log : "detail",
		},
		u : {
			name : "u",
			title : "Uptime",
			type : "number",
			variant : "period",
			scale : "1",
//			log : "detail",
//			chart : "counter",
		},
		t : {
			name : "t",
			nameExport : "threadCountCurrent",
			title : "Thread Count",
			titleShort : "Thrds",
			type : "number",
			variant : "integer",
			log : "normal",
		},
		d : {
			name : "d",
			nameExport : "threadsDetachedTotal",
			title : "Detached Thread Count, Σ",
			titleShort : "Σ(DT)",
			type : "number",
			variant : "integer",
//			log : "detail",
		},
		D : {
			name : "D",
			title : "Detached Thread Count, Δ",
			titleShort : "Δ(DT)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'd'
			}
		},
		w : {
			name : "w",
			nameExport : "threadsTimedOutWaitingTotal",
			title : "WaitTimeout Exceptions, Σ",
			titleShort : "Σ(WT)",
			type : "number",
			variant : "integer",
//			log : "detail",
		},
		W : {
			name : "W",
			title : "WaitTimeout Exceptions, Δ",
			titleShort : "Δ(WT)",
			type : "number",
			variant : "integer",
			log : "normal",
			chart : "delta",
			evaluate : {
				type : 'delta',
				reference : 'w'
			}
		},
		m : {
			name : "m",
			title : "Memory Available, bytes",
			titleShort : "RAM",
			type : "number",
			variant : "bytes",
			scale : "1",
		},
		c : {
			name : "c",
			title : "Processing Cores",
			titleShort : "Cores",
			type : "number",
			variant : "integer",
			scale : "1",
		},
	},
	getValues : function getValues(/*previous*/){
		return {
			s : STARTED,
			// to integer
			u : Engine.getUptimeMillis(),
			t : ROOT_GRP.activeCount(),
			d : Act.stDetachedThreadCount,
			m : Runtime.getRuntime().maxMemory(),
			c : Runtime.getRuntime().availableProcessors(),
			w : Wte.stWaitTimeoutExceptions,
		};
	},
};
