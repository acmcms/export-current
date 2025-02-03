/**
 * 
 */
const DefaultCountersHelper = require('java.class/ru.myx.ae3.internal.stats.DefaultCountersHelper');

const Act = require('java.class/ru.myx.ae3.act.ImplementAct');
const Wte = require('java.class/ru.myx.ae3.common.WaitTimeoutExceptionStats');

module.exports = {
	group : 'd',
	name : 'da',
	title : 'ae3',
	columns : {
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
	},
	getValues : function getValues(/*previous*/){
		return {
			d : Act.stDetachedThreadCount,
			w : Wte.stWaitTimeoutExceptions,
		};
	},
};