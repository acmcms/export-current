/**
 * 
 */

function runChangePassword(context){
	const auth = context.share.authenticationProvider;
	if(!auth){
		return context.share.makeClientFailureLayout('No authentication defined!');
	}

	const share = context.share;
	const client = share.authRequireAccount(context, null);
	context.title = this.title;

	const query = context.query;
	const parameters = query.parameters;
	
	if( parameters.done ){
		return share.makeUpdateSuccessLayout();
	}
	
	const accountId = parameters.accountId;
	const accountLogin = parameters.accountLogin;
	const accountPassword = parameters.accountPassword;

	const newPass = parameters.newPass;
	const chkPass = parameters.chkPass;

	if( accountId && accountLogin && newPass){
		if(accountId != client){
			return share.makeClientFailureLayout('"accountId" does not match!');
		}
		if(chkPass !== undefined && chkPass != newPass){
			return share.makeClientFailureLayout('Check password does not match!');
		}
		if(!auth.authCheckLoginPassword(accountLogin, accountPassword)){
			return share.makeAccessDeniedLayout('Login and/or current password failure!');
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
			%><field name="accountId" title="Account ID" type="constant" value="<%= client %>"/><%
			= Format.xmlElement('field', {
				name : 'accountLogin',
				title : 'Login',
				type : 'string',
				value : accountLogin || undefined
			});
			%><field name="accountPassword" title="Old password" type="password" /><%
			%><field name="newPass" title="New password" type="password" /><%
			%><field name="chkPass" title="Repeat again" type="password" /><%
			%><help src="/resource/documentation.xml#personal/changePassword" /><%
			%><submit icon="lock_add" title="Change Password" /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

const ae3 = require("ae3");

const ChangePassword = module.exports = ae3.Class.create(
	"ChangePassword",
	undefined,
	function ChangePassword(systemName, pathPrefix){
		this.title = systemName + "::" + pathPrefix + "changePassword (Update Your Password)";
		return this;
	},
	{
		handle : runChangePassword
	}
);
