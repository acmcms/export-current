function SetMembership(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "setMembership (Add/Update Account's Group Membership)";
}

function internPutElementToKeys(map, element){
	map[element] = 1;
	return map;
}

function internRemoveElementFromKeys(map, element){
	delete map[element];
	return map;
}

function internRemoveAll(all, remove){
	return Object.keys( remove.reduce(internRemoveElementFromKeys, all.reduce(internPutElementToKeys, {})) );
}

function runSetMembership(context){
	const share = context.share;
	const client = share.authRequireAccount(context, this.index.accessGroup || 'admin');
	context.title = this.title;
	const query = context.query;
	const auth = this.index.auth || share.authenticationProvider;
	
	const parameters = query.parameters;
	
	if( parameters.done ){
		return share.makeUpdateSuccessLayout();
	}

	const accountId = parameters.accountId;
	const groupId = parameters.groupId;

	if( accountId && groupId ){
		if(auth.authAddMembership(accountId, groupId)){
			return {
				layout : 'xml',
				xsl : '/!/skin/skin-standard-xml/showState.xsl',
				content : Format.xmlElement('done', {
					title : this.title,
					updated : (new Date()).toISOString(),
					forward : parameters.back 
				})
			};
		}
		return share.makeServerFailureLayout();
	}
	
	var xml;
	$output(xml){
		%><form<%= Format.xmlAttribute('title', this.title) %>><%
			= Format.xmlElement('client', share.clientElementProperties(context));

			var allGroups = auth.authListGroups();
			var userGroups = auth.authListUserGroups(accountId);
			var groups = allGroups
				? userGroups
					? internRemoveAll(allGroups, userGroups)
					: allGroups
				: null;
			if(!groups || !groups.length){
				return share.makeClientFailureLayout("Account '" + accountId + "' is a member of any group available!");
			}

			%><field name="accountId" title="Account ID" type="constant" variant="username" <%= Format.xmlAttribute('value', accountId) %>/><%
			%><field name="groupId" title="Group" type="select" <%= Format.xmlAttribute('value', groupId || '') %>><%
				%><option value="" title=" -= Select Group =- "/><%
				for(var group of groups){
					= Format.xmlElement('option', {
						value : group,
						title : group,
					});
				}
			%></field><%
			%><help src="/resource/documentation.xml#administration/setMembership" /><%
			%><submit icon="lock_add" title="Set Membership" /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

const PROTOTYPE = SetMembership.prototype = {
	handle : runSetMembership
};

module.exports = SetMembership;
