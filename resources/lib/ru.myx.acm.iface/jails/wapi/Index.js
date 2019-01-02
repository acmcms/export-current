var JailsAPI = require('ru.myx.acm.iface/jails/Jails');

module.exports = require('ae3.web/IndexPage').create({
	title : "ACM::jails/index (ACM Jails)", 
	commands : {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "ACM Jails",
		},
		"../":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		listJails : {
			title	: "All Jails",
			run		: [ require, './ListJails' ],
			ui		: true,
			access	: "admin"
		},
		"listJails?format=detail" : {
			title	: "All Jails (Detailed)",
			ui		: true,
			access	: "admin"
		},
		readJail : {
			title	: "Jail Detail",
			run		: [ require, './ReadJail' ],
			access	: "admin"
		},
		jailStorageObjectCounts : {
			title	: "Jail Storage Object Counts",
			run		: function handleJailStorageObjectCounts(context){
				const query = context.query;
				const jailName = query.parameters.id;
				if(!jailName){
					return JailsAPI.handleSelectJail(context);
				}
				const sql =	" SELECT " +
							"	(SELECT COUNT(*) FROM s3Aliases) as aliases, " +
							"	(SELECT COUNT(*) FROM s3Objects) as objects, " +
							"	(SELECT COUNT(*) FROM s3Tree) as links, " +
							"	(SELECT COUNT(*) FROM s3Extra) as extras, " +
							"	(SELECT COUNT(*) FROM s3Indices) as indices " +
							"	";
				return JailsAPI.executeQueryOnJail(
					query,
					"Object counts", 
					jailName, 
					sql,
					{
						aliases : "integer",
						objects : "integer",
						links : "integer",
						extras : "integer",
						indices : "integer"
					}
				);
			},
			access	: "admin"
		},
		jailStorageExtrasStats : {
			title	: "Jail Storage Extras Stats",
			run		: function handleJailStorageExtrasStats(context){
				const query = context.query;
				const jailName = query.parameters.id;
				if(!jailName){
					return JailsAPI.handleSelectJail(context);
				}
				var sql =	" SELECT " +
							"	recType, " +
							"	COUNT(*) as count, " +
							"	AVG(octet_length(recBlob)) as avg, " +
							"	SUM(octet_length(recBlob)) as total, " +
							"	MAX(recDate) as last, "+
							"	MIN(recDate) as first " +
						//	"	MIN(encode(substring(recBlob for 100),'escape')) as one "+
							" FROM s3Extra "+
							" GROUP BY 1 "+
							" ORDER BY 4 DESC ";
				return JailsAPI.executeQueryOnJail(
					query,
					"s3Extra stats",
					jailName, 
					sql,
					{ 
						count : 'integer', 
						avg : 'bytes', 
						total : 'bytes', 
						first : 'date', 
						last : 'date', 
					}
				);
			},
			access	: "admin"
		},
		jailStorageObjectsStats : {
			title	: "Jail Storage Objects Stats",
			run		: function handleJailStorageObjectsStats(context){
				const query = context.query;
				const jailName = query.parameters.id;
				if(!jailName){
					return JailsAPI.handleSelectJail(context);
				}
				var sql =	" SELECT " +
							"	objType as tp, " +
							"	COUNT(*) as count, " +
							"	MAX(objCreated) as last, "+
							"	MIN(objCreated) as first, " +
							"	round(AVG(extraStats.ct), 3) as aec, " +
							"	round(AVG(extraStats.sz), 3) as aes, " +
							"	SUM(extraStats.sz) as tes " +
						//	"	MIN(encode(substring(recBlob for 100),'escape')) as one "+
							" FROM s3Objects o " +
						//	" LEFT JOIN s3ExtraLink l USING(objId) " +
							" LEFT JOIN (" +
							"		SELECT objId, COUNT(*) as ct, SUM(octet_length(recBlob)) as sz " +
							"		FROM s3ExtraLink " +
							"		JOIN s3Extra USING(recId) " +
							"		GROUP BY objId" +
							" ) extraStats USING(objId)" +
							" GROUP BY 1 " +
							" ORDER BY 2 DESC ";
				return JailsAPI.executeQueryOnJail(
					query,
					"s3Objects stats", 
					jailName, 
					sql, 
					{ 
						tp : 'link', 
						count : 'integer', 
						first : 'date', 
						last : 'date', 
						aec : 'decimal', 
						aes : 'bytes', 
						tes : 'bytes' 
					}, 
					{ tp : 'jailStorageTypeStats?id=' + jailName + '&type=' }
				);
			},
			access	: "admin"
		},
		jailStorageTypeStats : {
			title	: "Jail Storage Type Stats",
			run		: function handleJailStorageTypesStats(context){
				const query = context.query;
				const jailName = query.parameters.id;
				if(!jailName){
					return JailsAPI.handleSelectJail(context);
				}
				var typeName = query.parameters.type;
				var sql =	" SELECT " +
							"	objType as tp, " +
							"	fldId as fld, " +
							"	COUNT(*) as count, " +
							"	round(AVG(extraStats.ct), 3) as aec, " +
							"	round(AVG(extraStats.sz), 3) as aes, " +
							"	SUM(extraStats.sz) as tes " +
						//	"	MIN(encode(substring(recBlob for 100),'escape')) as one "+
							" FROM s3Objects o " +
						//	" LEFT JOIN s3ExtraLink l USING(objId) " +
							" LEFT JOIN (" +
							"		SELECT objId, fldId, COUNT(*) as ct, SUM(octet_length(recBlob)) as sz " +
							"		FROM s3ExtraLink " +
							"		JOIN s3Extra USING(recId) " +
							"		GROUP BY 1, 2" +
							" ) extraStats USING(objId)" +
							" WHERE objType=" + Format.sqlString(typeName)+ 
							" GROUP BY 1, 2 " +
							" ORDER BY 3 DESC ";
				return JailsAPI.executeQueryOnJail(
					query,
					"s3Objects stats for " + typeName + " type objects", 
					jailName, 
					sql, 
					{ 
						tp : 'link', 
						count : 'integer', 
						aec : 'decimal', 
						aes : 'bytes', 
						tes : 'bytes' }, 
					{ tp : 'jailStorageTypeStats?id=' + jailName + '&type=' }
				);
			},
			access	: "admin"
		},
		showShares : {
			title	: "Show All Shares by Jail",
			run		: [ require, './ShowShares' ],
			ui		: true,
			access	: "admin"
		},
		showStorage : {
			title	: "Show Storage Stats by Jail",
			run		: [ require, './ShowStorage' ],
			ui		: true,
			access	: "admin"
		},
	}
});
