/**
 * 
 */

function runChangeEmail(context){
	const auth = context.share.authenticationProvider;
	if(!auth){
		return context.share.makeClientFailureLayout('No authentication defined!');
	}
	
	const client = context.share.authRequireAccount(context, null);
	context.title = this.title;

	const query = context.query;
	const parameters = query.parameters;
	
	if( parameters.done ){
		return share.makeUpdateSuccessLayout();
	}

	if( parameters.clientId ){
		var clientId = parameters.clientId;
		if(clientId != client){
			return context.share.makeClientFailureLayout('Invalid clientId!');
		}

		var accountLogin = parameters.accountLogin;
		var accountPassword = parameters.accountPassword;
		var email = parameters.email;
		var again = parameters.again;
		
		if(again !== undefined && again != email){
			return context.share.makeClientFailureLayout('Check email does not match!');
		}
		if(!auth.authCheckLoginPassword(accountLogin, accountPassword)){
			return context.share.makeAccessDeniedLayout('Access denied, login/password validation failure!');
		}
		if(auth.authSetEmail(client, email)){
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
		return context.share.makeServerFailureLayout();
	}
	
	var xml;
	$output(xml){
		%><form<%= Format.xmlAttribute('title', this.title) %>><%
			= Format.xmlElement('client', context.share.clientElementProperties(context));
			%><field name="clientId" title="Client ID" type="constant" value="<%= client %>"/><%
			%><field name="login" title="Login" type="text" /><%
			%><field name="pass" title="Password" type="password" /><%
			%><field name="email" title="New Email" type="text" /><%
			%><field name="again" title="Once more" type="text" /><%
			%><help src="/resource/documentation.xml#personal/changeEmail" /><%
			%><submit title="Change Email..." /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

const ae3 = require("ae3");

const ChangeEmail = module.exports = ae3.Class.create(
	"ChangeEmail",
	undefined,
	function ChangeEmail(systemName, pathPrefix){
		this.title = systemName + "::" + pathPrefix + "changeEmail (Update Your Email)";
		return this;
	},
	{
		handle : {
			value : runChangeEmail
		}
	}
);
