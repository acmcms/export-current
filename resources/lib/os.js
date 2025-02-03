/**
 * OS object, part of CommonJS standard de-facto.
 * see: http://nodejs.org/api/os.html
 */
import ru.myx.ae3.Engine;
import java.lang.Runtime;
import java.lang.System;

module.exports = {
	hostname : function(){
		return Engine.HOST_NAME;
	},
	type : function(){
		return System.getProperty("os.name");
	},
	platform : function(){
		return System.getProperty("os.name");
	},
	arch : function(){
		return System.getProperty("os.arch");
	},
	release : function(){
		return System.getProperty("os.version");
	},
	totalmem : function(){
		return Runtime.getRuntime().totalMemory();
	},
	freemem : function(){
		return Runtime.getRuntime().freeMemory();
	}
};