/**
 *******************************************************************************
 *******************************************************************************
 * Stats Object.
 *******************************************************************************
 *******************************************************************************
 */

const vfs = require("ae3/vfs");


/**
 * constructor
 */
function StatsObject(key, date, data){
	this.id = key;
	this.date = date;
	this.data = data;
	return this;
}




Object.defineProperties(StatsObject.prototype, {
	"toString" : {
		value : function(){
			return "[object Stats" + Format.jsObject(this) + "]";
		}
	}
});



/**
 *******************************************************************************
 *******************************************************************************
 * static API
 *******************************************************************************
 *******************************************************************************
 */

StatsObject.keys = [
	'date', //
	'data' //
];

function keyDate(k){
	// "20140729T110014954Z-000000---".length === 29
	if((k.length === 29 || k.length > 29 && k[29] === ';') && k[19] === '-'){
		return new Date(k.substring(0, 19));
	}
	// "2014-07-29T11:00:14.954Z;000000---".length === 34
	if(k.length === 34 && k[24] === ';'){
		return new Date(k.substring(0, 24));
	}
	// "2014-07-29T11:00:14.954Z;0000000".length == 32
	if(k.length === 32 && k[24] === ';'){
		return new Date(k.substring(0, 24));
	}
	return undefined;
}

function internMapFileToStats(statsFile/* , i, a */) {
	const key = statsFile.key;
	const date = keyDate(key);
	if(!date){
		return undefined;
	}
	
	var map, entry, data;
	if(statsFile.isContainer()){
		data = {};
		for(entry of statsFile.getContentCollection(null)){
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
		data = JSON.parse(statsFile.toCharacter().textContent);
	}
	
	return new StatsObject(key, date, data);
}
StatsObject.mapFileToObject = internMapFileToStats;


StatsObject.PADDING = "000000---";

StatsObject.keyLowest = function(date){
	return (date 
		? Format.dateUTC(date, "yyyyMMdd'T'HHmmssSSS'Z-000000---'") 
		: '00000000T000000000Z-000000---'
	);
};

StatsObject.keyHighest = function(date){
	return (date 
		? Format.dateUTC(date, "yyyyMMdd'T'HHmmssSSS'Z-ZZZZZZzzz'") 
		: '99999999T999999999Z-ZZZZZZzzz'
	);
};


var lastDate;
var lastCode = 0;


function next(dateString){
	if(lastDate === dateString){
		dateString = '' + lastCode++;
		return "000000".substr(0, 6 - dateString.length) + dateString + '---';
	}
	lastDate = dateString;
	lastCode = 1;
	return "000000---";
}


StatsObject.validateOrCreateStartKey = function(start, backwards){
	/**
	 * TODO: add 'validate' part here
	 */
	if(start){
		start = '' + start;
		if(start[18] === 'Z' && start[8] === 'T'){
			if(start.length === 29 && start[19] === '-'){
				return start;
			}
			if(start.length === 19){
				return start + '-' + (backwards ? "ZZZZZZzzz" : "000000---");
			}
		}
		return Format.dateUTC(new Date(start), "yyyyMMdd'T'HHmmssSSS'Z'") + '-' + (backwards ? "ZZZZZZzzz" : "000000---");
	}
	return backwards ? '99999999T999999999Z-ZZZZZZzzz' : '00000000T000000000Z-000000---';
};

StatsObject.storeRaw = function storeRaw(vfsStats, date, cookie){
	const dateString = Format.dateUTC(date, "yyyyMMdd'T'HHmmssSSS'Z'");
	const key = dateString + '-' + next(dateString);
	
	vfsStats.setContentPublicTreeValue(key, cookie);

	return new StatsObject(key, date, cookie);
};


StatsObject.storeMap = function storeMap(vfsStats, date, map){
	const dateString = Format.dateUTC(date, "yyyyMMdd'T'HHmmssSSS'Z'");
	const key = dateString + '-' + next(dateString);
	
	const folder = vfsStats.relativeFolderEnsure(key);
	
	for keys(key in map){
		folder.setContentPublicTreeValue(key, map[key]);
	}
	
	return new StatsObject(key, date, map);
};


StatsObject.storeCreateFolder = function storeCreateFolder(vfsStats, date){
	const dateString = Format.dateUTC(date, "yyyyMMdd'T'HHmmssSSS'Z'");
	const key = dateString + '-' + next(dateString);
	return vfsStats.relativeFolderEnsure(key);
};

/**
 *******************************************************************************
 *******************************************************************************
 * module interface is our constructor
 *******************************************************************************
 *******************************************************************************
 */





module.exports = StatsObject;