/**
 * 
 */
const DefaultCountersHelper = require('java.class/ru.myx.ae3.internal.stats.DefaultCountersHelper');

const RuntimeBean = DefaultCountersHelper.vmRuntimeBean;
const ThreadBean = DefaultCountersHelper.vmThreadBean;
const MemoryBean = DefaultCountersHelper.vmMemoryBean;
const SystemBean = DefaultCountersHelper.vmSystemBean;

const STARTED_STR = (new Date(RuntimeBean?.startTime ?? Date.now())).toISOString();

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
			chart : "none",
		},
		u : {
			name : "u",
			nameExport : "uptime",
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
			chart : "value",
		},
		m : {
			name : "m",
			nameExport : "heapMemory",
			title : "VM Heap Memory, bytes",
			titleShort : "jvm-Heap",
			type : "number",
			variant : "bytes",
			scale : "1",
			chart : "none",
		},
		M : {
			name : "M",
			nameExport : "nonNeapMemory",
			title : "VM Non-Heap Memory, bytes",
			titleShort : "non-Heap",
			type : "number",
			variant : "bytes",
			scale : "1",
			chart : "none",
		},
		vN : {
			name : "vN",
			nameExport : "vmName",
			title : "VM Name",
			type : "string",
			chart : "none",
		},
		vV : {
			name : "vV",
			nameExport : "vmVendor",
			title : "VM Vendor",
			type : "string",
			chart : "none",
		},
		vv : {
			name : "vv",
			nameExport : "vmVersion",
			title : "VM Version",
			type : "string",
			chart : "none",
		},
	},
	getValues : function getValues(/*previous*/){
		return {
			s : STARTED_STR,
			// to integer
			u : RuntimeBean.uptime,
			t : ThreadBean.threadCount,
			m : DefaultCountersHelper.vmMaxHeapMemory,
			M : DefaultCountersHelper.vmMaxNonHeapMemory,
			vN : RuntimeBean.vmName,
			vV : RuntimeBean.vmVendor,
			vv : RuntimeBean.vmVersion,
		};
	},
};
