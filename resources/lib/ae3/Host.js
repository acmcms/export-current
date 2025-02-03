/**
 * 
 */

import ru.myx.ae3.internal.HostApiHelper;
import java.lang.Runtime;
import ru.myx.ae3.Engine;

module.exports = Object.create(Object.prototype, {
	HOST_NAME : {
		get : HostApiHelper.getHostName,
		enumerable : true
	},
	AE3_VERSION_MAJOR : {
		value : 5,
		enumerable : true
	},
	AE3_VERSION_NUMBER : {
		value : Engine.VERSION_NUMBER,
		enumerable : true
	},
	AE3_VERSION_STRING : {
		value : Engine.VERSION_STRING,
		enumerable : true
	},
	AE3_UPTIME : {
		get : HostApiHelper.getUptime,
		enumerable : true
	},
	assessCpuLoad : {
		value : function(){
			return this.assessHostCpuLoad();
		}
	},
	assessMemoryUsage : {
		value : function(){
			return this.assessVmMemoryUsage();
		}
	},
	assessStorageUsage : {
		value : function(){
			return this.assessVmStorageUsage();
		}
	},
	assessHostCpuLoad : {
		value : function(){
			var load = HostApiHelper.assessHostCpuLoad();
			if(load >= 0){
				return load;
			}
			// TODO: unix only 8-(
			load = require("ae3.util/Shell").executeHost("uptime | grep -o 'load.*'  | cut -d ':' -f2- | sed s/,//g").output.trim().split(" ");
			return Math.min(1.0, +load[0] / Runtime.runtime.availableProcessors());
		}
	},
	assessHostMemoryUsage : {
		value : function(){
			return -1;
		}
	},
	assessVmCpuLoad : {
		value : function(){
			return -1;
		}
	},
	assessVmMemoryUsage : {
		value : function(){
			const usage = HostApiHelper.assessVmMemoryUsage();
			if(usage >= 0){
				return usage;
			}
			return 1 - 1.0 * Runtime.runtime.freeMemory() / Runtime.runtime.maxMemory();
		}
	},
	assessVmStorageUsage : {
		value : HostApiHelper.assessVmStorageUsage ?? function(){
			return 1 - 1.0 * Engine.PATH_PRIVATE.usableSpace / Engine.PATH_PRIVATE.totalSpace;
		}
	}
});