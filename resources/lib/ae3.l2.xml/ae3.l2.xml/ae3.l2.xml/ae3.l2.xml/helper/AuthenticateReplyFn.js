/**
 * this must be bint to XmlSkinHelper instance
 */

const formatXmlAttribute = Format.xmlAttribute;
const formatXmlElement = Format.xmlElement;

/**
 * 
 * @param context
 * @returns
 */
function buildAuthenticateReply(context){
	const query = context.query;
	const parameters = query.parameters;
	switch(parameters.___output || "xml"){
	case "html-js":{
		var html = "";
		$output(html){
			%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><%
			%><html><%
				%><head><%
					%><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><%
					%><script><%
						%>alert("Authentication required!");<%
					%></script><%
				%></head><%
				%><body/><%
			%></html><%
		}
		return {
			layout	: "html",
			content	: html
		};
	}
	case "json":{
	}
	case "xml":{
		var url = query.url;
		var xml;
		$output(xml){
			%><authenticate<%= formatXmlAttribute("title", context.title || message) %> layout="menu" zoom="document"><%
				= formatXmlElement("client", context.share.clientElementProperties(context));
				if(query.attributes["Secure"] !== "true" && url.startsWith("http://")){
					%><message><%
						%>This service requires all clients to sign-in. Encrypted communication required to proceed.<%
					%></message><%
				}else{
					%><message><%
						%>This service requires all clients to sign-in.<%
					%></message><%
				}
				= internMakeLoginOptions(query, Index);
			%></authenticate><%
		}
		return {
			layout : "xml",
			xsl : "/!/skin/skin-standard-xml/show.xsl",
			content : xml,
			cache : false
		};
	}
	default{
		throw "Invalid format requested: " + parameters.___output;
	}
	}
}

module.exports = buildAuthenticateReply;
