/**
 * 
 */

function runReadAccount(context){
	const share = context.share;
	
	const client = share.authRequireAccount(context, this.index.accessGroup || 'admin');
	context.title = this.title;
	
	const query = context.query;
	const auth = this.index.auth || share.authenticationProvider;
	
	var xml;
	
	var parameters = query.parameters;
	if( parameters.key ){
		
		var accountId = parameters.key;

		var account = auth.authGetUserInfo(accountId);
		if(!account){
			return share.makeClientFailureLayout('Account not found');
		}
		var logins = auth.authListUserLogins(accountId);
		
		$output(xml){
			%><?xml version="1.0" encoding="UTF-8"?><%
			%><?xml-stylesheet type="text/xsl" href="/!/skin/skin-standard-xml/show.xsl"?><%
			%><account<%= Format.xmlAttribute('title', this.title) %> jumpUrl="listAccounts" jumpTitle="account list..." layout="view"><%
				= Format.xmlElement('client', share.clientElementProperties(context));
				%><fields><%
					%><field name="key" title="Account ID" variant="username"/><%
					%><field name="email" title="Email" variant="email"/><%
					%><field name="admin" title="Is admin" type="select" variant="boolean"/><%
					%><field name="lastAddress" title="Last Address" variant="IP"/><%
					%><field name="lastLogged" title="Last Seen" type="date" variant="date"/><%
					%><field name="logins" title="Logins" variant="list" elementName="login"><%
						%><columns><%
							%><column id="." title="Login" variant="username"/><%
							var back = 'readAccount?' + Format.queryStringParameters({key:accountId});
							= Format.xmlElement('command',{
								title : "Set Password",
								icon : "lock_add",
								prefix : 'setAccountLogin?' + Format.queryStringParameters({
									back : back,
									accountId : accountId,
									// must be last 8-) 
									accountLogin : ''
								}),
								field : '.'
							});
							= Format.xmlElement('command',{
								title : "Drop Login",
								icon : "cross",
								prefix : 'dropAccountLogin?' + Format.queryStringParameters({
									back : back,
									accountId : accountId,
									// must be last 8-) 
									accountLogin : ''
								}),
								field : '.'
							});
						%></columns><%
						%><command icon="key_add" url="setAccountLogin?accountId=<%= account.key %>&amp;back=listAccounts" title="Add/Replace Account's Login..." /><%
					%></field><%
					%><field name="groups" title="Membership" variant="list" elementName="group"><%
						%><columns><%
							%><column id="." title="Group" variant="groupname"/><%
							var back = 'readAccount?' + Format.queryStringParameters({key:accountId});
							= Format.xmlElement('command',{
								title : "Drop Membership",
								icon : "cross",
								prefix : 'dropMembership?' + Format.queryStringParameters({
									back : back,
									accountId : accountId,
									// must be last 8-) 
									group : ''
								}),
								field : '.'
							});
						%></columns><%
						%><command icon="key_add" url="setMembership?accountId=<%= account.key %>&amp;back=listAccounts" title="Set Account's Group Membership..." /><%
					%></field><%
					%><command icon="vcard_edit" url="updateAccount?key=<%= account.key %>&amp;back=listAccounts" title="Edit Account" /><%
					%><command icon="cross" url="dropAccount?key=<%= account.key %>&amp;back=listAccounts" title="Drop Account..." /><%
					%><help src="/resource/documentation.xml#administration/readAccount" /><%
				%></fields><%
				%><key><%= account.key %></key><%
				%><email><%= Format.xmlNodeValue( account.email || '' ) %></email><%
				%><admin><%= account.admin %></admin><%
				%><lastAddress><%= account.lastAddress || '' %></lastAddress><%
				%><lastLogged><%= account.lastLogged?.toISOString() || '' %></lastLogged><%
				%><logins><%
					for(var login of logins){
						%><login><%= Format.xmlNodeValue( login ) %></login><%
					}
				%></logins><%
				%><groups><%
					for(var group of auth.authListUserGroups(accountId)){
						%><group><%= Format.xmlNodeValue( group ) %></group><%
					}
				%></groups><%
			%></account><%
		}
		return {
			layout	: "final",
			type	: "text/xml",
			content	: xml
		};
	}
	
	$output(xml){
		%><?xml version="1.0" encoding="UTF-8"?><%
		%><?xml-stylesheet type="text/xsl" href="/!/skin/skin-standard-xml/show.xsl"?><%
		%><form<%= Format.xmlAttribute('title', this.title) %> jumpUrl="listAccounts" jumpTitle="account list..."><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			%><field name="key" title="Account" type="select" value="<%= client %>"><%
				for(var account of auth.authListAccounts()){
					var user = auth.authGetUserInfo(account);
					%><option value="<%= account %>" title="<%= account + ', ' + user.email %>"/><%
				}
			%></field><%
			%><help src="/resource/documentation.xml#administration/readAccount" /><%
			%><submit title="Select Account..." /><%
		%></form><%
	}
	return {
		layout	: "final",
		type	: "text/xml",
		content	: xml
	};
}

const ae3 = require("ae3");

const ReadAccount = module.exports = ae3.Class.create(
	"ReadAccount",
	undefined,
	function ReadAccount(index, systemName, pathPrefix){
		this.index = index;
		this.title = systemName + "::" + pathPrefix + "readAccount (Read Account)";
		return this;
	},
	{
		handle : {
			value : runReadAccount
		}
	}
);
