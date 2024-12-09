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
 * -rootName : "view",
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
function makeDataViewReply(context, layout){
	const query = context?.query;
	if(query?.parameters.___output){
		switch(query.parameters.___output){
		case "xml":
			return require("ae3/xml").makeDataViewReply(query, layout);
		case "xls":
			return require("ae3/xls").makeDataViewReply(query, layout);
		case "txt":
			return require("ae3/txt").makeDataViewReply(query, layout);
		case "pdf":
			return require("ae3/pdf").makeDataViewReply(query, layout);
		}
	}
	
	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = "view";
	const filters = layout.filters;
	const element = layout.rootName || "view";
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	:	"<" + element + formatXmlAttributes(attributes || {}) + ">" + 
					(query && formatXmlElement("client", context.share.clientElementProperties(context)) || "") +
					makeDataViewFragment.call(
						this,
						query,
						layout, 
						query && !query.parameters.___output && query.parameters.___all && formatXmlElement("command", {
							title : "Download as XLS",
							icon : "disk",
							url : "?___output=xls&" + formatQueryStringParameters(filters && filters.values)
						})
					) +
					"</" + element + ">"
	};
}

function makeDataViewFragment(query, layout, extraCommands){
	const fields = layout.fields;
	if(!fields){
		throw new Error("Field definition is required!");
	}
	const fieldCount = fields.length;
	if(!fieldCount){
		throw new Error("Field definition is empty!");
	}

	const filters = layout.filters;
	
	var xml = "";
	$output(xml){
		if(layout.prefix){
			= this.internOutputValue("prefix", layout.prefix);
		}
		if(filters && filters.fields){
			= formatXmlElement("prefix", new FiltersFormLayout(filters));
		}
		%><fields><%
			for(var field of layout.fields){
				= formatXmlElement("field", this.internReplaceField(layout.values, false, field));
			}
			if(extraCommands){
				= extraCommands;
			}
			if(layout.commands){
				= formatXmlElements("command", layout.commands);
			}
			if(layout.help && (!query || query.parameters.format !== "clean")){
				= formatXmlElement("help", { src : layout.help });
			}
		%></fields><%
		if("object" === typeof layout.values){
			for(var valueKey in layout.values){
				= this.internOutputValue(valueKey, layout.values[valueKey]);
			}
		}
		if(layout.suffix){
			= this.internOutputValue("suffix", layout.suffix);
		}
	}
	return xml;
}

module.exports = makeDataViewReply;
