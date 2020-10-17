const ae3 = require("ae3");
const vfs = ae3.vfs;
const Concurrent = ae3.Concurrent;
const RecentEventTracker = require('./RecentEventTracker');


const RecentEventTrackerRegistry = module.exports = ae3.Class.create(
	/* name */
	"RecentEventTrackerRegistry",
	/* inherit */
	undefined,
	/* constructor */
	function(){
		this.allTrackers = {};
		this.arrTrackers = [];
		this.typeNames = [];
		return this;
	},
	/* instance */
	{
		"addTracker" : {
			value : Concurrent.wrapSync(function(eventTracker){
				var name = eventTracker.name;
				if(this.allTrackers[name]){
					throw new Error("Tracker with this name is already registered: " + eventTracker);
				}
				this.allTrackers[name] = eventTracker;
				this.arrTrackers.push(eventTracker);
				this.typeNames.push(name);
			})
		},
		"doCheckCleanup" : {
			value : function(){
				for(var tracker of this.allTrackers){
					try{
						tracker.doCheckCleanup();
					}catch(e){
						console && console.error("event tracker check failed: tracker: %s, error: %s", tracker, e);
					}
				}
			}
		},
		"testData" : {
			get : function(){
				var result = [], tracker, data;
				for(tracker of this.allTrackers){
					data = tracker.testData;
					if(data){
						result = result.concat(data);
					}
				}
				return result;
			}
		},
		"getExportStream" : {
			value : function(start, limit, backwards){
				return RecentEventTracker.getMergedExportStream(this.arrTrackers);
			}
		},
		"getRelatedEvents" : {
			value : function(relatedObject, eventTypeNames){
				const folder = relatedObject['.recent'] || (
					relatedObject['.recent'] = relatedObject.vfs.relativeFolder("recent")
				);
				if(!folder.isContainer()){
					return [];
				}
				const result = [];
				var entry, key, pos1, type;
				for(entry of folder.getContentCollection(null).sort(vfs.SORTER_KEY_DESC)){
					key = entry.key;
					pos1 = key.lastIndexOf(';');
					if(pos1 === -1){
						continue;
					}
					type = key.substr(pos1 + 1);
					if(eventTypeNames && !eventTypeNames.includes(type)){
						continue;
					}
					type = this.allTrackers[type];
					if(!type){
						continue;
					}
					result.push(type.materializeEntry(entry));
				}
				return result;
			}
		},
		"getActivityEvent" : {
			value : function(eventId){
				/**<code>
				var future = Concurrent.createFirstPositiveFutureTask();
				var result;
				for(var tracker of this.allTrackers){
					result = future.addTask(tracker.getActivityEvent.bind(tracker, eventId));
					if(result){
						return result;
					}
				}
				return future.complete();
				*/
				const tasks = [];
				var tracker;
				for(tracker of this.allTrackers){
					tasks.push(tracker.getActivityEvent.bind(tracker, eventId));
				}
				return Concurrent.firstPositive(tasks);
			}
		},
		"toString" : {
			value : function(){
				return "[object RecentEventTrackerRegistry( trackers="+Format.jsObject(this.allTrackers)+" )]";
			}
		},
	}
);
