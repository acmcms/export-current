/**
 * this must be bint to XmlSkinHelper instance
 */

const FiltersFormLayout = require("./FiltersFormLayout");
const reduceDataViewGrid = require("./ReduceDataViewGridFn");
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
	/** ae3/xml, ae3/xls, ae3/txt, ae3/pdf were never implemented - this redirect always threw
	 * "Not a function" for any explicit ___output matching one of these (see MakeMessageReplyFn.js
	 * for the same bug, found and disabled there first). "xml" needs no redirect at all - the
	 * XML+XSL builder below already produces the correct pure-XML reply directly. "pdf"/"txt" now
	 * route to a real reduction (2-column grid of primitives) that PdfTargetContext/TextTargetContext
	 * already render natively via their own getLayoutForContext(), no per-format module needed.
	 * "xls" has no registered output target/renderer at all yet (separate, larger, deferred task -
	 * not just this redirect) so it still falls through to the XML+XSL builder below. */
	if(query?.parameters.___output){
		switch(query.parameters.___output){
		case "pdf":
		case "txt":
			return reduceDataViewGrid(layout);
		}
	}

	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = "view";
	const filters = layout.filters ?? context.layoutFilters;
	const element = layout.rootName || "view";
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	:	"<" + element + formatXmlAttributes(attributes || {}) + ">" + 
					(query && formatXmlElement("client", context.share.clientElementProperties(context)) || "") +
					makeDataViewFragment.call(
						this,
						context,
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

function makeDataViewFragment(context, query, layout, extraCommands){
	const fields = layout.fields;
	if(!fields){
		throw new Error("Field definition is required!");
	}
	const fieldCount = fields.length;
	if(!fieldCount){
		throw new Error("Field definition is empty!");
	}

	const filters = layout.filters ?? context.layoutFilters;

	const formatFull = query && query.parameters.format !== "clean";
	
	var xml = "";
	$output(xml){
		
		if(formatFull){
			
			if(layout.prefix){
				= this.internOutputValue("prefix", layout.prefix);
			}
			if(filters?.fields){
				= formatXmlElement("prefix", new FiltersFormLayout(filters));
			}
			
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
			
			if(formatFull){
				
				if(layout.help && (!query || query.parameters.format !== "clean")){
					= formatXmlElement("help", { src : layout.help });
				}
			
			}
			
		%></fields><%
		
		if("object" === typeof layout.values){
			for(var valueKey in layout.values){
				= this.internOutputValue(valueKey, layout.values[valueKey]);
			}
		}
		
		if(formatFull){
			
			if(layout.suffix){
				= this.internOutputValue("suffix", layout.suffix);
			}
			
		}
	}
	return xml;
}

module.exports = makeDataViewReply;
