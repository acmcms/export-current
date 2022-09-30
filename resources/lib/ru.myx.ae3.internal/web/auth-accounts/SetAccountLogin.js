function SetAccountLogin(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "setAccountLogin (Add/Update Account's Login)";
}

function runSetAccountLogin(context){
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
	const accountLogin = parameters.accountLogin;

	const newPass = parameters.newPass;
	const chkPass = parameters.chkPass;

	if( accountId && accountLogin && newPass ){
		if(chkPass !== undefined && chkPass != newPass){
			return share.makeClientFailureLayout('Check password does not match!');
		}
		if(auth.authSetPassword(accountId, accountLogin, newPass)){
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
			%><field name="accountId" title="Account ID" type="constant" variant="username" <%= Format.xmlAttribute('value', accountId || '') %>/><%
			= Format.xmlElement('field', {
				name : 'accountLogin',
				title : 'Login',
				type : 'string',
				value : accountLogin || undefined
			});
			%><field name="newPass" title="New password" type="password" /><%
			%><field name="chkPass" title="Repeat again" type="password" /><%
			%><help src="/resource/documentation.xml#administration/setAccountLogin" /><%
			%><submit icon="lock_add" title="Change Password" /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

const PROTOTYPE = SetAccountLogin.prototype = {
	handle : runSetAccountLogin
};

module.exports = SetAccountLogin;
