/**
 * 
 */
const DefaultCountersHelper = require('java.class/ru.myx.ae3.internal.stats.DefaultCountersHelper');

const SystemBean = DefaultCountersHelper.vmSystemBean;

module.exports = {
	group : 'd',
	name : 'du',
	title : 'OS',
	columns : {
		hn : {
			name : "hn",
			nameExport : "hostName",
			title : "Host Name",
			titleShort : "Host",
			type : "string",
			chart : "none",
		},
		un : {
			name : "un",
			nameExport : "unixName",
			title : "OS Brand",
			titleShort : "Brand",
			type : "string",
			chart : "none",
		},
		ua : {
			name : "ua",
			nameExport : "unixArch",
			title : "OS Arch",
			titleShort : "Arch",
			type : "string",
			chart : "none",
		},
		uv : {
			name : "uv",
			nameExport : "unixVersion",
			title : "OS Version",
			titleShort : "Version",
			type : "string",
			chart : "none",
		},
		um : {
			name : "um",
			title : "OS Memory Size, bytes",
			titleShort : "RAM",
			type : "number",
			variant : "bytes",
			scale : "1",
			chart : "none",
		},
		pd : {
			name : "pd",
			nameExport : "PID",
			title : "JVM Instance PID",
			titleShort : "PID",
			type : "number",
			chart : "none",
		},
		pc : {
			name : "pc",
			nameExport : "commandLine",
			title : "JVM Instance Command Line",
			titleShort : "Command",
			type : "string",
			chart : "none",
		},
		l0 : {
			name : "l0",
			nameExport : "loadAverage",
			title : "Load Average 0 (in 1 minute)",
			titleShort : "LA0",
			type : "number",
			variant : "decimal",
			log : "normal",
			chart : "value",
		},
		cc : {
			name : "cc",
			nameExport : "cpuCores",
			title : "Processing Cores",
			titleShort : "Cores",
			type : "number",
			variant : "integer",
			scale : "1",
			chart : "none",
		},
	},
	getValues : function getValues(/*previous*/){
		const l0 = DefaultCountersHelper.osCpuLA0;
		const hn = DefaultCountersHelper.osHostName;
		const dt = (l0 >= 0 && hn) || require('ae3.util/Shell').executeHost(
			"uptime | grep -o 'load.*'  | cut -d ':' -f2- | sed s/,//g; " +
			"echo '%%'; " +
			"hostname; " +
			"echo '%%'; "
		).output.trim().split('%%');
		return {
			l0 : l0 >= 0 ? l0 : (+dt[0].trim().split(' ')[0]),
			cc : SystemBean.availableProcessors,
			hn : hn ?? dt[1].trim(),
			un : SystemBean.name,
			ua : SystemBean.arch,
			uv : SystemBean.version,
			um : SystemBean.totalMemorySize,
			pd : DefaultCountersHelper.osPid,
			pc : DefaultCountersHelper.osCommandLine,
		};
	},
};