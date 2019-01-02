function AddGroup(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "addGroup (Group Creation)";
}

function runAddGroup(context){
	const share = context.share;
	const client = share.authRequireAccount(context, this.index.accessGroup || 'admin');
	context.title = this.title;
	const query = context.query;
	const auth = this.index.auth || share.authenticationProvider;
	
	var parameters = query.parameters;
	
	if( parameters.done ){
		return share.makeUpdateSuccessLayout();
	}

	if( parameters.clientId ){
		var clientId = parameters.clientId;
		var groupId = parameters.groupId;
		if(auth.authCheckGroup(groupId) || auth.authAddGroup(groupId, true)){
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
		return share.makeClientFailureLayout();
	}

	var xml;
	$output(xml){
		%><?xml version="1.0" encoding="UTF-8"?><%
		%><?xml-stylesheet type="text/xsl" href="/!/skin/skin-standard-xml/show.xsl"?><%
		%><form<%= Format.xmlAttribute('title', this.title) %>><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			%><field name="clientId" title="Client ID" type="hidden" value="<%= client %>"/><%
			%><field name="groupId" title="Group ID" type="text" /><%
			
			if(parameters.back){
				= Format.xmlElement('field', {
					name : 'back',
					type : 'hidden',
					value : parameters.back,
				});
			}

			%><submit icon="group_add" title="Add Group..." /><%
			%><help src="/resource/documentation.xml#administration/addGroup" /><%
		%></form><%
	}
	return {
		layout	: "final",
		type	: "text/xml",
		content	: xml
	};
}

const PROTOTYPE = AddGroup.prototype = {
	handle : runAddGroup
};

module.exports = AddGroup;