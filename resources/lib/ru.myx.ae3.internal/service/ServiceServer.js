
var stopped = true;

exports.start = function start(){
	if(!stopped){
		throw "already started";
	}
	stopped = false;
};

exports.stop = function stop(){
	if(stopped){
		throw "already stopped";
	}
	stopped = true;
};

exports.description = "Virtual service 'server', representing a group of services which are supposed to run on the server machine.";