/**
 * this must be bint to XmlSkinHelper instance
 */

const FiltersFormLayout = require("./FiltersFormLayout");
const formatXmlAttributes = Format.xmlAttributes;
const formatXmlElement = Format.xmlElement;
const formatXmlElements = Format.xmlElements;
const formatXmlNodeValue = Format.xmlNodeValue;

/**
 * <code>
 * layout = {
 * -rootName : "sequence",
 * 	options: [
 * 	],
 * 	commands: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeSelectViewReply(context, layout){
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
	
	const options = layout.options;
	if(!options){
		throw new Error("Options are required!");
	}
	const optionCount = options.length;
	if(!optionCount){
		throw new Error("Options are empty!");
	}
	
	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = "select-view";
	
	const filters = layout.filters;
	
	const element = layout.rootName || "sequence";
	
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
			if(layout.value){
				%><value><% = formatXmlNodeValue(layout.value); %></value><%
			}
			if(layout.prefix){
				= this.internOutputValue("prefix", layout.prefix);
			}
			if(filters?.fields){
				= formatXmlElement("prefix", new FiltersFormLayout(filters));
			}
			for(var item of layout.options){
				= this.internOutputValue("option", item);
			}
			if(layout.commands){
				= formatXmlElements("command", layout.commands);
			}else//
			if(layout.help && (!query || query.parameters.format !== "clean")){
				= formatXmlElement("help", { src : layout.help });
			}
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

module.exports = makeSelectViewReply;
