const prototype = Object.create(Object.prototype, {
	"Class" : {
		get : function ae3Concurrent(){
			const result = require('ae3/Class');
			Object.defineProperty(this, "Class", {
				value : result
			});
			return result;
		}
	},
	"Concurrent" : {
		get : function ae3Concurrent(){
			const result = require('ae3/Concurrent');
			Object.defineProperty(this, "Concurrent", {
				value : result
			});
			return result;
		}
	},
	"Flow" : {
		get : function ae3Flow(){
			const result = require('ae3/Flow');
			Object.defineProperty(this, "Flow", {
				value : result
			});
			return result;
		}
	},
	"Host" : {
		get : function ae3Hostet(){
			const result = require('ae3/Host');
			Object.defineProperty(this, "Host", {
				value : result
			});
			return result;
		}
	},
	"Reply" : {
		get : function ae3Reply(){
			const result = require('ae3/Reply');
			Object.defineProperty(this, "Reply", {
				value : result
			});
			return result;
		}
	},
	"Request" : {
		get : function ae3Request(){
			const result = require('ae3/Request');
			Object.defineProperty(this, "Request", {
				value : result
			});
			return result;
		}
	},
	"Transfer" : {
		get : function ae3Transfer(){
			const result = require('ae3/Transfer');
			Object.defineProperty(this, "Transfer", {
				value : result
			});
			return result;
		}
	},
	"Util" : {
		get : function ae3Util(){
			const result = require('ae3/Util');
			Object.defineProperty(this, "Util", {
				value : result
			});
			return result;
		}
	},
	"crypto" : {
		get : function ae3Crypto(){
			const result = require('ae3/crypto');
			Object.defineProperty(this, "crypto", {
				value : result
			});
			return result;
		}
	},
	"net" : {
		get : function ae3Net(){
			const result = require('ae3/net');
			Object.defineProperty(this, "net", {
				value : result
			});
			return result;
		}
	},
	"web" : {
		get : function ae3Web(){
			const result = require('ae3/web');
			Object.defineProperty(this, "web", {
				value : result
			});
			return result;
		}
	},
	"vfs" : {
		get : function ae3Vfs(){
			const result = require('ae3/vfs');
			Object.defineProperty(this, "vfs", {
				value : result
			});
			return result;
		}
	},
	"toString" : {
		value : function(){
			return "ae3";
		}
	}
});

module.exports = Object.create(prototype);