function DropMembership(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "dropMembership (Drop One Of Account's Group Memberships)";
}

function runDropMembership(context){
	const share = context.share;
	const client = share.authRequireAccount(context, this.index.accessGroup || 'admin');
	context.title = this.title;
	const query = context.query;
	const auth = this.index.auth || share.authenticationProvider;
	
	const parameters = query.parameters;
	
	if( parameters.done ){
		return share.makeUpdateSuccessLayout();
	}

	const confirmation = parameters.confirmation;
	
	if( confirmation && confirmation != 'yes'){
		return share.makeClientFailureLayout("No positive confirmation. 'yes' expected, but having: " + confirmation);
	}

	const accountId = parameters.accountId || parameters.key;
	const groupId = parameters.group || parameters.groupId;
	
	if( confirmation && groupId && accountId ){
		var account = auth.authGetUserInfo(accountId);
		if(!account){
			return share.makeClientFailureLayout("Account '" + accountId + "' is unknown!");
		}
		if(auth.authDropMembership(accountId, groupId)){
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
	
	var xml, xsl;
	$output(xml){
		xsl = "/!/skin/skin-standard-xml/show.xsl";
		%><form<%= Format.xmlAttribute('title', this.title) %>><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			if(accountId){
				var account = auth.authGetUserInfo(accountId);
				if(!account){
					return share.makeClientFailureLayout("Account '" + accountId + "' is unknown!");
				}
				
				var groups = auth.authListUserGroups(accountId);
				if(!groups?.length){
					return share.makeClientFailureLayout("Account '" + accountId + "' is not a member of any group!");
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
			}else{
				%><field name="accountId" title="Account ID" type="text" variant="username" value=""/><%
				%><field name="gropuId" title="Group" type="text" <%= Format.xmlAttribute('value', groupId || '') %>/><%
			}
			%><field name="confirmation" title="Confirmation" type="select" value="no"><%
				%><option value="no" title="No - I don't want to delete account's membership"/><%
				%><option value="yes" title="Yes - I do want to delete account's membership selected above"/><%
			%></field><%
			
			if(parameters.back){
				= Format.xmlElement('field', {
					name : 'back',
					type : 'hidden',
					value : parameters.back,
				});
			}

			%><help src="/resource/documentation.xml#administration/dropMembership" /><%
			%><submit icon="cross" title="Drop Account's Membership" /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: xsl,
		content	: xml
	};
}

const PROTOTYPE = DropMembership.prototype = {
	handle : runDropMembership
};

module.exports = DropMembership;