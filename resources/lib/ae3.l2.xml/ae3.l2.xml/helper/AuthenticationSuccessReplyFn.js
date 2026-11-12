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
function buildAuthenticationSuccessReply(context){
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
						%>alert("Authentication success!");<%
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
		return {
			layout : "final",
			contentType : "text/json",
			content : formatJsObject({
				layout : "message",
				message : "Autentication success!"
			})
		};
	}
	case "xml":{
		var xml;
		$output(xml){
			%><authentication-success<%= formatXmlAttribute("title", context.title || "Authentication Success") %>><%
				= formatXmlElement("client", context.share.clientElementProperties(context));
			%></authentication-success><%
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

module.exports = buildAuthenticationSuccessReply;
