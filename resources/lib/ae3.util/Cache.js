/**
 * Fast and efficient cache.
 * 
 * CommonJS wrapper for fast java cache. Objects are removed after some period
 * or when system needs some memory being freed.
 */

// var Collector =
// Object.create(require('java.class/ru.myx.ae3.console.ConsoleCollector'));
const Cache = require('java.class/ru.myx.ae3.cache.Cache');
const CacheType = require('java.class/ru.myx.ae3.cache.CacheType').SMALL_JAVA_SOFT;

/**
 * Constructor.
 * 
 * @param key
 *            keyName
 * @param createCallback
 *            optional, function(attachment, key)
 * @param validateCallback
 *            optional, function(object, date)
 * @returns
 */
function CacheObject(key, createCallback, validateCallback) {
	if (createCallback) {
		this.setFactory(createCallback);
	}
	Object.defineProperty(this, "cache", {
		value : Cache.createL1(key, CacheType)
	});
	return this;
}


Object.defineProperties(CacheObject.prototype, {
	"setFactory" : {
		value : function(createCallback) {
			if ('function' !== typeof createCallback) {
				throw new TypeError("'createCallback' must be function");
			}
			Object.defineProperties(this, {
				"creator" : {
					value : Cache.createBaseFactory(createCallback, this),
					writable : true
				}
			});
			Object.defineProperties(this, {
				"TTL" : {
					value : createCallback?.TTL || this.TTL || 15000,
					writable : true
				}
			});
			return this;
		}
	},
	"setTtl" : {
		value : function(millis){
			Object.defineProperties(this, {
				"TTL" : {
					value : millis || 15000,
					writable : true
				}
			});
			return this;
		}
	},
	"clear" : {
		value : function() {
			return this.cache.clear();
		}
	},
	"get" : {
		value : function(key) {
			return this.cache.get(key);
		}
	},
	"getCreate" : {
		/**
		 * 
		 * @param key
		 * @param creationAttachment
		 *            optional
		 * @param creationKey
		 *            optional
		 * @param creatorCallback
		 *            optional
		 * @returns
		 */
		value : function(key, creationAttachment, creationKey, creatorCallback) {
			if (!key) {
				throw "'key' is required!";
			}
			if (!creatorCallback) {
				/** assignment in condition **/
				if (! (creatorCallback = this.creator) ) {
					throw new Error("'callback' is required or must be set during initialization of the cache object!");
				}
				return this.cache.getCreate(
					key, 
					creationAttachment, 
					creationKey ?? key, 
					creatorCallback
				);
			}
			return this.cache.getCreate(
				key, 
				creationAttachment, 
				creationKey ?? key, 
				Cache.createBaseFactory(creatorCallback, this)
			);
		}
	},
	"put" : {
		value : function(key, value) {
			return this.cache.put(key, value, this.TTL || 15000);
		}
	},
	"remove" : {
		value : function(key) {
			return this.cache.remove(key);
		}
	},
	"size" : {
		value : function() {
			return this.cache.size();
		}
	},
	"toString" : {
		value : function() {
			return this.cache.toString();
		}
	}
});


module.exports = CacheObject;