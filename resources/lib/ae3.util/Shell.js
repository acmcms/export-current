var Shell = require('java.class/ru.myx.ae3.console.shell.Shell');
var ProcessBuilder = require('java.class/java.lang.ProcessBuilder');

var Transfer = require('ae3/Transfer');

module.exports = {
	
	executeNativeCommandWithConsole : Shell.executeNativeCommandWithConsole,
	
	/**
	 * executeNativeInline - return result or throw an error
	 * 
	 * 
	 * var cmd = 'uptime | cut -d":" -f4- | sed s/,//g';
	 * 
	 * var cmd = ['ls','-la'];
	 * 
	 * var x = executeNativeInline(cmd);
	 * 
	 * OR
	 * 
	 * executeNativeInline(cmd, function callback(x){ console.log("result: " +
	 * x); });
	 */
	executeNativeInline : function executeNativeInline(cmd, callback) {
		var result = 'string' === typeof cmd
			? Shell.execParse(cmd)
			: Shell.execNative(Array(cmd));
		return callback
			? callback.call(this, result)
			: result;
	},
	/**
	 * executeNative - return object with result or error
	 * 
	 * 
	 * var cmd = 'uptime | cut -d":" -f4- | sed s/,//g';
	 * 
	 * var cmd = ['ls','-la'];
	 * 
	 * var x = executeNative(cmd);
	 * 
	 * OR
	 * 
	 * executeNative(cmd, function callback(x){ console.log("exit code: " +
	 * x.exitCode + ", result: " + x.result); });
	 */
	executeNative : function executeNative(cmd, callback) {
		var result;
		try {
			result = 'string' === typeof cmd
				? Shell.execParse(cmd)
				: Shell.execNative(Array(cmd));
			result = {
				exitCode : 0,
				result : result
			};
		} catch (e) {
			result = {
				exitCode : -1,
				error : e
			};
		}
		return callback
			? callback.call(this, result)
			: result;
	},
	/**
	 * executeHost - return object with result or error
	 * 
	 * var cmd = 'uptime | cut -d":" -f4- | sed s/,//g';
	 * 
	 * 
	 * 
	 * var x = executeHost(cmd);
	 * 
	 * OR
	 * 
	 * executeHost(cmd, function callback(x){ console.log("exit code: " +
	 * x.exitCode + ", output: " + x.output); });
	 */
	executeHost : function executeHost(cmd, callback) {
		/**
		 * prepare to start 'nslookup'
		 */
		// var builder = new ProcessBuilder(Array.isArray(cmd) ? cmd : [cmd]);
		var builder = new ProcessBuilder([ 'bash', '-c', cmd ]);
		/**
		 * merge stderr with stdout
		 */
		builder.redirectErrorStream(true);

		/**
		 * start the process
		 */
		var process = builder.start();
		var output = process.getOutputStream();
		// output.write(output.getBytes());
		output.close();

		/**
		 * get the output as string
		 */
		var input = Transfer.createCopier(process.getInputStream())
				.toStringUtf8();

		var exit = process.waitFor();

		/**
		 * fail on error - at least we'll have it in logs
		 */
		if (exit) {
			throw "EXIT: " + exit + ", outlen: " + input.length + ", out: "
					+ input;
		}
		var result = {
			exitCode : exit,
			output : input
		};
		return callback
			? callback.call(this, result)
			: result;
	},
};