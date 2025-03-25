var service = require("./Service");
	
function startService(serviceName){
	service.run.apply(this, ["service", "start", serviceName]);
	return true;
}

exports.run = function run(){
	var args = arguments;
	if(!args?.length){
		console.sendMessage(
			"start command syntax:\n" +
			"\tstart <service_name> ..."
		);
		return false;
	}
	args.forEach(startService, this);
	return true;
};

exports.description = "Short for 'service start $@'";