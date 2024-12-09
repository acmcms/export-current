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
 * -rootName : "list",
 * 	columns: [
 * 	],
 * 	rows: function(i)/arrayOfArrays/arrayOfMaps,
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeDataTableReply(context, layout){
	const query = context?.query;
	if(query?.parameters.___output){
		switch(query.parameters.___output){
		case "xml":
			return require("ae3/xml").makeDataTableReply(query, layout);
		case "xls":
			return require("ae3/xls").makeDataTableReply(query, layout);
		case "txt":
			return require("ae3/txt").makeDataTableReply(query, layout);
		case "pdf":
			return require("ae3/pdf").makeDataTableReply(query, layout);
		case "html":
			return require("ae3/html").makeDataTableReply(query, layout);
		case "csv":
			return require("ae3/csv").makeDataTableReply(query, layout);
		}
	}

	const columns = layout.columns;
	if(!columns){
		throw new Error("Column definition is required!");
	}
	const columnCount = columns.length;
	if(!columnCount){
		throw new Error("Column definition is empty!");
	}

	const attributes = layout.attributes ? Object.create(layout.attributes) : {};
	attributes.layout = "list";
	
	const rows = layout.rows || [];
	const rowCount = rows.length;
	
	const formats = [];

	const filters = layout.filters;
	
	const element = layout.rootName || "list";

	var xml = "", c, column, cn, r, row, item = {}, /* more, */format;
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
			if(filters && filters.fields){
				= formatXmlElement("prefix", new FiltersFormLayout(filters));
			}
			%><columns><%
				for(c = 0; c < columnCount; ++c){
					column = columns[c];
					= formatXmlElement("column", this.internReplaceField(null, false, column));
					// item[column.id] = true;
					switch(column.variant){
					case "list":
						formats[c] = formatterPlain;
						break;
					case "view":
						formats[c] = formatterPlain;
						break;
					case "select":
						formats[c] = formatterPlain;
						break;
					case "date":
						formats[c] = formatterDate;
						break;
					default:
						formats[c] = formatterPlain;
					}
				}
				
				/**
				 * commands and extra fields for commands
				 */
				for(c in layout.rowCommands){
					/**
					 * 
					cn = c.field;
					if(!item[cn]){
						(more ||= []).push(cn);
					}
					 */
					= formatXmlElement("command", c);
				}
			%></columns><%
			
			for(r = 0; r < rowCount; ++r){
				= formatXmlElement("item", rows[r]);
				/**
				 * all columns required for commands and links
				 * 
				row = rows[r];
				for(c = 0; c < columnCount; ++c){
					column = columns[c];
					cn = column.id;
					item[cn] = formats[c](row[cn], column, row);
				}
				for(cn in more){
					item[cn] = row[cn];
				}
				= formatXmlElement("item", item);
				*/
			}
			
			if(layout.commands){
				= formatXmlElements("command", layout.commands);
			}
			if(query && !query.parameters.___output){
				const suffix = formatQueryStringParameters(filters && "object" === typeof filters.values && filters.values || query.parameters, { format : undefined });
				const commands = [
					{
						title : "Download as XLS",
						icon : "page_white_excel",
						url : "?___output=xls&" + suffix
					},
					{
						title : "Download as PDF",
						icon : "page_white_acrobat",
						url : "?___output=pdf&" + suffix
					},
					{
						title : "Download as HTML",
						icon : "page_world",
						url : "?___output=html&" + suffix
					},
					{
						title : "Download as CSV",
						icon : "page_white_text",
						url : "?___output=csv&" + suffix
					}
				];
				if(query.parameters.format === "clean" || query.verb !== "POST"){
					commands.push({
						title : "Open as Listing Page",
						icon : "world_link",
						url : "?" + suffix,
						target : "_blank"
					});
				}
				// Request.modifyQueryStringParameter(url, "format", "xls" )
				= formatXmlElement("command", {
					title : "Download",
					titleShort : new String(""),
					icon : "images",
					group : {
						command : commands
					}
				});
			}
			if(layout.help && (!query || query.parameters.format !== "clean")){
				= formatXmlElement("help", { src : layout.help });
			}
			if(layout.suffix){
				= this.internOutputValue("suffix", layout.suffix);
			}
			if(layout.next && layout.next.uri){
				= formatXmlElement("next", layout.next);
			}
		%></<%= element; %>><%
	}
	return {
		layout	: "xml",
		xsl	: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml
	};
}

function formatterDate(v/*, column, row*/){
	return v.toISOString();
}

function formatterPlain(v/*, column, row*/){
	return v;
}

module.exports = makeDataTableReply;
