const ae3 = require("ae3");
const vfs = ae3.vfs;

const QueryStringParseFn = require("querystring").parse;
const QueryStringStringifyFn = require("querystring").stringify;

const EventIdentifier = require("java.class/ru.myx.ae3.report.EventIdentifier");

const RecentEventTracker = module.exports = ae3.Class.create(
	/* name */
	"RecentEventTracker",
	/* inherit */
	undefined,
	/* constructor */
	function(typeName, storageType, vfsRoot, periodDays){
		this.name = typeName;
		this.type = storageType;
		this.vfs = vfsRoot;
		/**
		 * cut off (+12 hours to ease daily tides)
		 */
		this.periodMillis = ((periodDays || 7) * 24 + 12) * 60 * 60 * 1000;
		
		switch(storageType){
		case 'url':
			this.mat = RecentEventTracker.matURL.bind(this);
			this.ser = RecentEventTracker.serURL.bind(this);
			break;
		case 'jss':
			this.mat = RecentEventTracker.matJSS.bind(this);
			this.ser = RecentEventTracker.serJSS.bind(this);
			break;
		case 'map':
			this.mat = RecentEventTracker.matMAP.bind(this);
			this.ser = RecentEventTracker.serMAP.bind(this);
			break;
		case 'xml':
			this.mat = RecentEventTracker.matBIN.bind(this);
			this.ser = RecentEventTracker.serBIN.bind(this);
			break;
		case 'bin':
			this.mat = RecentEventTracker.matBIN.bind(this);
			this.ser = RecentEventTracker.serBIN.bind(this);
			break;
		default:
			throw new Error("Invalid or unknown event storage type: " + storageType);
		}
		// console.log("EventTrack:: create: %s, %s, %s, %s, oc=%s, oe=%s", this, this.vfs, this.mat, this.ser, this.onCreate, this.onExpire);
		return this;
	},
	/* instance */
	{
		"EventObject" : {
			value : require('./EventObject')
		},
		"toString" : { 
			value : function(){
				return "[object RecentEventTracker( name="+this.name+", type="+this.type+" )]";
			} 
		},
		
		//
		// typeName
		name : { value : null, writable : true },
		// icon
		icon : { value : 'database_table', writable : true },
		// storageType
		type : { value : null, writable : true },
		// vfsFolder
		vfs : { value : null, writable : true },
		// originId
		org : { value : -1, writable : true },
		//
		
		/**
		 * called while tracking before creating an entry, add/check event
		 * properties or create appropriate triggers overriding this method
		 */
		"onAccept" : { 
			value : function(date, data, relatedObject){ 
				return data; 
			} 
		},
		/**
		 * called while tracking after creating an entry, create appropriate
		 * triggers overriding this method
		 */
		"onCreate" : { 
			value : function(entry, relatedObject){ 
				return true; 
			} 
		},
		/**
		 * called while cleaning before deleting an entry, create appropriate
		 * triggers overriding this method
		 */
		"onExpire" : { 
			value : function(eid, entry){ 
				return true; 
			} 
		},
		/**
		 * Not really used, cause all cases we have operate on objects that to not
		 * need to be deleted.... Maybe I need to make a special temporal license to
		 * create/test/drop checks?
		 */
		"onRemove" : { 
			value : function(relatedObject){ 
				return true; 
			} 
		},
		
		"doCheckCleanup" : { 
			value : function(){
				var cutOff = new Date();
				cutOff.setTime(cutOff.getTime() - this.periodMillis);
				var contents, content, eid;
				if(false){
					for(;;){
						var lowest = cutOff.toISOString() + ';000000---';
						contents = this.vfs.getContentRange('0000-00-00T00:00:00.000Z;000000---', lowest, 250, false, null);
						if(!contents?.length){
							/**
							 * all done
							 */
							break;
						}
						for(content of contents){
							eid = EventIdentifier.parseKeyString(content.key);
							if(eid){
								console.log("EventTrack:: expire: type: %s, folder: %s, key: %s", this.name, this.vfs.key, content.key);
								if(this.onExpire(eid, content)){
									!!content.doUnlink();
								}
							}else{
								console.log("EventTrack:: invalid: type: %s, folder: %s, key: %s", this.name, this.vfs.key, content.key);
							}
						}
					}
				}
				for(;;){
					contents = this.vfs.getContentRange(EventIdentifier.KEY_LOWEST_2015, EventIdentifier.keyLowest(cutOff).keyString2015, 250, false, null);
					if(!contents?.length){
						/**
						 * all done
						 */
						break;
					}
					try{
						for(content of contents){
							eid = EventIdentifier.parseKeyString(content.key);
							if(eid){
								console.log("EventTrack:: expire: type: %s, folder: %s, key: %s", this.name, this.vfs.key, content.key);
								if(this.onExpire(eid, content)){
									!!content.doUnlink();
								}
							}else{
								console.log("EventTrack:: invalid: type: %s, folder: %s, key: %s", this.name, this.vfs.key, content.key);
							}
						}
					}catch(e){
						if(eid != EventIdentifier.parseKeyString(content.key)){
							throw e;
						}
						console.error(
							"EventTrack:: exception checking, deleting: type: %s, folder: %s, key: %s, error: %s", 
							this.name, 
							this.vfs.key, 
							content.key, 
							e?.message ? Format.throwableAsPlainText(e) : e
						);
						!!content.doUnlink();
					}
				}
			}
		},
		/**
		 * actual event happened. do everything (log, track, export, notify, trigger...)
		 */
		"eventEmit" : { 
			value : function(relatedObject, value){
				const eid = EventIdentifier.next(this.org);
				
				// assignment in condition
				if(!(value = this.onAccept(eid.date, value, relatedObject))){
					return value;
				}
				
				
				/**
				 * value becomes an entry (serialized form)
				 */
				value = this.ser(eid.keyString2015, value);
				return value && this.onCreate(value, relatedObject);
			} 
		},
		/**
		 * event is adopted by demo-replay (track + replay)
		 */
		"eventAdopt" : {
			/**
			 * eid - EventIdentifier
			 */
			value : function(eid, relatedObject, value){
			}
		},
		/**
		 * event is replayed/adopted or called during initial init
		 */
		"eventTrack" : {
			/**
			 * eid - EventIdentifier
			 */
			value : function(eid, relatedObject, value){
			}
		},
		/**
		 * event is replayed/adopted or called during initial init
		 */
		"eventReplay" : {
			/**
			 * eid - EventIdentifier
			 */
			value : function(eid, relatedObject, value){
			}
		},
		/**
		 * event is imported from cluster notification log
		 */
		"eventImport" : {
			/**
			 * eid - EventIdentifier
			 */
			value : function(eid, relatedObject, value){
			}
		},
		/**
		 * event is exported to cluster notification log
		 */
		"eventExport" : {
			/**
			 * eid - EventIdentifier
			 */
			value : function(eid, relatedObject, value){
			}
		},
		"getExportStream" : { 
			value : function(start, limit, backwards){
				return (this.getExportStreamEntries(start, limit, backwards) || []).map(this.materializeEntry, this);
			} 
		},
		"getExportStreamEntries" : { 
			value : function(start, limit, backwards){
				if(start.length === "20140729T110014954Z-000000---".length && start[19] === '-'){
					return this.vfs.getContentRange(
							start, 
							backwards ? EventIdentifier.KEY_LOWEST_2015 : EventIdentifier.KEY_HIGHEST_2015, 
								limit, 
								backwards, 
								null
					);
				}
				/** Code for transitional format support<code>
				if(start.length === "2014-07-29T11:00:14.954Z;000000---".length && start[24] === ';'){
					var date = new Date(start.substring(0, 24));
					var contents = [].concat(
						this.vfs.getContentRange(
							start, 
							backwards 
								? '0000-00-00T00:00:00.000Z;000000---' 
								: '9999-99-99T99:99:99.999Z;ZZZZZZ---', 
							limit, 
							backwards, 
							null
						), 
						this.vfs.getContentRange(
							date.toISOString() + ";0000000", 
							backwards 
								? '0000-00-00T00:00:00.000Z;0000000' 
								: '9999-99-99T99:99:99.999Z;ZZZZZZZ', 
							limit, 
							backwards, 
							null
						), 
						this.vfs.getContentRange(
							EventIdentifier.keyStart(date, backwards).keyString2015, 
							backwards ? EventIdentifier.KEY_LOWEST_2015 : EventIdentifier.KEY_HIGHEST_2015, 
							limit, 
							backwards, 
							null
						) 
					);
					contents.sort(backwards ? sortKeyDateDesc : sortKeyDateAsc);
					// contents.sort(backwards ? vfs.SORTER_KEY_DESC : vfs.SORTER_KEY_ASC);
					contents.length > limit && contents.splice(limit, contents.length - limit);
					return contents;
				}
				if(start.length === "2014-07-29T11:00:14.954Z;0000000".length && start[24] === ';'){
					var date = new Date(start.substring(0, 24));
					var contents = [].concat(
						this.vfs.getContentRange(
							date.toISOString() + ";000000---", 
							backwards 
								? '0000-00-00T00:00:00.000Z;000000---' 
								: '9999-99-99T99:99:99.999Z;ZZZZZZ---', 
							limit, 
							backwards, 
							null
						), 
						this.vfs.getContentRange(
							start, 
							backwards 
								? '0000-00-00T00:00:00.000Z;0000000' 
								: '9999-99-99T99:99:99.999Z;ZZZZZZZ', 
							limit, 
							backwards, 
							null
						), 
						this.vfs.getContentRange(
							EventIdentifier.keyStart(date, backwards).keyString2015, 
							backwards ? EventIdentifier.KEY_LOWEST_2015 : EventIdentifier.KEY_HIGHEST_2015, 
							limit, 
							backwards, 
							null
						) 
					);
					contents.sort(backwards ? sortKeyDateDesc : sortKeyDateAsc);
					// contents.sort(backwards ? vfs.SORTER_KEY_DESC : vfs.SORTER_KEY_ASC);
					contents.length > limit && contents.splice(limit, contents.length - limit);
					return contents;
				}
				</code>*/
				{
					var date;
					try{
						date = new Date(start);
					}catch(e){
						//
					}
					if(date === undefined){
						throw new Error("Unknown key format variant: " + start);
					}
					
					return this.vfs.getContentRange(
							EventIdentifier.keyStart(date, backwards).keyString2015, 
							backwards ? EventIdentifier.KEY_LOWEST_2015 : EventIdentifier.KEY_HIGHEST_2015, 
								limit, 
								backwards, 
								null
					); 
					
					/** Example support for transitional state with several timestamp versions:<code>
					var contents = [].concat(
						this.vfs.getContentRange(
							date.toISOString() + ";000000---", 
							backwards 
								? '0000-00-00T00:00:00.000Z;000000---' 
								: '9999-99-99T99:99:99.999Z;ZZZZZZ---', 
							limit, 
							backwards, 
							null
						), 
						this.vfs.getContentRange(
								date.toISOString() + ";0000000", 
							backwards 
								? '0000-00-00T00:00:00.000Z;0000000' 
								: '9999-99-99T99:99:99.999Z;ZZZZZZZ', 
							limit, 
							backwards, 
							null
						), 
						this.vfs.getContentRange(
							EventIdentifier.keyStart(date, backwards).keyString2015, 
							backwards ? EventIdentifier.KEY_LOWEST_2015 : EventIdentifier.KEY_HIGHEST_2015, 
							limit, 
							backwards, 
							null
						) 
					);
					contents.sort(backwards ? sortKeyDateDesc : sortKeyDateAsc);
					// contents.sort(backwards ? vfs.SORTER_KEY_DESC : vfs.SORTER_KEY_ASC);
					contents.length > limit && contents.splice(limit, contents.length - limit);
					return contents;
					</code>
					 */
				}
			} 
		},
		"getRelatedEvents" : { 
			value : function(relatedObject, eventTypeNames, limit){
				if(!relatedObject?.vfs?.isContainer){
					throw new Error("Invalid relatedObject: " + Format.jsDescribe(relatedObject));
				}
				const folder = relatedObject.trackVfs || (
						relatedObject.trackVfs = relatedObject.relativeFolder("recent")
				);
				if(!folder.isContainer()){
					return [];
				}
				return folder.getContentsCollection(null)?.map(internMapRecent, this);
			} 
		},
		"getActivityEvent" : { 
			value : function(eventId){
				var entry = this.vfs.relative(eventId, null);
				// var entry = this.vfs.getContentElement(eventId, null);
				if(!entry?.isExist()){
					return undefined;
				}
				return this.materializeEntry(entry);
			} 
		},
		"materializeEntry" : { 
			value : function(entry){
				const key = entry.key;
				const eid = EventIdentifier.parseKeyString(key);
				if(!eid){
					return undefined;
				}
				
				return {
					id	 : key,
					date : eid.date,
					type : this,
					data : this.mat(entry)
				};
			} 
		},
	},
	/* static */
	{
		"getMergedExportStream" : { 
			value : function(trackers, start, limit, backwards){
				var streams = [];
				var tracker;
				for(tracker of trackers){
					streams.push(tracker.getExportStreamEntries(start, limit, backwards) || []);
				}
				var array = Array.prototype.concat.apply([], streams);
				
				array.sort(backwards ? sortKeyDateDesc : sortKeyDateAsc);
				
				array.length > limit && array.splice(limit, array.length - limit);
				
				array = array.map(function map(x, t){
					for(t of this){
						if(t.vfs === x.parent){
							return t.materializeEntry(x);
						}
					}
					throw new Error("Invalid entry: parent: " + x.parent + ", trackers: " + this);
				}, trackers);
				return array;
			} 
		},
		"matURL" : {
			/**
			 * 
			 * @param typeName
			 * @param storageType
			 * @param vfsRoot
			 * @returns {@G}
			 */
			value : function matURL(entry){
				return QueryStringParseFn(entry.textContent);
			}
		},
		"serURL" : {
			value : function serURL(key, map){
				const file = this.vfs.relativeFile(key);
				if(!file.doSetValue(QueryStringStringifyFn(map))){
					return null;
				}
				return file;
			}
		},
		"matJSS" : {
			value : function matJSS(entry){
				return JSON.parse(entry.textContent);
			}
		},
		"serJSS" : {
			value : function serJSS(key, map){
				const file = this.vfs.relativeFile(key);
				if(!file.doSetValue(Format.jsObject(map))){
					return null;
				}
				return file;
			}
		},
		"matMAP" : {
			value : function matMAP(entry){
				throw new Error();
				return this;
			}
		},
		"serMAP" : {
			value : function serMAP(key, map){
				throw new Error();
				return this;

				var file = this.vfs.relativeFolderEnsure(key);
				vfs.saveMap;
				file.doSetValue(Format.jsObject(map));
				return file;
			}
		},
		"matBIN" : {
			value : function matBIN(entry){
				throw new Error();
				return this;
			}
		},
		"serBIN" : {
			value : function serBIN(key, targetMap){
				throw new Error();
				return this;
			}
		}
	}
);






const sortKeyDateDesc = EventIdentifier.compareEntryKeysDateDesc || function sortKeyDateDesc(a1, a2){
	a1 = a1.key;
	a2 = a2.key;
	if(a1.length === a2.length){
		return a1 > a2 ? -1 : a1 < a2 ? 1 : 0;
	}
	a1 = EventIdentifier.parseKeyStringMillis(a1);
	a2 = EventIdentifier.parseKeyStringMillis(a2);
	return a1 > a2 ? -1 : a1 < a2 ? 1 : 0;
};

const sortKeyDateAsc = EventIdentifier.compareEntryKeysDateAsc || function sortKeyDateAsc(a1, a2){
	a1 = a1.key;
	a2 = a2.key;
	if(a1.length === a2.length){
		return a1 > a2 ? 1 : a1 < a2 ? -1 : 0;
	}
	a1 = EventIdentifier.parseKeyStringMillis(a1);
	a2 = EventIdentifier.parseKeyStringMillis(a2);
	return a1 > a2 ? 1 : a1 < a2 ? -1 : 0;
};

/**
 * 
 * key: '$date;$sequence'
 * 
 * value: folder or file in JSON compatible format
 * 
 * @param e
 * @returns {EventObject}
 */
function internMapLogged(e){
	const eid = EventIdentifier.parseKeyString(e.key);
	if(!eid){
		return undefined;
	}
	
	var entry, data;
	if(e.isContainer()){
		data = {};
		for(entry of e.getContentCollection(null)){
			switch(entry.key){
			case 's':
				data.s = entry.value;
				break;
			case 'u':
				data.u = entry.value;
				break;
			default:
				data[entry.key] = JSON.parse(entry.toCharacter().textContent);
			}
		}
	}else{
		data = JSON.parse(e.toCharacter().textContent);
	}
	
	return new this.EventObject(eid.date, this.name, this.icon, data, null /* relId */);
}

/**
 * 
 * key: '$date;$sequence;$eventType'
 * 
 * value: folder or file in JSON compatible format
 * 
 * @param e
 * @returns {EventObject}
 */
function internMapRecent(e){
	const eid = EventIdentifier.parseKeyString(e.key);
	if(!eid){
		return undefined;
	}
	
	var entry, data;
	if(e.isContainer()){
		data = {};
		for(entry of e.getContentCollection(null)){
			switch(entry.key){
			case 's':
				data.s = entry.value;
				break;
			case 'u':
				data.u = entry.value;
				break;
			default:
				data[entry.key] = JSON.parse(entry.toCharacter().textContent);
			}
		}
	}else{
		data = JSON.parse(e.toCharacter().textContent);
	}
	
	return new this.EventObject(eid.date, this.name, this.icon, data, null /* relId */);
}
