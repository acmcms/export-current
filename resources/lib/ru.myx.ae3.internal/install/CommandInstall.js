var pkg = require("./Package");
	
function installPackage(packageName){
	pkg.run.call(pkg, "package", "install", packageName);
	return true;
}

exports.run = function run(){
	var args = arguments;
	if(!args?.length){
		console.sendMessage(
			"install command syntax:\n" +
			"\tinstall <package_name> ..."
		);
		return false;
	}
	args.shift();
	args.forEach(installPackage);
	return true;
};

exports.description = "Short for 'package install $@'";
