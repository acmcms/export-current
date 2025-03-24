const lib = require("ru.myx.acm.iface/AcmWebService");
const ServerDomain = require("java.class/ru.myx.srv.acm.ServerDomain");


function executeQueryOnJail(context, title, jailName, sql, types, params){
	const share = context.share;
	const client = share.authRequireAccount(context, "admin");
	const query = context.query;

	if(!jailName){
		return {
			layout	: "xml",
			xsl		: "/!/skin/skin-standard-xml/showState.xsl",
			content	: Format.xmlElement("failed", {reason:"jail ('"+jailName+"' is unknown)"})
		};
	}
	var jail = ServerDomain.KNOWN_JAILS_SEALED[jailName];
	if(!jail){
		return {
			layout	: "xml",
			xsl		: "/!/skin/skin-standard-xml/showState.xsl",
			content	: Format.xmlElement("failed", {reason:"jail ('"+jailName+"' is unknown)"})
		};
	}
	
	var stats;
	{
		var connection = jail.connections["default"].nextElement();
		try{
			stats = require("ru.acmcms/dbi").executeSelectAll(connection, sql);
		}finally{
			try{
				connection.close();
			}catch(e){
				// ignore
			}
		}
	}
	
	const columns = [];
	if(stats?.length){
		var example = stats[0];
		for each(var key in Object.keys(example)){
			if(key == Number(key)){
				continue;
			}
			columns.push({
				id : key,
				title : key,
				variant : types?.[key],
				prefix : params?.[key]
			});
		}
	}
	
	return {
		layout : "data-table",
		attributes : {
			title : "Jail: " + jailName + ", " + title,
			cssId : "list"
		},
		columns : columns,
		rows : stats
	};
}

module.exports.executeQueryOnJail = executeQueryOnJail;


function handleSelectJail(context){
	const share = context.share;
	const client = share.authRequireAccount(context, "admin");
	const query = context.query;

	var xml;
	$output(xml){
		%><form title="Plese select the jail"><%
			= Format.xmlElement("client", share.clientElementProperties(context));
			%><field name="id" title="Jail" type="select" value="<%= client %>"><%
				var jails = ServerDomain.KNOWN_JAILS_SEALED;
				var jailNames = Object.keys(jails);
				jailNames.sort();
				for each(var i in jailNames){
					var jail = jails[i];
					= Format.xmlElement("option", {
						value : i,
						title : jail.domainId + " (" + i + ")"
					});
				}
			%></field><%
			%><help src="resource/documentation.xml#selectJail" /><%
			%><submit title="Select jail..." /><%
		%></form><%
	}
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

module.exports.handleSelectJail = handleSelectJail;