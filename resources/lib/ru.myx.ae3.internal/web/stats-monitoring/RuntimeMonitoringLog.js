function RuntimeMonitoringLog(systemName, pathPrefix){
	this.lib = lib;
	this.title = systemName + "::" + pathPrefix + "runtimeStatsLog (Runtime System Telemetry Log)";
	this.systemName = systemName;
	this.pathPrefix = pathPrefix;
	return this;
}

function runRuntimeMonitoringLog(context){
	const share = context.share;
	const client = share.authRequireAccount(context, ['admin', 'monitor', 'monitoring', 'client', 'stats']);
	
	if(!context.query.parameters.filter){
		context.query.parameters.filter = 'monitoring';
	}else//
	if(context.query.parameters.filter !== 'monitoring'){
		return this.layoutAccessDeniedUnmaskable(query, "Only 'monitoring' filter is allowed!");
	}
	
	return require("ae3.stats/Stats").handleListRuntimeSystemStats(context, this.systemName, this.pathPrefix, true);
}

const PROTOTYPE = RuntimeMonitoringLog.prototype = {
	handle : runRuntimeMonitoringLog
};

module.exports = RuntimeMonitoringLog;
