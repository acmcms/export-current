exports.run = function task(){
	console.log("PeriodicCleanupTask::run: stats periodic cleanup");
	require('./Stats').runPeriodicIdleTasks();
	return true;
};

exports.description = "Expired stats cleanup periodic task.";