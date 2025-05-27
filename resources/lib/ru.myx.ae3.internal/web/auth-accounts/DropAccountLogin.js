/**
 * 
 */

function runDropAccountLogin(context){
	const share = context.share;
	
	share.authRequireAccount(context, this.index.accessGroup || 'admin');
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

	const accountId = parameters.accountId || parameters.key;
	const accountLogin = parameters.accountLogin || parameters.login;

	if( confirmation && accountLogin && accountId ){
		var account = auth.authGetUserInfo(accountId);
		if(!account){
			return share.makeClientFailureLayout(this.title, "Account '" + accountId + "' is unknown!");
		}
		/* auth.removePassword(accountId, accountLogin) */
		if(auth.authSetPassword(accountId, accountLogin, '')){
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
				
				var logins = auth.authListUserLogins(accountId);
				if(!logins?.length){
					return share.makeClientFailureLayout("Account '" + accountId + "' have no logins!");
				}

				%><field name="accountId" title="Account ID" type="constant" variant="username" <%= Format.xmlAttribute('value', accountId) %>/><%
				%><field name="accountLogin" title="Login" type="select" <%= Format.xmlAttribute('value', accountLogin || '') %>><%
					%><option value="" title=" -= Select Login =- "/><%
					for(var login of logins){
						= Format.xmlElement('option', {
							value : login,
							title : login,
						});
					}
				%></field><%
			}else{
				%><field name="accountId" title="Account ID" type="text" variant="username" value=""/><%
				%><field name="accountLogin" title="Login" type="text" <%= Format.xmlAttribute('value', accountLogin || '') %>/><%
			}
			%><field name="confirmation" title="Confirmation" type="select" value="no"><%
				%><option value="no" title="No - I don't want to delete account's login"/><%
				%><option value="yes" title="Yes - I do want to delete account's login selected above"/><%
			%></field><%
			
			if(parameters.back){
				= Format.xmlElement('field', {
					name : 'back',
					type : 'hidden',
					value : parameters.back,
				});
			}

			%><help src="/resource/documentation.xml#administration/dropAccountLogin" /><%
			%><submit icon="cross" title="Drop Account's Login" /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl		: xsl,
		content	: xml
	};
}

const ae3 = require("ae3");

const DropAccountLogin = module.exports = ae3.Class.create(
	"DropAccountLogin",
	undefined,
	function DropAccountLogin(index, systemName, pathPrefix){
		this.index = index;
		this.title = systemName + "::" + pathPrefix + "dropAccountLogin (Drop One Of Account's Logins)";
		return this;
	},
	{
		handle : {
			value : runDropAccountLogin
		}
	}
);
