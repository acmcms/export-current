function DropGroup(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "dropGroup (Drop Group)";
}

function runDropGroup(context){
	const share = context.share;
	const client = share.authRequireAccount(context, this.index.accessGroup || 'admin');
	context.title = this.title;
	const query = context.query;
	const parameters = query.parameters;
	
	const auth = this.index.auth || share.authenticationProvider;

	if( parameters.done ){
		return share.makeUpdateSuccessLayout();
	}

	const confirmation = parameters.confirmation;
	
	if( confirmation && confirmation != 'yes'){
		return share.makeClientFailureLayout("No positive confirmation. 'yes' expected, but having: " + confirmation);
	}

	const groupId = parameters.key;

	if( confirmation && groupId ){
		var group = auth.authGetGroupInfo(groupId);
		if(!group){
			return share.makeClientFailureLayout("Group '" + groupId + "' is unknown!");
		}
		if(auth.authDropGroup(groupId)){
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
			= Format.xmlElement('field', {
				name : 'key',
				title : 'Group ID',
				type : groupId ? 'constant' : 'text',
				variant : 'groupname',
				value : groupId || ''
			});
			%><field name="confirmation" title="Confirmation" type="select" value="no"><%
				%><option value="no" title="No - I don't want to delete the group entered above"/><%
				%><option value="yes" title="Yes - I do want to delete the group entered above"/><%
			%></field><%
			
			if(parameters.back){
				= Format.xmlElement('field', {
					name : 'back',
					type : 'hidden',
					value : parameters.back,
				});
			}

			%><help src="/resource/documentation.xml#administration/dropGroup" /><%
			%><submit icon="cross" title="Drop Group" /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: xsl,
		content	: xml
	};
}

const PROTOTYPE = DropGroup.prototype = {
	handle : runDropGroup
};

module.exports = DropGroup;