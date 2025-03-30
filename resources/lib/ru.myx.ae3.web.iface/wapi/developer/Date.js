/**
 * 
 */

const layoutTemplate = {
	layout : "data-table",
	name : "date",
	attributes : {
		title : "AE3::developer/date (Date)"
	},
	columns : [
		{
			id : "type",
			title : "Type",
			type : "string"
		},
		{
			id : "date",
			title : "Date String",
			type : "string"
		},
		{
			id : "code",
			title : "Source Code",
			type : "string"
		},
	],
	rows : [
		{
			type : "ISO",
			date : new Date().toISOString()
		}
	]
};

module.exports = function(context){
	const date = new Date();
	
	return Object.create(layoutTemplate, {
		rows : {
			value : [
				{
					type : "ISO",
					date : date.toISOString(),
					code : "date.toISOString()"
				},
				{
					type : "UTC",
					date : date.toUTCString(),
					code : "date.toUTCString()"
				},
			]
		}
	});
};
