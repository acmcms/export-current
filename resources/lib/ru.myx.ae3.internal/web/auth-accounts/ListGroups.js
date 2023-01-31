function ListGroups(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "listGroups (List User Groups)";
	return this;
}


function runListGroups(context){
	const share = context.share;
	const client = share.authRequireAccount(context, this.index.accessGroup || "admin");
	const query = context.query;
	const auth = this.index.auth || share.authenticationProvider;
	
	const rows = [];

	const userId = query.parameters.user;
	for(var groupName of userId 
			? auth.authListUserGroups(userId) 
			: auth.authListGroups()
	){
		rows.push({
			hl : groupName == "admin",
			key : groupName,
			admin : groupName == "admin",
		});
	}
	
	return {
		layout : "data-table",
		attributes : {
			title : this.title,
			jumpUrl : "addGroup?back=listGroups",
			jumpTitle : "add new group..."
		},
		columns : [
			{
				id : "key",
				title : "Group ID",
				type : "string"
			},
			{
				id : "admin",
				title : "Is Admin?",
				type : "boolean",
				variant : "boolean"
			}
		],
		rowCommands : [
			{
				title : "View Group",
				icon : "zoom_in",
				prefix : "readGroup?back=listGroups&key=",
				field : "key"
			},
			{
				title : "Drop Group",
				icon : "cross",
				prefix : "dropGroup?back=listGroups&key=",
				field : "key"
			}
		],
		rows : rows,
		help : "/resource/documentation.xml#administration/listGroups"
	};
}

const PROTOTYPE = ListGroups.prototype = {
	handle : runListGroups
};

module.exports = ListGroups;