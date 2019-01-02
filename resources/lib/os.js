/**
 * OS object, part of CommonJS standard de-facto.
 * see: http://nodejs.org/api/os.html
 */


function getOsHostName(){
	import ru.myx.ae3.Engine;
	return Engine.HOST_NAME;
}

function getOsType(){
	import java.lang.System;
	return System.getProperty("os.name");
}

function getOsPlatform(){
	import java.lang.System;
	return System.getProperty("os.name");
}

function getOsArch(){
	import java.lang.System;
	return System.getProperty("os.arch");
}

function getOsRelease(){
	import java.lang.System;
	return System.getProperty("os.version");
}

function getOsTotalMem(){
	import java.lang.Runtime;
	return Runtime.getRuntime().totalMemory();
}

function getOsFreeMem(){
	import java.lang.Runtime;
	return Runtime.getRuntime().freeMemory();
}

module.exports = {
	hostname : getOsHostName,
	type : getOsType,
	platform : getOsPlatform,
	arch : getOsArch,
	release : getOsRelease,
	totalmem : getOsTotalMem,
	freemem : getOsFreeMem
};