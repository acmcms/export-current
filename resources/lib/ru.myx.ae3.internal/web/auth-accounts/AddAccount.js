function AddAccount(index, systemName, pathPrefix){
	this.index = index;
	this.title = systemName + "::" + pathPrefix + "addAccount (Account Creation)";
}

function runAddAccount(context){
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
		var accountId = (parameters.accountId || '').trim();
		var accountLogin = (parameters.accountLogin || '').trim();
		var accountPassword = parameters.accountPassword;
		var accountEmail = (parameters.accountEmail || '').trim();
		var accountIsAdmin = parameters.accountIsAdmin == 'true';
		
		if(auth.authCheckUser(accountId) || auth.authAddUser(accountId, true)){
			if(accountLogin && accountPassword){
				auth.authSetPassword(accountId, accountLogin, accountPassword);
			}
			if(accountEmail !== undefined){
				auth.authSetEmail(accountId, accountEmail);
			}
			if(accountIsAdmin !== undefined){
				accountIsAdmin
					? auth.authAddMembership(accountId, "admin")
					: auth.authDropMembership(accountId, "admin");
			}
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
			%><field name="accountId" title="Account ID" type="string" /><%
			%><field name="accountLogin" title="Login" type="string" variant="username" /><%
			%><field name="accountPassword" title="Password" type="password" /><%
			%><field name="accountEmail" title="Email" type="string" variant="email" /><%
			%><field name="accountIsAdmin" title="Is admin" type="select" value=""><%
				%><option value="false" title="No, Client"/><%
				%><option value="true" title="Yes, Admin"/><%
			%></field><%
			
			if(parameters.back){
				= Format.xmlElement('field', {
					name : 'back',
					type : 'hidden',
					value : parameters.back,
				});
			}

			%><submit icon="user_add" title="Add Account..." /><%
			%><help src="/resource/documentation.xml#administration/addAccount" /><%
		%></form><%
	}
	return {
		layout	: "final",
		type	: "text/xml",
		content	: xml
	};
}

const PROTOTYPE = AddAccount.prototype = {
	handle : runAddAccount
};

module.exports = AddAccount;