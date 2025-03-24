// var s4 = require('ae3/s4');

const ae3 = require("ae3");
const vfs = ae3.vfs;
const net = ae3.net;

/**
 * vfs and major folders
 */
/**
 * TODO: change to 'private/storage/stats'
 */
const vfsDataRoot = vfs.ROOT.relativeFolderEnsure("storage/stats");
const vfsLogs = vfsDataRoot.relativeFolderEnsure("logs");


const StatsGroup = require('./StatsGroup');





const StatsService = Object.create(Object.prototype, {
	"Stats" : {
		value : null
	},
	"RuntimeStatsService" : {
		value : require("./RuntimeStatsServiceObject").create(vfsLogs)
	},
	"startService" : {
		value : function(checker){
			serviceChecker = checker;
			setTimeout(serviceLoop.bind(this), 1500);
			
			net.tcp.listen('127.0.0.1', 51, callbackTcpStatsHandler);
		}
	},
	"runPeriodicIdleTasks" : {
		value : function(){
			console.log("Stats::runPeriodicIdleTasks: start");
			this.RuntimeStatsService.doDatabaseCleanup();
		}
	},
	"getGroupDescriptors" : {
		value : require("ae3.util/Settings").SettingsBuilder.builderCachedLazy()//
			.setInputFolderPath("settings/system/stats")//
			.setDescriptorReducer(function(settings, description){
				if (description.type != "ae3.stats/Group") {
					return settings;
				}
				/**
				 * 'order of appearance'
				 */
				const name = description.name;
				/**
				 * actually name is mandatory
				 */
				if (!name) {
					return settings;
				}
	
				const groups = settings.groups ||= {};
				
				var group, extra;
				var groupName = description.group;
				if(groupName){
					group = groups[groupName];
					if(group){
						extra = group.descriptor 
							? group.descriptor.extra ||= {}
							: group.extra;
					}else{
						extra = {};
						// groups[group] = { descriptor : { extra : extra } };
						groups[groupName] = { extra : extra };
					}
					extra[name] = new StatsGroup(description);
					return settings;
				}
				{
					group = groups[name];
					if(!group){
						group = groups[name] = new StatsGroup(description);
					}else//
					// assignment
					if(extra = group.extra){
						description = Object.create(description);
						description.extra = extra;
						groups[name] = new StatsGroup(description);
					}
					return settings;
				}
			})//
			.buildGetter()
	},
	"getGroup" : {
		value : function getGroup(name){
			const group = (this.getGroupDescriptors().groups || {})[name.name || name];
			return group?.descriptor ? group : undefined;
		}
	},
	"getGroups" : {
		value : function(){
			const settings = this.getGroupDescriptors();
			var result = settings.groupList;
			if(result){
				return result;
			}
			result = [];
			var key, group, groups = settings.groups;
			for(key of Object.keys(groups)){
				group = groups[key];
				if(group?.descriptor){
					result.push(group);
				}
			}
			result.sort(function(x, y){
				return x.key > y.key ? 1 : x.key === y.key ? 0 : -1;
			});
			return settings.groupList = result;
		}
	},
	"toString" : {
		value : function(){
			return "[object StatsService]";
		}
	}
});




var serviceChecker = {};

function serviceLoop(){
	/** boolean argument is 'force' */
	this.RuntimeStatsService.serviceLoop(serviceChecker.Stats != this);
	/** re-schedule if still active */
	serviceChecker.Stats == this && setTimeout(serviceLoop.bind(this), 1500);
}




const makeTextStatsCached = ae3.Concurrent.wrapOnceWithExpiration(function(){
	console.log("Stats::makeTextStatsCached: tcp stats prepared.");
	var g, p, r, c;
	var x = ''; $output(x){
		for(g of StatsService.getGroups()){
			p = g.key;
			r = g.rawValues;

			for(c of r.columns){
				if(!c.evaluate && (c.chart || c.log || c.nameExport)){
					= p; = '.'; 
					= c.nameExport ?? c.name; = '.'; 
					= c.variant ?? c.type ?? 'unknown'; = '.'; 
					= c.chart ?? 'total'; = ': '; 
					= r.values[c.name]; = '\n';
				}
			}
			
			if(g.extra){
				for(g of g.extra){
					p = g.key;
					r = g.rawValues;

					for(c of r.columns){
						if(!c.evaluate && (c.chart || c.log || c.nameExport)){
							= p; = '.'; 
							= c.nameExport ?? c.name; = '.'; 
							= c.variant ?? c.type ?? 'unknown'; = '.'; 
							= c.chart ?? 'total'; = ': '; 
							= r.values[c.name]; = '\n';
						}
					}
				}
			}
		}
	}
	return x;
}, 7000);

function callbackTcpStatsHandler(s){
	// console.log("Stats::callbackTcpStatsHandler: tcp stats request.");
	// console.log("Stats::callbackTcpStatsHandler: tcp stats request: " + Format.jsDescribe(s));

	try{ 
		s.target.absorbBuffer(ae3.Transfer.createBufferUtf8(makeTextStatsCached()));
	}catch(e){
		s.target.absorbBuffer(ae3.Transfer.createBufferUtf8(Format.throwableAsPlainText(e)));
	}finally{
		s.close();
	}
}


module.exports = StatsService;
