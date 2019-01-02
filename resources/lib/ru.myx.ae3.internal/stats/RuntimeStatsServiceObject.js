/**
 *******************************************************************************
 *******************************************************************************
 * RuntimeStatsService Object.
 *******************************************************************************
 *******************************************************************************
 */

const vfs = require("ae3/vfs");
const StatsObject = require('./StatsObject');

/**
 * constructor
 */
function RuntimeStatsServiceObject(vfsLogs){
	Object.defineProperty(this, "vfs", { 
		value : vfsLogs 
	});
	{
		var upg = vfsLogs.relativeFolder("system"), entry, target;
		if(upg.isContainer()){
			for(entry of upg.getContentCollection(null)){
				if(entry.isFile()){
					target = vfsLogs.relativeFolder(entry.key);
					vfs.move(entry, target);
				}
			}
			upg.unlinkRecursive();
		}
	}
	this.started = new Date();
	this.committed = this.started;
	this.nextPlannedCommit = this.started.getTime() + 15 * 1000;
	return this;
}


/**
 *******************************************************************************
 *******************************************************************************
 * instance methods
 *******************************************************************************
 *******************************************************************************
 */

Object.defineProperties(RuntimeStatsServiceObject.prototype, {
	"RuntimeStatsServiceObject" : {
		value : RuntimeStatsServiceObject
	},
	"currentInterval" :{
		get : function(){
			if(this == RuntimeStatsServiceObject.prototype){
				throw TypeError("Invalid reference!");
			}
			return Date.now() - this.committed.getTime();
		}
	},
	"serviceLoop" : { 
		value : function(force){
			var date = new Date();
			var now = date.getTime();
			if(force || now > this.nextPlannedCommit){
				const groups = require('./Stats').getGroups();
				
				var folder, group, groupKey, groupValues, cookie;
				var txn = vfs.createTransaction();
				try{
					folder = StatsObject.storeCreateFolder(this.vfs, date);
					folder.setContentPublicTreeValue('s', (this.started.getTime() / 1000)|0);
					folder.setContentPublicTreeValue('u', ((this.committed.getTime() - this.started.getTime()) / 1000)|0);
					for(group of groups){
						groupKey = group.key;
						groupValues = PREV[groupKey] = group.readValues(PREV[groupKey] || (PREV[groupKey] = {}), 'log').values;
						cookie = JSON.stringify(groupValues);
						folder.setContentPublicTreeValue(groupKey, cookie);
					}
					
					(txn.commit(), txn = null);
				}finally{
					txn && txn.cancel();
				}

				this.committed = date;
				/**
				 * five minutes
				 */
				this.nextPlannedCommit = now + 5 * 60 * 1000;
			}
		}
	},
	"doDatabaseCleanup" : {
		value : function(){
			var cutOff = new Date();
			/**
			 * one week cut off (+12 hours to ease daily tides)
			 */
			cutOff.setTime(cutOff.getTime() - (7 * 24 + 12) * 60 * 60 * 1000);
			/**
			 * loop through stats folders
			 */
			var folder, contents, content;
			const start = StatsObject.keyLowest(cutOff);
			for(folder of [this.vfs]) {
				for(;;){
					contents = folder.getContentRange(null, start, 250, false, null);
					if(!contents || !contents.length){
						/**
						 * all done
						 */
						break;
					}
					console.log(">>>>>>> kl: " + start);
					for(content of contents){
						if(!content.doUnlink()){
							console.error(">>>>>>> error unlinking stats: %s", content.key);
						}
					}
				}
			}
			/** OLD STUFF */
			const startOld = cutOff.toISOString() + ';-00000000';
			for(folder of [this.vfs]) {
				for(;;){
					contents = folder.getContentRange("3333-12-31T23:59:59.999Z;-00000000", startOld, 250, false, null);
					if(!contents || !contents.length){
						/**
						 * all done
						 */
						break;
					}
					console.log(">>>>>>> kl: " + startOld);
					for(content of contents){
						if(!content.doUnlink()){
							console.error(">>>>>>> error unlinking stats: %s", content.key);
						}
					}
				}
			}
			/** ^^^^ delete later */
		}
	},
	"listRuntimeSystemStats" : { 
		value : function(start, limit, backwards){
			return this.vfs.getContentRange(start, null, limit, backwards, null).map(StatsObject.mapFileToObject);
		}
	},
	"validateOrCreateStartKey" : {
		value : StatsObject.validateOrCreateStartKey
	},
	"handleListRuntimeSystemStats" : {
		value : function rssHandleListRuntimeSystemStats(context, serviceName, pathPrefix, baseOnly){
			const query = context.query;
			const share = context.share;
			
			const title = (serviceName || share.serviceName || 'Unknown') + "::" + (pathPrefix || share.pathPrefix || "administration/") + 
				(baseOnly ? "runtimeMonitoringLog (System Monitoring)" : "runtimeStatsLog (Runtime System Stats)");
			
//			var serviceName = clientElementProperties && clientElementProperties.serviceName || 'ND*S';
//			var pathPrefix = clientElementProperties && clientElementProperties.pathPrefix || "administration/"
//			var title = serviceName + "::" + pathPrefix + "listRuntimeSystemStatsLog (Runtime System Stats)";

			const parameters = query.parameters;
			
			const filter = parameters.filter || undefined;
			
			var backwards = parameters.backwards === 'true';
			var limit = Number(parameters.limit || 100) || 100;
			var start = this.validateOrCreateStartKey(parameters.start, backwards);

			var rowCommands = [
				{
					title : 'Runtime Stats Report...',
					icon : 'zoom_in',
					prefix : 'runtimeStatsRecord?' + Format.queryStringParameters(parameters, {
						source : 'log'
					}) + '&id=',
					field : 'id'
				}
			];
			
			var rows = [];
			
			var layout = {
				name : baseOnly ? 'monitoringStats' : 'systemStats',
				layout : 'data-table',
				attributes : {
					cssId : 'list',
					title : title,
					server : require('os').hostname(),
				},
				filters : {
					fields : baseOnly ? TABLE_FILTER_BASE_FIELDS : TABLE_FILTER_FULL_FIELDS,
					values : {
						filter : filter,
						start : start,
						limit : limit,
						backwards : parameters.backwards || undefined
					}
				},
				columns : [
					{
						id : 'd',
						title : 'Date',
						type : 'date',
						variant : 'date'
					},
					{
						id : 'u',
						type : 'number',
						variant : 'period',
						scale : 1000,
						title : 'Σ Time',
						titleShort : 'Σ(t)',
					},
					{
						id : 'p',
						type : 'number',
						variant : 'period',
						scale : 1000,
						title : 'Δ Time',
						titleShort : 'Δ(t)',
					}
				],
				rowCommands : rowCommands,
				rows : rows
			};

			var groups = require('./Stats').getGroups();
			if(filter){
				groups = groups.filter(function(group){
					return group.hasKeyword(this);
				}, filter);
			}
			var group, groupPrefix, reading, columns, columnsByGroup = {};

			for(group of groups){
				columns = group.getColumns(filter);
				if(columns){
					columnsByGroup[group.key] = columns;
					groupPrefix = group.key + '-';
					for(reading of columns){
						(reading.log === 'normal' || (detail && reading.log)) && (layout.columns.push({
							id : groupPrefix + reading.name,
							type : reading.type,
							variant : reading.variant,
							titleShort : reading.titleShort,
							title : reading.title,
							chart : reading.chart,
							scale : reading.scale,
						}));
					}
				}
			}
			
			var stats = this.listRuntimeSystemStats(start, limit + 1, backwards);
			var next = stats && stats.length > limit && stats[limit].id;
			
			var detail = parameters.detail == 'true';

			if(next){
				layout.next = {
					uri : '?' + Format.queryStringParameters(parameters, {
						start : next
					})
				};
			}

			layout.base = query.url;

			
			var i, item, params, uptimeCommittedSecs, startedAtSecs, row;
			var readingKey, sensorData;
			for(
				i = 0, l = Math.min(limit, stats ? stats.length : 0); 
				i < l; 
				++i)
			{
				item = stats[i];
				////////////////////////
				params = item.data;
				
				// console.log(">>>>>>> params: " + Format.jsObjectReadable(params));
				
				uptimeCommittedSecs = Number(params.u || 0);
				startedAtSecs = Number(params.s || 0);
				
				row = {
					hl : 'false',
					id : item.id,
					d : item.date.toISOString(),
					u : (item.date.getTime() / 1000 - startedAtSecs)|0,
					p : (item.date.getTime() / 1000 - startedAtSecs - uptimeCommittedSecs)|0,
				};
				
				
				for(group of groups){
					groupPrefix = group.key;
					sensorData = params[groupPrefix];
					if(sensorData){
						for(reading of columnsByGroup[groupPrefix]){
							if(reading.log === 'normal' || (detail && reading.log)){
								readingKey = reading.name;
								row[groupPrefix + '-' + readingKey] = sensorData[readingKey];
							}
						}
					}
				}

				rows.push(row);
			}

			return layout;
		}
	},
	"toString" : {
		value : function(){
			return "[object RuntimeStatsServiceObject]";
		}
	}
});



/**
 * All previouses... Don't clean just yet.
 */
const PREV = {};



const TABLE_FILTER_BASE_FIELDS = [
	{
		id : 'start',
		name : 'start',
		title : 'Starting with',
		type : 'string',
	},
	{
		id : 'limit',
		name : 'limit',
		title : 'Limit (count)',
		type : 'number',
		variant : 'integer'
	},
	{
		id : 'backwards',
		name : 'backwards',
		title : 'Backwards',
		type : 'boolean',
	},
];


const TABLE_FILTER_FULL_FIELDS = [
	{
		id : 'filter',
		name : 'filter',
		title : 'Filter',
		type : 'string',
	}
].concat(TABLE_FILTER_BASE_FIELDS);


/**
 *******************************************************************************
 *******************************************************************************
 * static API
 *******************************************************************************
 *******************************************************************************
 */

Object.defineProperties(RuntimeStatsServiceObject, {
	"create" : {
		value : function(vfsLogs){
			return new RuntimeStatsServiceObject(vfsLogs);
		}
	},
	"keys" : {
		value : [ //
			 'started', // service start date
			 'committed', // last saved stats date
			 'currentInterval', // getter, milliseconds since last commit
		]
	},
	"toString" : {
		value : function(){
			return "[class RuntimeStatsServiceObject]";
		}
	}
});

/**
 *******************************************************************************
 *******************************************************************************
 * module interface is our constructor
 *******************************************************************************
 *******************************************************************************
 */
module.exports = RuntimeStatsServiceObject;