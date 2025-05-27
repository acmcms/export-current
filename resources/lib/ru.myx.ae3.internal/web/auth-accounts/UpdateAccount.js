/**
 * 
 */

function runUpdateAccount(context){
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
		var accountId = parameters.accountId;
		var accountEmail = parameters.accountEmail;
		var accountIsAdmin = parameters.accountIsAdmin == 'true';
		
		if(auth.authCheckUser(accountId) || auth.authAddUser(accountId, true)){
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
		return share.makeServerFailureLayout();
	}
	
	var xml, xsl;
	$output(xml){
		if( parameters.key ){
			var user = auth.authGetUserInfo(parameters.key);
			xsl = "/!/skin/skin-standard-xml/show.xsl";
			%><form<%= Format.xmlAttribute('title', this.title) %> jumpUrl="listAccounts" jumpTitle="account list..."><%
				= Format.xmlElement('client', share.clientElementProperties(context));
				var fields = [
					{name : "clientId", title : "Client ID", type : "constant", value : client },
					{name : "accountId", title : "Account ID", type : "constant", value : user.key },
					{name : "accountEmail", title : "Email", type : "string", variant : "email", value : user.email },
//					{name : "accountPhoto", title : "Photo", type : "file", value : user.photo },
				];
				for(var i = 0; i < fields.length; ++i){
					/**
					 * the gain is that is correctly escapes all the sequences
					 */
					= Format.xmlElement('field', fields[i]);
				}
				%><field name="accountIsAdmin" title="Is admin" type="select" value="<%= user.admin %>"><%
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

				%><help src="/resource/documentation.xml#administration/updateAccount" /><%
				%><submit icon="vcard_edit" title="Update Account" /><%
			%></form><%
		}else{
			xsl = "/!/skin/skin-standard-xml/show.xsl";
			%><form<%= Format.xmlAttribute('title', this.title) %> jumpUrl="listAccounts" jumpTitle="account list..."><%
				= Format.xmlElement('client', share.clientElementProperties(context));
				%><field name="key" title="Account" type="select" value="<%= clientId %>"><%
					for(var account of auth.authListAccounts()){
						var user = auth.authGetUserInfo(account);
						%><option value="<%= account %>" title="<%= account + ', ' + user.email %>"/><%
					}
				%></field><%
				%><help src="/resource/documentation.xml#administration/updateAccount" /><%
				%><submit title="Select Account..." /><%
			%></form><%
		}
	}
	return {
		layout	: "xml",
		xsl		: xsl,
		content	: xml
	};
}

const ae3 = require("ae3");

const UpdateAccount = module.exports = ae3.Class.create(
	"UpdateAccount",
	undefined,
	function UpdateAccount(index, systemName, pathPrefix){
		this.index = index;
		this.title = systemName + "::" + pathPrefix + "updateAccount (Edit Account)";
		return this;
	},
	{
		handle : {
			value : runUpdateAccount
		}
	}
);
