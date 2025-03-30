/**
 * TODO: 
 * 
 * vm status
 * 
 * vm operations
 * 
 * vm modifiers
 * 
 * 
 */

module.exports = {
	description : "'vm' status command",
	run : function() {
		var map = {
				a00 : require('java.class/ru.myx.ae3.exec.OperationsA00'),
				a01 : require('java.class/ru.myx.ae3.exec.OperationsA01'),
				a10 : require('java.class/ru.myx.ae3.exec.OperationsA10'),
				a11 : require('java.class/ru.myx.ae3.exec.OperationsA11'),
				a2X : require('java.class/ru.myx.ae3.exec.OperationsA2X'),
				a3X : require('java.class/ru.myx.ae3.exec.OperationsA3X'),
			};
			
			for(var k in map){
				var enum = map[k];
				console.sendMessage("%s: %s", k, enum);
			}
		}
};
