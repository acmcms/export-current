const ae3 = require("ae3");

const LAYOUT_FILTER_OPTIONS = [
	{
		value : "self",
		icon : "database_gear",
		titleShort : "Local",
		title : "Self: Local Web Server"
	},
	{
		value : "list",
		icon : "application_view_columns",
		titleShort : "Table",
		title : "List: All Web Servers available"
	},
	{
		value : "view",
		icon : "application_view_columns",
		titleShort : "View",
		title : "View: All Web Servers available"
	},
];

const LAYOUT_VIEW_MODE_OPTIONS = [
	{ 
		value : "last-read", 
		icon : "server",
		title : "Read Last Local Exception"
	},
	{
		value : "last-reset", 
		icon : "star",
		title : "Read-Reset Last Local Exception"
	},
];

const LAYOUT_FILTERS_PROTOTYPE = {
	fields : [
		{ 
			name : "aggregate", 
			title : "Aggregate", 
			type : "select", 
			option : LAYOUT_FILTER_OPTIONS 
		},
		{ 
			name : "mode", 
			title : "View Mode", 
			type : "select", 
			option : LAYOUT_VIEW_MODE_OPTIONS 
		},
	],
	values : null
};

const LAYOUT_TABLE_COLUMNS = [
	{
		id : "name", // for table column
		name : "name", // for view field
		title : "Host Name",
		type : "string",
		variant : "link",
		prefix : "https://",
		icon : "world_go",
		disposition : "title",
		extraClass : "hl-ui-title"
	},
	{
		id : "exception", // for table column
		name : "exception", // for view field
		title : "Exception",
		type : "layout",
		variant : "layout",
		zoom : "document"
	}
];

const LastWebException = module.exports = ae3.Class.create(
	"LastWebException",
	undefined,
	function(index, systemName, pathPrefix){
		this.index = index;
		this.title = systemName + "::" + pathPrefix + "lastWebException (Last Web Share Exception)";
		return this;
	},
	{
		authRequired : {
			value : true
		},
		handle : {
			value : function(context){
				const share = context.share;
				const client = share.authRequireAccount(context, 'admin');
				const query = context.query;

				context.title = this.title;

				const aggregate = query.parameters.aggregate ?? "view";
				const mode = query.parameters.mode ?? "last-read";
				const view = aggregate + "-" + mode;
				
				const filters = context.layoutFilters = Object.create(LAYOUT_FILTERS_PROTOTYPE, {
					values : {
						value : {
							aggregate : aggregate,
							mode : mode
						},
						enumerable : true
					}
				});
				
				const lastExceptionLayout = require("ae3.web/Share").getLastExceptionLayoutOrOk(mode.endsWith("-reset"));
				
				switch(view){
					
				case "self-last-read":
				case "self-last-reset":
					
					if(!lastExceptionLayout){
						return share.makeUpdateSuccessLayout("No data available.");
					}
					
					return Object.create(lastExceptionLayout, {
						/**
						 * prevent 4xx errors use delay when returned.
						 */
						delay : {
							value : false,
							enumerable : true
						}
					});
					
				case "list-last-read":
				case "list-last-reset":
					
					const rows = [
						{
							name : require('os').hostname(),
							exception : lastExceptionLayout ?? share.makeUpdateSuccessLayout("No data available.")
						}
					];
					return {
						layout : "data-table",
						attributes : {
							title : this.title,
							cssId : "--list"
						},
						filters : filters,
						columns : LAYOUT_TABLE_COLUMNS,
						rows : rows,
						rowCommands : [
							{
								title : "Focus on this one",
								icon : "script_gear",
								prefix : "?mode=select&name=",
								field : "name"
							}
						]
					};
					
				case "view-last-read":
				case "view-last-reset":
					
					return {
						layout : "data-view",
						attributes : {
							title : this.title
						},
						filters : filters,
						fields : LAYOUT_TABLE_COLUMNS,
						values : {
							name : require('os').hostname(),
							exception : lastExceptionLayout ?? share.makeUpdateSuccessLayout("No data available.")
						},
						commands : [
							{
								title : "Focus on this one",
								icon : "script_gear",
								prefix : "?mode=select&name=",
								field : "name"
							}
						]
					};
					
				}
				
				return share.makeClientFailureLayout({
					code    : 404,
					reason  : "Invalid view mode: " + view
				});

			}
		}
	}
);
