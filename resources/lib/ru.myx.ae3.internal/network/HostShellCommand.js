
function runHostCommand() {
	var args = arguments;
	
	args = Array.prototype.slice.call(args);
	/* var selfName = */ args.shift();
	
	var hostname;
	for(;;){
		var argument = (args.shift() || '').trim();
		if(!argument){
			break;
		}
		if(argument[0] === '-' || argument[0] === '\''){
			return console.fail("unsupported option: %s", argument);
		}
		hostname = argument;
		break;
	}
	if (!hostname) {
		console.error("Syntax:\n\thost <hostname>");
		return false;
	}

	const result = (require('ae3').net.dns.resolveAll(hostname) || []).map(function(x){
		console.log("%s: %s", hostname, x.hostAddress);
		return x.hostAddress;
	});
	if(!result || !result.length){
		return console.fail("can not resolve: %s", hostname);
	}
	return result;
}

exports.run = runHostCommand;
exports.description = "Resolves the host name and returns all ip addresses";