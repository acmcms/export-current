/**
 * this must be bint to XmlSkinHelper instance
 */

const FiltersFormLayout = require("./FiltersFormLayout");
const formatXmlAttributes = Format.xmlAttributes;
const formatXmlElement = Format.xmlElement;
const formatXmlElements = Format.xmlElements;
const formatXmlNodeValue = Format.xmlNodeValue;
const formatXmlAttributeFragment = Format.xmlAttributeFragment;

function internMakeDocumentAttributes(layout, title /* locals: */, attributes){
	if("string" === typeof title){
		if("object" === typeof layout.attributes){
			attributes = Object.create(layout.attributes);
			attributes.title = title;
			attributes["x-xml-debug"] = "message-attributes-object";
			return attributes;
		}
		attributes = Object.create(layout);
		attributes.title = title;
		attributes.reason = undefined;
		attributes.message = undefined;
		attributes.detail = undefined;
		attributes.help = undefined;
		attributes["x-xml-debug"] = "message-basic";
		return attributes;
	}
	if("object" === typeof layout.attributes){
		attributes = Object.assign(Object.create(layout.attributes), title)
		attributes["x-xml-debug"] = "message-attributes-title-object";
		return attributes;
	}
	if(false && "message" === layout.layout){
		attributes = Object.create(layout);
		attributes.title = title;
		attributes["x-xml-debug"] = "message-layout";
		return attributes;
	}
	attributes = Object.create(title);
	attributes["x-xml-debug"] = "message-title-object";
	return attributes;
}

function makeMessageReply(context, layout){
	const query = context?.query;
	if(false && query?.parameters.___output){
		switch(query.parameters.___output){
		case "xml":
			return require("ae3/xml").makeMessageReply(query, layout);
		case "xls":
			return require("ae3/xls").makeMessageReply(query, layout);
		case "txt":
			return require("ae3/txt").makeMessageReply(query, layout);
		case "pdf":
			return require("ae3/pdf").makeMessageReply(query, layout);
		}
	}

	layout = this.internUiMessageEnrich(layout);
	
	const code = layout.code;
	
	const element = layout.rootName || "message";
	
	var message = layout.message;
	var reason = layout.reason;
	
	const title = layout.title || context.title || context.share?.systemName || "Message";
	const detail = layout.detail;
	
	const attributes = internMakeDocumentAttributes(layout, title);
	attributes.hl = layout.hl;
	attributes.code = layout.code;
	attributes.zoom = layout.zoom;
	attributes.icon = layout.icon;
	attributes.layout = "message";

	const filters = layout.filters ?? message?.filters ?? context.layoutFilters;
	
	const formatFull = query && query.parameters.format !== "clean" && !layout.clean && context.client?.uiFormat !== "clean";

	var xml = "";
	$output(xml){
		%><<%= element; %><%= formatXmlAttributes(attributes); %>><%
		
			if(context.share){
				= formatXmlElement("client", context.share.clientElementProperties(context));
				if(formatFull && context.rawHtmlHeadData){
					%><rawHeadData><%
						%><![CDATA[<%
							= context.rawHtmlHeadData;
						%>]]><%
					%></rawHeadData><%
				}
			}
			
			if(formatFull){
				
				if(layout.prefix){
					= this.internOutputValue("prefix", layout.prefix);
				}
				
				if(filters?.fields){
					= formatXmlElement("prefix", new FiltersFormLayout(filters));
				}
				
			}
			
			%><reason><%= formatXmlNodeValue(reason ? (reason.title || reason) : "Unclassified message.") %></reason><%
			
			if(message && message !== reason){
				if("string" === typeof message){
					%><message debug="x-string" class="code style--block"><%= formatXmlNodeValue(message) %></message><%
				}else //
				if(message.layout){
					= formatXmlElements("message", message);
					// = this.internOutputValue("message", message);
				}else{
					%><message debug="x-non-layout" class="code style--block"><%= formatXmlNodeValue(Format.jsDescribe(message)) %></message><%
				}
			}
			
			if(detail && (formatFull || (layout.zoom !== "compact" && detail.layout))){
				if("string" === typeof detail){
					%><detail debug="x-string" class="code style--block"><%= formatXmlNodeValue(detail) %></detail><%
				}else //
				if(detail.layout){
					= formatXmlElements("detail", detail);
					// = this.internOutputValue("detail", detail);
				}else{
					%><detail debug="x-non-layout" class="code style--block"><%= formatXmlNodeValue(Format.jsDescribe(detail)) %></detail><%
				}
			}
			
			if(formatFull){
				
				if(layout.help || message?.help){
					%><help src="<%= formatXmlAttributeFragment(layout.help || message?.help) %>"/><%
				}
				
			}
			
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		code	: code,
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml,
		cache	: layout.cache,
		delay	: layout.delay
	};
}

module.exports = makeMessageReply;
