var title = "ACM::jails/readJail (ACM Jail Detail)";

var ServerDomain = require("java.class/ru.myx.srv.acm.ServerDomain");

var headAttributes = Format.xmlAttribute('title', title) + ' jumpUrl="listJails" jumpTitle="jail list" layout="view"';
var helpElement = Format.xmlElement('help', { src : "/resource/documentation.xml#jails/readJail" });

function runReadJail(context){
	const share = context.share;
	const client = share.authRequireAccount(context, 'admin');
	const query = context.query;
	const parameters = query.parameters;
	
	const jailName = parameters.id;
	if(!jailName){
		return require('ru.myx.acm.iface/jails/Jails').handleSelectJail(client, query);
	}
	
	const jail = ServerDomain.KNOWN_JAILS_SEALED[jailName];

	if(!jail){
		context.title = {
			title : title,
			jumpUrl : 'listJails',
			jumpTitle : 'jail list' 
		};
		return share.makeClientFailureLayout('Record not found');
	}
	
	var xsl, xml;
	$output(xml){
		xsl = "/!/skin/skin-standard-xml/show.xsl";
		%><jail<%= headAttributes %>><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			%><fields><%
				%><field name="id" title="Jail Name" cssClass="hl-ui-title"/><%
				/*
				%><field name="." title="Brand" variant="view"><%
					%><fields><%
						%><field name="issuerId" title="Issuer ID"/><%
						%><field name="vendorId" title="Vendor ID"/><%
						%><command icon="zoom" url="../brands/readBrand?key=<%= brand.key %>" title="View Brand"/><%
					%></fields><%
				%></field><%
				%><field name="lastModified" title="Last Modified" type="date" variant="date"/><%
				*/
				%><field name="domain" title="Main Domain"/><%
				
				%><field name="users" title="Users" variant="list" elementName="user"><%
					%><columns><%
						%><column id="id" title="User ID"/><%
						%><column id="login" title="Login" variant="username"/><%
						%><column id="email" title="E-Mail" variant="email"/><%
						%><column id="touched" title="Touched" type="date" variant="date"/><%
					%></columns><%
				%></field><%

				%><field name="shares" title="Shares" variant="list" elementName="share"><%
					%><columns><%
						%><column id="alias" title="Alias"/><%
						%><column id="path" title="Path"/><%
						%><column id="authType" title="Auth Mode"/><%
						%><column id="accessType" title="Access"/><%
						%><column id="secureType" title="Security"/><%
						%><column id="skinner" title="Skinner"/><%
						%><column id="languageMode" title="Language"/><%
						%><column id="excluded" title="Excluded?"/><%
						%><command title="Open Share" icon="world_go" prefix="http://" field="alias"/><%
					%></columns><%
				%></field><%

				/*
				%><field name="stage" title="Product Stage" variant="select"><%
					%><option value="draft" icon="comment_edit" 	title="Draft / Planned (not ready for manufacturing)"/><%
					%><option value="testing" icon="group_key" 		title="Development / Testing ('test' or 'beta' orders only)"/><%
					%><option value="active" icon="cart_go" 		title="Active / Current (any orders are OK)"/><%
					%><option value="archive" icon="lock_delete" 	title="Archived / Discontinued (cannot place orders: End-Of-Life)"/><%
				%></field><%
				
				%><field name="deviceType" title="Product Type" variant="select"><%
					%><option value="0" title="E0, Not NDM Systems License"/><%
					%><option value="1" title="E1, NDM Systems License, not NDSS upgradable"/><%
					%><option value="2" title="E2, NDM Systems License, NDSS upgradable"/><%
					%><option value="3" title="E3, NDM Systems License, NDSS upgradable SSL only"/><%
				%></field><%
				
				%><field name="ndmFwId" title="NDM FW ID"/><%
				%><field name="cookieString" title="Vendor's Cookie"/><%
				%><field name="ndssId" title="Default NDSS ID"/><%
				
				%><field name="." title="CSV Export" variant="view"><%
					%><fields><%
						%><field name="exportHeader" title="Header Mode" variant="select"><%
							%><option value="" title="Plain CSV, no header"/><%
							%><option value="head" title="Plain CSV, plain header"/><%
							%><option value="head;" title="Plain CSV, header starting with ';'"/><%
							%><option value="head#" title="Plain CSV, header starting with '#'"/><%
						%></field><%
						
						%><field name="exportColumnTitles" title="Column Titles"/><%
						%><field name="exportColumnFormat" title="Column Format"/><%
						%><field name="exportExample" title="Example" variant="rows" cssClass="hscroll" itemCssClass="code" hint="Note: This is an example only. It uses non-persistent, randomly generated values. These licenses and other parameters are not attached to any actual product and order."/><%
					%></fields><%
				%></field><%
				
				
				%><field name="productionLicensePrice" title="Production License Price, $" variant="price"><%
					%><hint><b>USD</b>, 'real / production' and 'more spares / service' licenses only.</hint><%
				%></field><%
				
				%><field name="productionOvershipment" title="Production Overshipment, %" variant="decimal"><%
					%><hint><b>Percentage</b>, 'real / production' orders only.</hint><%
				%></field><%
				
				%><field name="track" title="Tracked Activity" variant="list" elementName="event"><%
					%><columns><%
						%><column id="date" title="Date" variant="date"/><%
						%><column id="command" title="Command"/><%
						%><column id="byUser" title="User" variant="username"/><%
						%><column id="byAddress" title="Address" variant="IP"/><%
						%><column id="byGeo" title="Geo" variant="geo"/><%
						%><command title="View Action Detail" icon="zoom_in" prefix="../readAction?key=" field="key"/><%
					%></columns><%
				%></field><%
				%><field name="orders" title="Related Orders" variant="document-url"/><%
				*/
				%><field name="objectCounts" title="Storage Object Counts" variant="document-url"/><%
				%><field name="extrasStats" title="Storage Extras Stats" variant="document-url"/><%
				%><field name="objectsStats" title="Storage Objects Stats" variant="document-url"/><%
				/*
				= Format.xmlElement('command', {
					icon : "application_form_edit",
					url : "updateProduct?" + Format.queryStringParameters({
						key : product.key,
						back : "readProduct?" + Format.queryStringParameters(parameters),
					}),
					title : "Edit"
				});
				if(product.stage == 'active' || (product.stage == 'testing' && (admin || brand.issuerClientId == client))){
					%><command icon="cart_put" url="../orders/prepareInitial?productId=<%= product.key %>" title="Order" /><%
				}
				 */
				
			%></fields><%
			%><id><%= jailName %></id><%
			%><domain><%= jail.domainId %></domain><%

			%><users><%
				var accessManager = jail.accessManager;
				var groupSupervisors = accessManager.getGroup("def.supervisor", true);
				for each(var user in groupSupervisors.getUsers()){
					= Format.xmlElement('user',{
						id : user.key,
						login : user.login,
						email : !user.email || user.email.endsWith("=-") ? undefined : user.email,
						touched : (new Date(user.changed)).toISOString(),
					});
				}
			%></users><%
			
			%><shares><%
				var shares = jail.getSharings();
				for each(var share in shares){
					if(jail.checkAllowedShare(share.key)){
						= Format.xmlElement('share', Layouts.extend(share, {
							hl : false,
							excluded : false,
						}));
					}
				}
				for each(var share in shares){
					if(!jail.checkAllowedShare(share.key)){
						= Format.xmlElement('share', Layouts.extend(share, {
							hl : "error",
							excluded : true,
						}));
					}
				}
			%></shares><%
			
			= Format.xmlElement('objectCounts', { 
				src : '../jails/jailStorageObjectCounts?' + Format.queryStringParameters({
					id : jailName,
				})
			});

			= Format.xmlElement('extrasStats', { 
				src : '../jails/jailStorageExtrasStats?' + Format.queryStringParameters({
					id : jailName,
				})
			});

			= Format.xmlElement('objectsStats', { 
				src : '../jails/jailStorageObjectsStats?' + Format.queryStringParameters({
					id : jailName,
				})
			});

			/*
			= Format.xmlElement('orders', { 
				src : '../orders/listOrders?' + Format.queryStringParameters({
					product : product.key,
				})
			});
			
			= helpElement;
			*/
		%></jail><%
	}
	return {
		layout	: "xml",
		xsl		: xsl,
		content	: xml
	};
}

module.exports = runReadJail;
