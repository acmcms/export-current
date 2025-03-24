/**
 * ******************************************************************************
 * ******************************************************************************
 * Tracker.
 * ******************************************************************************
 * ******************************************************************************
 */




var vfs = require("ae3/vfs");
var Xml = require("ae3.util/Xml");




/**
 * ******************************************************************************
 * ******************************************************************************
 * Track Object.
 * ******************************************************************************
 * ******************************************************************************
 */
/**
 * constructor
 */
function TrackObject(vfsFile, key, date, command, properties, byUser, byAddress, byGeo){
	Object.defineProperty(this, "vfs", {
		value : vfsFile,
		writable : true,
		configurable : true
	});
	if(!key){
		var binary = vfsFile.binaryContent;
		var base = Xml.toMap("FILE-2-TRACK", binary, null, null, this, null, null);
		if(base !== this){
			throw "WTF?";
		}
		this.key = vfsFile.key.replace('.track.xml', '');
	}else{
		this.key = key;
		this.date = date;
		this.command = command;
		this.properties = properties;
		this.byUser = byUser;
		this.byAddress = byAddress;
		this.byGeo = byGeo;
	}
	return this;
}


/**
 * ******************************************************************************
 * ******************************************************************************
 * instance methods
 * ******************************************************************************
 * ******************************************************************************
 */


Object.defineProperties(TrackObject.prototype, {
	"toString" : {
		value : function(){
			return "[object Track{" +
				"date:" + Format.jsObject(this.date) + ", " +
				"command:" + Format.jsObject(this.command) + ", " +
				"byUser:" + Format.jsObject(this.byUser) +
			"}]";
		}
	}
});


TrackObject.keys = [ //
	 'key', //
	 'date', //
	 'command', //
	 'properties', //
	 'byUser', //
	 'byAddress', //
	 'byGeo' //
];



/**
 * END OF TrackObject
 */

















/**
 * ******************************************************************************
 * ******************************************************************************
 * Group Tracker Object.
 * ******************************************************************************
 * ******************************************************************************
 */
/**
 * constructor
 */
function GroupTracker(parentTracker, vfsGroup, prefix){
	if(!vfsGroup || !vfsGroup.isExist()){
		throw "vfs folder is required for data storage!";
	}
	this.parent = parentTracker;
	this.vfsGroup = vfsGroup;
	this.prefix = prefix || '';
}

function groupGetActivityRecord(key){
	var vfsReference = this.vfsGroup.relativeFile(".track/" + key + ".track");
	return vfsReference.isExist() ? this.parent.getActivityRecord(key) : null;
}



function groupRecentActivity(vfsSubject){
	/**
	 * for an object, references
	 */
	if(vfsSubject) {
		var vfsTrackReference = vfsSubject.relativeFolder(".track");
		var contents = vfsTrackReference.isContainer() && vfsTrackReference.getContentCollection(null);
		contents ||= [];
		contents.sort(internSortByDate);
		contents = contents.map(internMapReferenceToTrack, this.parent);
		return contents;
	}
	{
		var vfsTrackReference = this.vfsGroup.relativeFolder(".track");
		var contents = vfsTrackReference.isContainer() && vfsTrackReference.getContentCollection(null);
		contents ||= [];
		contents.sort(internSortByDate);
		contents = contents.map(internMapReferenceToTrack, this.parent);
		return contents;
	}
}



function groupCleanCallback(vfsTrackReference){
	var key = vfsTrackReference.primitiveValue;
	if(!key){
		throw new Error("WTF?!");
	}

	var vfsReference = this.vfsGroup.relativeFile(".track/" + key + ".track");
	if(vfsReference.isExist()){
		vfsTrackReference.doUnlink();
	}else{
		vfsReference = vfsTrackReference;
	}
	this.parent.clean.protectedCleanCallback.call(this.parent, vfsReference);
}



function groupClean(vfsSubject, command, properties, byUser, byAddress, byGeo){
	if(!vfsSubject || !vfsSubject.doSetBinary){
		throw new Error("'vfsSubject' is required and must be a vfs entry instance");
	}
	const vfsSubjectTrack = vfsSubject.relativeFolder(".track");
	if(!vfsSubjectTrack.isContainer()){
		// no [valid] track
		return true;
	}
	var txn = vfs.createTransaction();
	try{
		var contents = vfsSubjectTrack.getContentCollection(null);
		contents ||= [];
		// contents.sort(internSortByDate);
		contents.forEach(groupCleanCallback, this);
		vfsSubjectTrack.doUnlink();
		
		var result = command 
			? this.track(null, command, properties, byUser, byAddress, byGeo)
			: null;
		
		(txn.commit(), txn = null);
		
		return result;
	}finally{
		txn?.cancel();
	}
}

groupClean.protectedCleanCallback = groupCleanCallback;



function groupTrackRoot(key, date, command, properties, byUser, byAddress, byGeo){
	var txn = vfs.createTransaction();
	try{
		var vfsReference = this.vfsGroup.relativeFile(".track/" + key + ".track");
		/**
		 * replay?
		 */
		if(vfsReference.isExist()){
			if(vfsReference.primitiveValue != key){
				throw "'key' mismatch ("+vfsReference.primitiveValue+" != " + key + ")";
			}
		}else{
			vfsReference.doSetPrimitive(key);
		}
	
		var result = this.parent.track.protectedTrackRoot.call(this.parent, key, date, this.prefix + command, properties, byUser, byAddress, byGeo);
		
		(txn.commit(), txn = null);
		
		return result;
	}finally{
		txn?.cancel();
	}
}

function groupTrack(vfsSubject, command, properties, byUser, byAddress, byGeo){
	var date = new Date();
	var key = Format.utcDate(date, 'yyyyMMdd-HHmmss');
	if(lastDate == key){
		key += pad(lastCode++);
	}else{
		lastDate = key;
		lastCode = 1;
		key += pad(0);
	}

	var txn = vfs.createTransaction();
	try{
		if(vfsSubject){
			if(!vfsSubject.doSetBinary){
				throw new Error("'vfsSubject' is required and must be a vfs entry instance");
			}
			var vfsReference = vfsSubject.relativeFile(".track/" + key + ".track");
			/**
			 * replay?
			 */
			if(vfsReference.isExist()){
				if(vfsReference.primitiveValue != key){
					throw "'key' mismatch ("+vfsReference.primitiveValue+" != " + key + ")";
				}
			}else{
				vfsReference.doSetPrimitive(key);
			}
		}
	
		var result = groupTrackRoot.call(this, key, date, command, properties, byUser, byAddress, byGeo);
		
		(txn.commit(), txn = null);
		
		return result;
	}finally{
		txn?.cancel();
	}
}

groupTrack.protectedTrackRoot = groupTrackRoot;



GroupTracker.prototype = {
	track : groupTrack,
	clean : groupClean,
	
	createGroup : createGroupTracker,
	
	getActivityRecord : groupGetActivityRecord,
	recentActivity : groupRecentActivity,
};
/**
 * END OF GroupTracker
 */



















// static
var lastDate;
// static
var lastCode = 0;


function TrackerVfs(vfsTrackerJournalRoot) {
	if(!vfsTrackerJournalRoot || !vfsTrackerJournalRoot.isExist()){
		throw "vfs folder is required for data storage!";
	}
	this.vfsJournal = vfsTrackerJournalRoot;
	this.vfsGroup = null;
	return this;
}





var commands = {
	help : {
		args : "",
		help : "display this help",
		run : function runHelp(args, auth, options) {
			var s = "command syntax:\n";
			for(var k in commands){
				s += "\t\t " + k + " " + commands[k].args + "\n\t\t\t " + commands[k].help + "\n";
			}
			console.sendMessage(s);
			return true;
		}
	},
};





function trackConsoleCommand() {
	var args = arguments;
	if(args.length < 2){
		return console.fail("invalid syntax, use 'help' for help.");
	}

	// clone/create a normal Array
	args = Array.prototype.slice.call(args);

	/* var selfName = */ args.shift();

	for(var options = {};;) {
		var commandName = args.shift();
		if (commandName.startsWith("--")) {
			options[commandName.substr(2)] = true;
			continue;
		}
		var command = commands[commandName];
		if (!command) {
			return console.fail("unsupported command: %s", commandName);
		}

		return command.run(args, this, options);
	}
}






const PADDING = "-00000";
const PADDING_LENGTH = +PADDING.length;

function pad(x){
	x = String(x);
	return PADDING.substr(0, PADDING_LENGTH - x.length) + x;
	
	/** DEAD, that is more generic ^^^
	if(x < 10){
		return '-0000' + x;
	}
	if(x < 100){
		return '-000' + x;
	}
	if(x < 1000){
		return '-00' + x;
	}
	if(x < 10000){
		return '-0' + x;
	}
	return '-' + x;
	*/
}


function trackCleanCallback(vfsTrackReference){
	var key = vfsTrackReference.primitiveValue;
	if(!key){
		throw new Error("WTF?!");
	}
	vfsTrackReference.doUnlink();

	var vfsTrackFile = this.vfsJournal.relativeFile(key + ".track.xml");
	if(vfsTrackFile.isExist()){
		vfsTrackFile.doUnlink();
	}
}



function trackClean(vfsSubject, command, properties, byUser, byAddress, byGeo){
	if(!vfsSubject || !vfsSubject.doSetBinary){
		throw new Error("'vfsSubject' is required and must be a vfs entry instance");
	}
	const vfsSubjectTrack = vfsSubject.relativeFolder(".track");
	if(!vfsSubjectTrack.isContainer()){
		// no [valid] track
		return true;
	}
	var txn = vfs.createTransaction();
	try{
		var contents = vfsSubjectTrack.getContentCollection(null);
		contents ||= [];
		// contents.sort(internSortByDate);
		contents.forEach(trackCleanCallback, this);
		vfsSubjectTrack.doUnlink();
		
		var result = command 
			? this.track(null, command, properties, byUser, byAddress, byGeo)
			: null;
		
		(txn.commit(), txn = null);
		
		return result;
	}finally{
		txn?.cancel();
	}
}

trackClean.protectedCleanCallback = trackCleanCallback;

function trackTrackRoot(key, date, command, properties, byUser, byAddress, byGeo){
	var vfsTrackFile = this.vfsJournal.relativeFile(key + ".track.xml");
	
	var body = Xml.toXmlBinary("track", {
		key : key,
		date : date,
		command : command,
		properties : properties,
		byUser : byUser.userId || byUser.id || byUser,
		asUser : byUser.id || byUser,
		byAddress : byAddress,
		byGeo : byGeo,
	}, true, null, null, 0);

	/**
	 * replay?
	 */
	if(vfsTrackFile.isExist() && vfsTrackFile.isFile()){
		if(vfsTrackFile.binaryContent != body){
			throw "Track content mismatch!";
		}
		return new TrackObject(vfsTrackFile);
	}

	vfsTrackFile.doSetBinary(body);

	return new TrackObject(vfsTrackFile, key, date, command, properties, byUser, byAddress, byGeo);
}

function trackTrack(vfsSubject, command, properties, byUser, byAddress, byGeo){
	var date = new Date();
	var key = Format.utcDate(date, 'yyyyMMdd-HHmmss');
	if(lastDate == key){
		key += pad(lastCode++);
	}else{
		lastDate = key;
		lastCode = 1;
		key += pad(0);
	}

	var txn = vfs.createTransaction();
	try{
		if(vfsSubject){
			if(!vfsSubject.doSetBinary){
				throw new Error("'vfsSubject' is required to be a vfs entry instance");
			}
			var vfsReference = vfsSubject.relativeFile(".track/" + key + ".track");
			/**
			 * replay?
			 */
			if(vfsReference.isExist()){
				if(vfsReference.primitiveValue != key){
					throw "'key' mismatch ("+vfsReference.primitiveValue+" != " + key + ")";
				}
			}else{
				vfsReference.doSetPrimitive(key);
			}
		}
	
		return trackTrackRoot.call(this, key, date, command, properties, byUser, byAddress, byGeo);
	}catch(e){
		txn && (txn.cancel(), txn = null);
		throw e;
	}finally{
		txn?.commit();
	}
}

trackTrack.protectedTrackRoot = trackTrackRoot;






function internReducePropertyMap(properties, vfsProperty/* , i, a */){
	properties[vfsProperty.key] = vfsProperty.primitiveValue;
	return properties;
}

/**
 * internal, converts a VFS folder to Track object.
 * 
 * @param vfsFolder
 * @returns map
 */
function internMapFileToTrack(vfsTrackFile/* , i, a */) {
	return new TrackObject(vfsTrackFile);
}
TrackObject.mapFileToObject = internMapFileToTrack;


/**
 * DESCENDING
 * 
 * @param o1
 * @param o2
 * @returns {Number}
 */
function internSortByDate(o1, o2){
	if(o1.key < o2.key){
		return +1;
	}
	if(o1.key == o2.key){
		return 0;
	}
	return -1;
}

/**
 * vfsJournal root is passed as 'this'
 * 
 * @param vfsTrackReference
 * @returns
 */
function internMapReferenceToTrack(vfsTrackReference){
	var key = vfsTrackReference.key + '.xml';
	/**
	 * this is vfsJournal!
	 */
	var vfsTrackFile = (this.vfsJournal || this).relativeFile(key);
	return new TrackObject(vfsTrackFile);
}








function createGroupTracker(vfsGroup, prefix){
	return new GroupTracker(this, vfsGroup, prefix);
}


Object.defineProperties(TrackerVfs.prototype, {
	"consoleCommand" : {
		value : trackConsoleCommand
	},
	
	"track" : {
		value : trackTrack
	},
	"clean" : {
		value : trackClean
	},
	
	"createGroup" : {
		value : createGroupTracker
	},
	
	"getActivityRecord" : {
		value : function(key){
			var vfsTrackFile = this.vfsJournal.relativeFile(key + ".track.xml");
			return vfsTrackFile.isExist() ? new TrackObject(vfsTrackFile) : null;
		}
	},
	"recentActivity" : {
		value : function(vfsSubject){
			/**
			 * for an object references
			 */
			if(vfsSubject) {
				var vfsTrackReference = vfsSubject.relativeFolder(".track");
				var contents = vfsTrackReference.isExist() && vfsTrackReference.isContainer() && vfsTrackReference.getContentCollection(null);
				contents ||= [];
				contents.sort(internSortByDate);
				contents = contents.map(internMapReferenceToTrack, this);
				return contents;
			}
			{
				var contents = this.vfsJournal.isContainer() && this.vfsJournal.getContentCollection(null);
				contents ||= [];
				contents.sort(internSortByDate);
				contents = contents.map(internMapFileToTrack);
				return contents;
			}
		}
	},
});

Object.defineProperties(TrackerVfs, {
	"trackerEntryName" : { 
		value : '.track' 
	},
	/**
	 * same as constructor
	 */
	"createTracker" : {
		value : function(vfsTrackerJournalRoot){
			return new TrackerVfs(vfsTrackerJournalRoot);
		}
	}
});

module.exports = TrackerVfs;