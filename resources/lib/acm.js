const ACM_PROTOTYPE = Object.create(Object.prototype, {
	Server : {
		get : function(){
			return undefined;
			const result = require('ae3/Concurrent');
			Object.defineProperty(this, "Concurrent", {
				value : result
			});
			return result;
		}
	},
});

module.exports = Object.create(ACM_PROTOTYPE);