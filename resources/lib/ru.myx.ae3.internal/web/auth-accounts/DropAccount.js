function DropAccount(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "dropAccount (Drop Account)";
}

function runDropAccount(context){
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

	const accountId = parameters.key;

	if( confirmation && accountId ){
		var account = auth.authGetUserInfo(accountId);
		if(!account){
			return share.makeClientFailureLayout("Account '" + accountId + "' is unknown!");
		}
		if(auth.authDropUser(accountId)){
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
				title : 'Account ID',
				type : accountId ? 'constant' : 'text',
				variant : 'username',
				value : accountId || ''
			});
			%><field name="confirmation" title="Confirmation" type="select" value="no"><%
				%><option value="no" title="No - I don't want to delete the account entered above"/><%
				%><option value="yes" title="Yes - I do want to delete the account entered above"/><%
			%></field><%
			
			if(parameters.back){
				= Format.xmlElement('field', {
					name : 'back',
					type : 'hidden',
					value : parameters.back,
				});
			}

			%><help src="/resource/documentation.xml#administration/dropAccount" /><%
			%><submit icon="cross" title="Drop Account" /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: xsl,
		content	: xml
	};
}

const PROTOTYPE = DropAccount.prototype = {
	handle : runDropAccount
};

module.exports = DropAccount;