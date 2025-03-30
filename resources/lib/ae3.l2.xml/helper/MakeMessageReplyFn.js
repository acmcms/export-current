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
	
	var element = layout.rootName || "message";
	
	var message = layout.message || layout.content;
	var reason = layout.reason || message?.reason || message?.title || ("string" === typeof message && message) || layout.title;
	
	const title = layout.title || context.title || context.share?.systemName || "Message";
	const detail = layout.detail;
	
	const attributes = "string" === typeof title
		? Object.create(layout.attributes ?? null, {
			title : {
				value : title,
				enumerable : true
			},
			code : {
				value : code,
				enumerable : true
			},
			icon : {
				value : layout.icon,
				enumerable : true
			},
			hl : {
				value : layout.hl,
				enumerable : true
			},
			zoom : {
				value : layout.zoom,
				enumerable : true
			}
		})
		: Object.create(title, {
			code : {
				value : code,
				enumerable : true
			},
			icon : {
				value : layout.icon,
				enumerable : true
			},
			hl : {
				value : layout.hl,
				enumerable : true
			}
		})
	;

	const filters = layout.filters ?? message?.filters ?? context.layoutFilters;
	
	const formatFull = query && query.parameters.format !== "clean" && !layout.clean && context.client?.uiFormat !== "clean";

	var xml = "";
	$output(xml){
		%><<%= element; %><%= formatXmlAttributes(attributes); %> layout="message"><%
		
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
					%><message class="code style--block"><%= formatXmlNodeValue(message) %></message><%
				}else //
				if(message.layout){
					= this.internOutputValue("message", message || reason);
				}
			}
			
			if(formatFull){
				
				if(detail){
					if("string" === typeof detail){
						%><detail class="code style--block"><%= formatXmlNodeValue(detail) %></detail><%
					}else{
						= this.internOutputValue("detail", detail);
					}
				}
				
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
		cache	: message.cache,
		delay	: message.delay
	};
}

module.exports = makeMessageReply;
