/**
 * 
 * Just a corpse to get some code from
 * 
 */



var ServerDomain = require("java.class/ru.myx.srv.acm.ServerDomain");
var JailsAPI = require('./Jails');


function handleShowShares(context){
	const query = context.query;
	const client = auth.requireQuery(query);
	var xml;
	$output(xml){
		%><report title="Shares by Jails"><%
			var jails = ServerDomain.KNOWN_JAILS_SEALED;
			for each(var i in Object.keys(jails)){
				var jail = jails[i];
				%><jail id="<%= i %>"><%
					try{
						var shares = jail.getSharings();
						for each(var j in shares){
							%><share id="<%= j.key %>" path="<%= j.path %>"/><%
						}
					}catch(e){
						%><error><%= Format.xmlNodeValue(e) %></error><%
					}
				%></jail><%
			}
		%></report><%
	}
	return {
		layout	: "xml",
		xsl		: "/resource/showShares.xsl",
		content	: xml
	};
}

function handleShowStorage(context){
	const query = context.query;
	const client = auth.requireQuery(query);
	var xml;
	$output(xml){
		%><report title="Storage by Jails"><%
			var jails = ServerDomain.KNOWN_JAILS_SEALED;
			for each(var i in Object.keys(jails)){
				var jail = jails[i];
				%><jail id="<%= i %>"><%
					try{
						var storage = jail.rootContext.Storage;
						if(storage){
							%><storage id="<%= storage.key %>"><%
							%></storage><%
						}
					}catch(e){
						%><error><%= Format.xmlNodeValue(e) %></error><%
					}
				%></jail><%
			}
		%></report><%
	}
	return {
		layout	: "xml",
		xsl		: "/resource/showStorage.xsl",
		content	: xml
	};
}
