var service = require("./Service");
	
function stopService(serviceName){
	service.run.apply(this, ["service", "stop", serviceName]);
	return true;
}

exports.run = function run(){
	var args = arguments;
	if(!args || !args.length){
		console.sendMessage(
			"stop command syntax:\n" +
			"\tstop <service_name> ..."
		);
		return false;
	}
	args.forEach(stopService, this);
	return true;
};

exports.description = "Short for 'service stop $@'";