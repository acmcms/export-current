var pkg = require("./Package");
	
function removePackage(packageName){
	pkg.run.call(pkg, "package", "remove", packageName);
	return true;
}

exports.run = function run(){
	var args = arguments;
	if(!args?.length){
		console.sendMessage(
			"remove command syntax:\n" +
			"\tremove <package_name> ..."
		);
		return false;
	}
	args.forEach(removePackage);
	return true;
};

exports.description = "Short for 'package remove $@'";
