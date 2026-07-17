/**
 * this must be bint to XmlSkinHelper instance
 */

const FiltersFormLayout = require("./FiltersFormLayout");
const reduceDataViewGridPdf = require("./ReduceDataViewGridPdfFn");
const reduceDataViewGridTxt = require("./ReduceDataViewGridTxtFn");
const reduceDataViewGridHtml = require("./ReduceDataViewGridHtmlFn");
const reduceDataViewGridXls = require("./ReduceDataViewGridXlsFn");
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
	 * XML+XSL builder below already produces the correct pure-XML reply directly. "pdf"/"txt"/
	 * "html"/"xls" each route to their own real reduction (2-column grid of primitives,
	 * deliberately NOT shared between formats - see each ReduceDataViewGrid*Fn.js's own header
	 * for why) that PdfTargetContext/TextTargetContext/HtmlDomTargetContext/XlsTargetContext
	 * already render natively via their own getLayoutForContext(), no per-format require()
	 * module needed - "xls" now has a real, registered output target too
	 * (ae3.sys.pkg.l2.tgt.xls's WebContextXls/xls.json), not just this redirect. */
	if(query?.parameters.___output){
		switch(query.parameters.___output){
		case "pdf":
			return reduceDataViewGridPdf(layout);
		case "txt":
			return reduceDataViewGridTxt(layout);
		case "html":
			return reduceDataViewGridHtml(layout);
		case "xls":
			return reduceDataViewGridXls(layout);
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
