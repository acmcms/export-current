const UTIL_PROTOTYPE = Object.create(Object.prototype, {
	"Auth" : {
		get : function ae3UtilAuth(){
			const result = require('ae3.util/Auth');
			Object.defineProperty(this, "Auth", { value : result });
			return result;
		}
	},
	"AuthMap" : {
		get : function ae3UtilAuthMap(){
			const result = require('ae3.util/AuthMap');
			Object.defineProperty(this, "AuthMap", { value : result });
			return result;
		}
	},
	"AuthVfs" : {
		get : function ae3UtilAuthVfs(){
			const result = require('ae3.util/AuthVfs');
			Object.defineProperty(this, "AuthVfs", { value : result });
			return result;
		}
	},
	"Base" : {
		get : function ae3UtilBase(){
			const result = require('ae3.util/Base');
			Object.defineProperty(this, "Base", { value : result });
			return result;
		}
	},
	"Cache" : {
		get : function ae3UtilCache(){
			const result = require('ae3.util/Cache');
			Object.defineProperty(this, "Cache", { value : result });
			return result;
		}
	},
	"Codecs" : {
		get : function ae3UtilCodecs(){
			const result = require('ae3.util/Codecs');
			Object.defineProperty(this, "Codecs", { value : result });
			return result;
		}
	},
	"CollectConsole" : {
		get : function ae3UtilCollectConsole(){
			const result = require('ae3.util/CollectConsole');
			Object.defineProperty(this, "CollectConsole", { value : result });
			return result;
		}
	},
	"Counter" : {
		get : function ae3UtilCounter(){
			const result = require('ae3.util/Counter');
			Object.defineProperty(this, "Counter", { value : result });
			return result;
		}
	},
	"Dom" : {
		get : function ae3UtilDom(){
			const result = require('ae3.util/Dom');
			Object.defineProperty(this, "Dom", { value : result });
			return result;
		}
	},
	"HtmlChunkedConsole" : {
		get : function ae3UtilHtmlChunkedConsole(){
			const result = require('ae3.util/HtmlChunkedConsole');
			Object.defineProperty(this, "HtmlChunkedConsole", { value : result });
			return result;
		}
	},
	"Settings" : {
		get : function ae3UtilSettings(){
			const result = require('ae3.util/Settings');
			Object.defineProperty(this, "Settings", { value : result });
			return result;
		}
	},
	"Shell" : {
		get : function ae3UtilShell(){
			const result = require('ae3.util/Shell');
			Object.defineProperty(this, "Shell", { value : result });
			return result;
		}
	},
	"TrackerVfs" : {
		get : function ae3UtilTrackerVfs(){
			const result = require('ae3.util/TrackerVfs');
			Object.defineProperty(this, "TrackerVfs", { value : result });
			return result;
		}
	},
	"Queues" : {
		get : function ae3UtilQueues(){
			const result = require('ae3.util/Queues');
			Object.defineProperty(this, "Queues", { value : result });
			return result;
		}
	},
	"Xml" : {
		get : function ae3UtilXml(){
			const result = require('ae3.util/Xml');
			Object.defineProperty(this, "Xml", { value : result });
			return result;
		}
	},
	"HashMap" : {
		value : require('java.class/java.util.HashMap')
	},
	"TreeMap" : {
		value : require('java.class/java.util.TreeMap')
	},
	"HashSet" : {
		value : require('java.class/java.util.HashSet')
	},
	"TreeSet" : {
		value : require('java.class/java.util.TreeSet')
	},
});

module.exports = Object.create(UTIL_PROTOTYPE);