var lib = require("ru.myx.acm.iface/AcmWebService");
var title = "ACM::jails/listJails (ACM Jail List)";

var ServerDomain = require("java.class/ru.myx.srv.acm.ServerDomain");

function internJailUsers(jail){
	var users = [];
	var accessManager = jail.accessManager;
	var groupSupervisors = accessManager.getGroup("def.supervisor", true);
	var supervisors = groupSupervisors.getUsers();
	for each(var user in supervisors){
		users.push({
			id : user.key,
			login : user.login,
			email : !user.email || user.email.endsWith("=-") ? undefined : user.email,
			touched : Format.date(user.changed, "yyyy-MM-dd"),
		});
	}
	return {
		user : users
	};
}

function internJailShares(jail){
	var shares = [];
	for each(var share in jail.getSharings()){
		if(jail.checkAllowedShare(share.key)){
			shares.push(share);
		}
	}
	return {
		share : shares
	};
}

function runListJails(context){
	const share = context.share;
	const client = share.authRequireAccount(context, "admin");
	const query = context.query;
	const auth = share.authenticationProvider;

	const parameters = query.parameters;

	var jails = ServerDomain.KNOWN_JAILS_SEALED;
	var jailNames = Object.keys(jails);
	jailNames.sort();
	
	const columns = [];
	if(parameters.format == "detail"){
		columns.push({
			id : "id",
			title : "Jail Name",
			type : "string",
			description : "title",
			extraClass : "hl-ui-title"
		});
	}else{
		columns.push({
			id : "id",
			title : "Jail Name",
			type : "string"
		});
	}
	columns.push({
		id : "domain",
		title : "Domain",
		type : "string"
	});
	
	columns.push({
		id : "controller",
		title : "Ctrl?", 
		variant : "boolean",
		type : "boolean"
	});
	
	if(parameters.format == "detail"){
		columns.push({
			id : "users",
			title : "Users",
			variant : "list",
			elementName : "user",
			columns : [
				{
					id : "login",
					title : "Login",
					variant : "username"
				},
				{
					id : "email",
					title : "E-Mail",
					variant : "email"
				},
				{
					id : "touched",
					title : "Touched",
					type : "date",
					variant : "date"
				}
			]
		});
		columns.push({
			id : "shares",
			title : "Shares",
			variant : "list",
			elementName : "share",
			columns : [
				{
					id : "alias",
					title : "Alias"
				}
			],
			rowCommands : [
				{
					title : "Open Share",
					icon : "world_go",
					prefix : "http://",
					field : "alias"
				}
			]
		});
	}

			
	const rows = [];
	var i, jail;
	for each(i in jailNames){
		jail = jails[i];
		rows.push({
			hl : jail.isControllerServer(),
			
			id : i,
			domain : jail.domainId,
			
			controller : jail.isControllerServer(),
			
			users : parameters.format == "detail" ? internJailUsers(jail) : undefined,
			shares : parameters.format == "detail" ? internJailShares(jail) : undefined,
		});
	}
	
	return {
		layout : "data-table",
		attributes : {
			title : title,
			cssId : "list"
		},
		columns : columns,
		rowCommands : [
			{
				title : "View Jail Detail",
				icon : "zoom_in",
				prefix : "../jails/readJail?back=listJails&id=",
				field : "id"
			}
		],
		commands : parameters.format == "detail" 
			? undefined
			: {
				title : "View Detailed List",
				icon : "zoom_in",
				url : "../jails/listJails?" + Format.queryStringParameters(parameters, {
					format : "detail"
				})
			}
		rows : rows
	};
}

module.exports = runListJails;
