/**
 * 
 */

function runUpdateAccountEmail(context){
	const share = context.share;
	
	const client = share.authRequireAccount(context, this.index.accessGroup || 'admin');
	context.title = this.title;
	
	const query = context.query;
	const auth = this.index.auth || share.authenticationProvider;
	
	var parameters = query.parameters;
	
	if( parameters.done ){
		return share.makeUpdateSuccessLayout();
	}

	var accountId = parameters.accountId;
	var accountEmail = parameters.accountEmail;

	if( accountId && accountEmail !== undefined ){
		if(auth.authSetEmail(accountId, accountEmail)){
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
					{name : "accountId", title : "Account ID", type : "constant", value : user.key },
					{name : "accountEmail", title : "Email", type : "text", value : user.email },
				];
				for(var i = 0; i < fields.length; ++i){
					/**
					 * the gain is that it is correctly escapes all the sequences
					 */
					= Format.xmlElement('field', fields[i]);
				}
				
				if(parameters.back){
					= Format.xmlElement('field', {
						name : 'back',
						type : 'hidden',
						value : parameters.back,
					});
				}

				%><help src="/resource/documentation.xml#administration/updateAccountEmail" /><%
				%><submit icon="vcard_edit" title="Update Account..." /><%
			%></form><%
		}else{
			xsl = "/!/skin/skin-standard-xml/show.xsl";
			%><form<%= Format.xmlAttribute('title', this.title) %> jumpUrl="listAccounts" jumpTitle="account list..."><%
				= Format.xmlElement('client', share.clientElementProperties(context));
				%><field name="key" title="Account" type="select" value="<%= client %>"><%
					for(var account of auth.authListAccounts()){
						var user = auth.authGetUserInfo(account);
						%><option value="<%= account %>" title="<%= account + ', ' + user.email %>"/><%
					}
				%></field><%
				%><help src="/resource/documentation.xml#administration/updateAccountEmail" /><%
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

const UpdateAccountEmail = module.exports = ae3.Class.create(
	"UpdateAccountEmail",
	undefined,
	function UpdateAccountEmail(index, systemName, pathPrefix){
		this.index = index;
		this.title = systemName + "::" + pathPrefix + "updateAccountEmail (Update Account's Email)";
		return this;
	},
	{
		handle : runUpdateAccountEmail
	}
);
