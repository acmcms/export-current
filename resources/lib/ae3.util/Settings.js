const vfs = require("ae3/vfs");

/**
 * internal, filters JSON descriptors from array of VFS entries
 * 
 * @param file
 * @returns boolean
 */
function filterDescriptors(file/* , i, a */) {
	return file.key.endsWith(".json");
}

/**
 * internal, converts a VFS entry to JS map object.
 * 
 * @param file
 * @returns map
 */
function parseDescriptor(file/* , i, a */) {
	const key = file.key;
	if(key.endsWith(".json")){
		const description = JSON.parse(file.textContent);
		description.name ||= key.substr(0, -5);
		return description;
	}
	throw new Error("Unsupported file type: " + key);
}

/**
 * internal, converts a VFS entry to JS map object.
 * 
 * @param file
 * @returns map
 */
function reduceCheckSum(prev, file/* , i, a */) {
	return prev + "\n" + file.toBinary().binaryContentLength + ":"
			+ file.lastModified;
}

function internCheckReload(cacheKey, folder, callback, cache, cached){
	console.log(">>>>>> settings check async, path: %s", cacheKey);

	var array = folder.getContentCollection(null).filter(filterDescriptors);
	var checkSum = array.reduce(reduceCheckSum, "");
	if (cached?.checkSum === checkSum) {
		cached.timestamp = Date.now();
		console.log(">>>>>> settings check async, not changed, path: %s", cacheKey);
		return;
	}

	var settings = {};

	cached = {
		timestamp : Date.now(),
		checkSum : checkSum,
		callback : callback,
		settings : settings
	};

	settings = array.map(parseDescriptor).reduce(callback, settings);
	if (settings != cached.settings) {
		throw "Settings are replaced by callback!";
	}
	cache[cacheKey] = cached;
	console.log(">>>>>> settings check async, new settings, path: %s", cacheKey);
	return;
}

module.exports = Object.create(Object.prototype, {
	/**
	 * This method can cache results of your configuration parsing. You provide
	 * callback which receives settings object and current description's map. This
	 * callback modified settings object accordingly and returns it.
	 * 
	 * After that settings object can be reused and cached until descriptors are
	 * changed or some timeout happens.
	 * 
	 * You should provide same instance of callback, otherwise cache will not be
	 * used for security reasons.
	 * 
	 * @param path path, like 'settings/services'
	 * @param callback
	 *            function(settings, object), returns settings, just like for
	 *            Array.reduce method
	 */
	"getSettingsByDescriptors" : {
		value : function(path, callback) {
			var cacheKey;
			var folder;
			if('string' === typeof path){
				cacheKey = path;
				folder = vfs.getCreateRelativeTreeFolder(vfs.ROOT, vfs.UNION, path);
			}else{
				folder = path;
				cacheKey = vfs.getAbsolutePath(folder);
			}
			
			if(!folder?.isContainer()){
				/** an empty settings */
				return {};
			}
			
			var cache = callback.cache ||= {};
			var cached = cache[cacheKey];
			if(cached?.callback === callback) {
				const age = Date.now() - cached.timestamp;
				if(age < 6000) {
					if(age > 4000) {
						// TODO: maybe it is the wrong way, but I don't want heaps of those to be
						// queued for same folder simultaneously while being slow.
						cached.timestamp += age;
						setTimeout(internCheckReload.bind(null, cacheKey, folder, callback, cache, cached), 0);
					}
					return cached.settings;
				}
			}

			var array = folder.getContentCollection(null).filter(filterDescriptors);
			var checkSum = array.reduce(reduceCheckSum, "");
			if (cached?.checkSum === checkSum) {
				cached.timestamp = Date.now();
				return cached.settings;
			}

			var settings = {};

			cached = {
				timestamp : Date.now(),
				checkSum : checkSum,
				callback : callback,
				settings : settings
			};

			settings = array.map(parseDescriptor).reduce(callback, settings);
			if (settings != cached.settings) {
				throw "Settings are replaced by callback!";
			}
			cache[cacheKey] = cached;
			return settings;
		}
	},
	"SettingsBuilder" : {
		value : require("java.class/ru.myx.ae3.util.settings.SettingsBuilder")
	}
});