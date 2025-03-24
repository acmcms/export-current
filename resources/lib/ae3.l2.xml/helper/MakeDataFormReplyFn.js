/**
 * this must be bint to XmlSkinHelper instance
 */

const FiltersFormLayout = require("./FiltersFormLayout");
const formatXmlAttributes = Format.xmlAttributes;
const formatXmlElement = Format.xmlElement;
const formatXmlElements = Format.xmlElements;
const formatQueryStringParameters = Format.queryStringParameters;

/**
 * <code>
 * layout = {
 * -rootName : "form",
 * 	fields: [
 * 	],
 * 	values: {
 * 	},
 * 	commands: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeDataFormReply(context, layout){
	const query = context?.query;
	if(query?.parameters.___output){
		switch(query.parameters.___output){
		case "xml":
			return require("ae3/xml").makeDataFormReply(query, layout);
		case "xls":
			return require("ae3/xls").makeDataViewReply(query, layout);
		case "txt":
			return require("ae3/txt").makeDataViewReply(query, layout);
		case "pdf":
			return require("ae3/pdf").makeDataViewReply(query, layout);
		}
	}

	const fields = layout.fields;
	if(!fields){
		throw new Error("Field definition is required!");
	}
	const fieldCount = fields.length;
	if(!fieldCount){
		throw new Error("Field definition is empty!");
	}

	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = "form";
	
	const filters = layout.filters;
	
	const element = layout.rootName || "form";

	var xml = "";
	$output(xml){
		%><<%= element; %><%= formatXmlAttributes(attributes); %>><%
			if(query){
				= formatXmlElement("client", context.share.clientElementProperties(context));
				if(context.rawHtmlHeadData){
					%><rawHeadData><%
						%><![CDATA[<%
							= context.rawHtmlHeadData;
						%>]]><%
					%></rawHeadData><%
				}
			}
			if(layout.prefix){
				= this.internOutputValue("prefix", layout.prefix);
			}
			if(filters?.fields){
				= formatXmlElement("prefix", new FiltersFormLayout(filters));
			}
			%><fields><%
				for(var field of layout.fields){
					= formatXmlElement("field", this.internReplaceField(layout.values, true, field));
				}
				if(layout.commands || layout.submit){
					= formatXmlElements("command", layout.commands);
					= formatXmlElements("submit", layout.submit);
				}else//
				if(false && query && !query.parameters.___output){
					// Request.modifyQueryStringParameter(url, "format", "xls" )
					= formatXmlElement("command", {
						title : "Download as XLS",
						icon : "disk",
						url : "?___output=xls&" + formatQueryStringParameters(filters?.values)
					});
				}
				if(layout.help && (!query || query.parameters.format !== "clean")){
					= formatXmlElement("help", { src : layout.help });
				}
			%></fields><%
			%><values><%
				if("object" === typeof layout.values){
					for(var valueKey in layout.values){
						= this.internOutputValue(valueKey, layout.values[valueKey]);
					}
				}
			%></values><%
			if(layout.suffix){
				= this.internOutputValue("suffix", layout.suffix);
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

module.exports = makeDataFormReply;
