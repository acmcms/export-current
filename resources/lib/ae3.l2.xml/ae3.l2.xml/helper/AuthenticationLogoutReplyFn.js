/**
 * this must be bint to XmlSkinHelper instance
 */

const formatXmlAttribute = Format.xmlAttribute;
const formatXmlElement = Format.xmlElement;
const formatXmlNodeValue = Format.xmlNodeValue;

/**
 * 
 * @param context
 * @returns
 */
function buildAuthenticationLogoutReply(context){
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
						%>alert("Authentication credentials invalidated!");<%
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
		var url = "//" + query.targetExact + "/";
		var xml;
		$output(xml){
			%><authentication-logout<%= formatXmlAttribute("title", context.title || "Log-Out") %>><%
				= formatXmlElement("client", context.share.clientElementProperties(context));
				%><redirect><%= formatXmlNodeValue(url) %></redirect><%
			%></authentication-logout><%
		}
		return {
			layout	: "xml",
			xsl	: "/!/skin/skin-standard-xml/showAuth.xsl",
			content	: xml,
			cache : false
		};
	}
	default{
		throw "Invalid format requested: " + parameters.___output;
	}
	}
}

module.exports = buildAuthenticationLogoutReply;
