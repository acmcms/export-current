/**
 * this must be bint to XmlSkinHelper instance
 */

const formatJsObject = Format.jsObject;
const formatXmlAttribute = Format.xmlAttribute;
const formatXmlElement = Format.xmlElement;

/**
 * 
 * @param context
 * @returns
 */
function buildAuthenticationFailedReply(context){
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
						%>alert("Authentication failed!");<%
					%></script><%
				%></head><%
				%><body/><%
			%></html><%
		}
		return {
			layout	: "html",
			code : 403,
			content	: html
		};
	}
	case "json":{
		return {
			layout : "final",
			code : 403,
			contentType : "text/json",
			content : formatJsObject({
				layout : "message",
				code : "403",
				message : "Autentication failed!"
			})
		};
	}
	case "xml":{
		var xml;
		$output(xml){
			%><authentication-failed<%= formatXmlAttribute("title", context.title || "Authentication failed") %> layout="menu" zoom="document"><%
				= formatXmlElement("client", context.share.clientElementProperties(context));
				%><message><%
					%>This service requires all clients to sign-in. There was an authentication failure.<%
				%></message><%
				= internMakeLoginOptions(query, Index);
				// <command key="/?login" icon="arrow_refresh" title="Login / Retry"/>
			%></authentication-failed><%
		}
		return {
			layout	: "xml",
			code : 403,
			xsl	: "/!/skin/skin-standard-xml/show.xsl",
			content	: xml,
			cache : false
		};
	}
	default{
		throw "Invalid format requested: " + parameters.___output;
	}
	}
}

module.exports = buildAuthenticationFailedReply;
