function ListAccounts(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "listAccounts (List User Accounts)";
	return this;
}

function runListAccounts(context){
	const share = context.share;
	const client = share.authRequireAccount(context, this.index.accessGroup || 'admin');
	const query = context.query;
	const auth = this.index.auth || share.authenticationProvider;

	const rows = [];
	
	for(var client of auth.authListAccounts()){
		var admin = auth.authCheckMembership(client, 'admin');
		var user = auth.authGetUserInfo(client);
		rows.push({
			hl : admin,
			key : client,
			admin : admin,
			email : user.email,
			address : user.lastAddress,
			date : user.lastLogged,
			groups : auth.authListUserGroups(client).join(',') || undefined,
		});
	}
	
	return {
		layout : 'data-table',
		attributes : {
			title : this.title,
			jumpUrl : "addAccount?back=listAccounts",
			jumpTitle : "add new account..."
		},
		columns : [
			{
				id : 'key',
				title : 'Account ID',
				type : 'string'
			},
			{
				id : 'admin',
				title : 'Is Admin?',
				type : 'boolean',
				variant : 'boolean'
			},
			{
				id : 'email',
				title : 'Email',
				type : 'string',
				variant : 'email'
			},
			{
				id : 'address',
				title : 'Last Address',
				type : 'string',
			},
			{
				id : 'date',
				title : 'Last Seen',
				type : 'date',
				variant : 'date'
			},
			{
				id : 'groups',
				title : 'Membership',
				type : 'string',
				variant : 'split-list',
				separator : ','
			}
		],
		rowCommands : [
			{
				title : 'View Account',
				icon : 'zoom_in',
				prefix : 'readAccount?back=listAccounts&key=',
				field : 'key'
			},
			{
				title : "Drop Account",
				icon : "cross",
				prefix : "dropAccount?back=listAccounts&key=",
				field : "key"
			}
		],
		rows : rows,
		help : "/resource/documentation.xml#administration/listAccounts"
	};
}

const PROTOTYPE = ListAccounts.prototype = {
	handle : runListAccounts
};

module.exports = ListAccounts;