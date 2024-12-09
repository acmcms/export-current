/**
 * this must be bint to XmlSkinHelper instance
 */

const FiltersFormLayout = require("./FiltersFormLayout");
const formatXmlAttributes = Format.xmlAttributes;
const formatXmlElement = Format.xmlElement;
const formatXmlNodeValue = Format.xmlNodeValue;
const formatXmlAttributeFragment = Format.xmlAttributeFragment;

function makeMessageReply(context, layout){
	const code = layout.code;
	
	var element = layout.rootName;
	var hl = layout.hl;
	var icon = layout.icon;
	
	var message = layout.message || layout.content;
	var reason = layout.reason || (message && (message.reason || message.title));
	
	
	if(code && !(hl || icon) && (code^0 === code)){
		switch(code){
		case 400:{
			hl ??= "error";
			icon ??= "stop";
			element ||= "invalid";
			reason ||= "Invalid Request";
			message ??= "Some of request arguments or format are unacceptable, out of range or malformed.";
			break;
		}
		case 403:{
			hl ??= "error";
			icon ??= "delete";
			element ||= "denied";
			reason ||= "Access Denied";
			message ??= "The account is not granted with permission to execute the operation requested.";
			break;
		}
		case 404:{
			hl ??= "error";
			icon ??= "error_delete";
			element ||= "failed";
			reason ||= "Resource Not Found";
			message ??= "The client request references to resource that cannot be found or identified. Please, check the URL and other parameters of your request or contact an administrator if you believe that request is correct.";
			break;
		}
		case 500:{
			hl ??= "error";
			icon ??= "exclamation";
			element ||= "failed";
			reason ||= "Internal Server Failure";
			message ??= "The server encountered an internal problem while trying to satisfy the client request. Please, contact the administrator if you are concerned or if problem persists.";
			break;
		}
		default:{
			switch((code / 100)^0){
			case 2:{
				hl ??= "true";
				icon ??= "tick";
				element ||= "updated";
				reason ||= "Operation Successful";
				message ??= "The request seems to be satisfied with no further detail provided.";
				break;
			}
			case 4:{
				hl ??= "error";
				icon ??= "error_delete";
				element ||= "failed";
				reason ||= "Unclassified Client Failure";
				message ??= "The client request is not considered valid and will not be served.";
				break;
			}
			case 5:{
				hl ??= "error";
				icon ??= "exclamation";
				element ||= "failed";
				reason ||= "Unclassified Server Failure";
				message ??= "The server encountered an unsolvable problem while trying to satisfy the client request.";
				break;
			}
			}
		}
		}
	}
	
	element ||= "message";
	reason ||= ("string" === typeof message && message) || layout.title;
	
	const title = layout.title || context.title || (context.share || "").systemName || "Message";
	const detail = layout.detail;
	
	const filters = layout.filters || (message||"").filters;
	
	var xml = "";
	$output(xml){
		%><<%= element; = "string" === typeof title 
			? formatXmlAttributes({
				title : title,
				code : code,
				icon : icon,
				hl : hl,
				zoom : layout.zoom
			})
			: formatXmlAttributes(Object.create(title, {
				code : {
					value : code,
					enumerable : true
				},
				icon : {
					value : icon,
					enumerable : true
				},
				hl : {
					value : hl,
					enumerable : true
				}
			}));
		 %> layout="message"<%
		%>><%
			if(context.share){
				= formatXmlElement("client", context.share.clientElementProperties(context));
			}
			if(filters && filters.fields){
				= formatXmlElement("prefix", new FiltersFormLayout(filters));
			}
			%><reason><%= formatXmlNodeValue(reason ? (reason.title || reason) : "Unclassified message.") %></reason><%
			if(message && message !== reason){
				if("string" === typeof message){
					%><message class="code style--block"><%= formatXmlNodeValue(message) %></message><%
				}else //
				if(message.layout){
					= this.internOutputValue("message", message || reason);
				}
			}
			if(detail){
				if("string" === typeof detail){
					%><detail class="code style--block"><%= formatXmlNodeValue(detail) %></detail><%
				}else{
					= this.internOutputValue("detail", detail);
				}
			}
			if((layout.help || message && message.help) && context.query.parameters.format !== "clean"){
				%><help src="<%= formatXmlAttributeFragment(layout.help || message.help) %>"/><%
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		code	: code,
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml,
		cache	: message.cache,
		delay	: message.delay
	};
}

module.exports = makeMessageReply;
