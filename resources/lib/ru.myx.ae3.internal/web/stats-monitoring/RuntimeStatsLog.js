function RuntimeStatsLog(systemName, pathPrefix){
	this.lib = lib;
	this.title = systemName + "::" + pathPrefix + "runtimeStatsLog (Runtime System Telemetry Log)";
	this.systemName = systemName;
	this.pathPrefix = pathPrefix;
	return this;
}

function runRuntimeStatsLog(context){
	const share = context.share;
	const client = share.authRequireAccount(context, 'admin');
	
	return require("ae3.stats/Stats").handleListRuntimeSystemStats(context, this.systemName, this.pathPrefix);
}

const PROTOTYPE = RuntimeStatsLog.prototype = {
	handle : runRuntimeStatsLog
};

module.exports = RuntimeStatsLog;
