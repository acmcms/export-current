import java.net.InetAddress;

const Concurrent = require('ae3').Concurrent;

module.exports = Object.create(Object.prototype, {
	/**
	 * classes
	 */
	"InetAddress" : {
		enumerable : true,
		value : InetAddress
	},
	
	/**
	 * resolve the hostname to an array of addresses, synchronously
	 * 
	 * returns array of InetAddress
	 * 
	 */
	"resolveAll" : {
		enumerable : true,
		value : InetAddress.getAllByName
	},
	
	/**
	 * resolve the hostname to one address, synchronously
	 * 
	 * returns an InetAddress object
	 * 
	 */
	"resolveOne" : {
		enumerable : true,
		value : InetAddress.getByName
	},
	
	"resolveAsync" : {
		enumerable : true,
		value : Concurrent.wrapBuffered(function(queue){
			// TODO: unfinished
			return;
		}, {
			buffer : 16,
	 		delay : 0, 
	 		period : 0
		})
	},
	"toString" : {
		value : function(){
			return "[Object ae3.net.dns API]";
		}
	}
});
