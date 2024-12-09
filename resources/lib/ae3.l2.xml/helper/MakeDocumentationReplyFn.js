/**
 * this must be bint to XmlSkinHelper instance
 */

const formatXmlAttributes = Format.xmlAttributes;
const formatXmlElement = Format.xmlElement;
const formatQueryStringParameters = Format.queryStringParameters;

/**
 * <code>
 * layout = {
 * -rootName : "documentation",
 * 	elements: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeDocumentationReply(context, layout){
	const query = context?.query;
	if(query?.parameters.___output === "xls"){
		throw "No XLS support for 'documentation' layout.";
		return require("ae3/xls").makeDataViewReply(query, layout);
	}
	
	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = "documentation";
	const element = layout.rootName || "documentation";
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	:	"<" + element + formatXmlAttributes(attributes || {}) + ">" + 
					(query && formatXmlElement("client", context.share.clientElementProperties(context)) || "") +
					makeDocumentationFragment(
						layout, 
						false && query && !query.parameters.___output && formatXmlElement("command", {
							title : "Download as PDF",
							icon : "disk",
							url : "?___output=pdf&" + formatQueryStringParameters(filters && "object" === typeof filters.values && filters.values)
						})
					) +
					"</" + element + ">"
	};
}

function makeDocumentationFragment(layout, extraCommands){
	const elements = layout.elements;
	if(!elements){
		throw new Error("Documant 'elements' array is required!");
	}
	var xml = "";
	$output(xml){
		if(layout.prefix){
			= this.internOutputValue("prefix", layout.prefix);
		}
		if(elements){
			for(var element of Array(elements)){
				if(element) {
					= this.internOutputValue(element.disposition || "element", element);
					// = formatXmlElement(element.disposition || "element", element);
				}
			}
		}
		if(layout.help){
			= formatXmlElement("help", { src : layout.help });
		}
	}
	return xml;
}

module.exports = makeDocumentationReply;
