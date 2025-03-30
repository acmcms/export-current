/**
 * this must be bint to XmlSkinHelper instance
 */

const FiltersFormLayout = require("./FiltersFormLayout");
const formatXmlAttributes = Format.xmlAttributes;
const formatXmlElement = Format.xmlElement;
const formatXmlElements = Format.xmlElements;
const formatQueryStringParameters = Format.queryStringParameters;



const FMT_DATE = function(v/*, column, row*/){
	return v.toISOString();
};

const FMT_IDENTITY = function(v/*, column, row*/){
	return v;
};

/** bind to XmlSkinHelper instance */
const FMT_INTERN_REPLACE_VALUE = function(v){
	return this.internReplaceValue(v);
};

/** bind to XmlSkinHelper instance */
const FMT_ITEM_INTERN_REPLACE_VALUE = function(name, item){
	return item[name] = this.internReplaceValue(item[name]);
};

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

	const filters = layout.filters ?? context.layoutFilters;
	
	const element = layout.rootName || "list";
	
	const formatFull = query && query.parameters.format !== "clean" && !layout.clean && context.client?.uiFormat !== "clean";

	var xml = "", c, column, cn, r, row, item;
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
			
			%><columns><%
			
				for(c = 0; c < columnCount; ++c){
					column = columns[c];
					= formatXmlElement("column", this.internReplaceField(null, false, column));
					switch(column.variant ?? column.type){
					case "list":
						// formats.push(FMT_IDENTITY.bind(column.id));
						break;
					case "view":
						// formats.push(FMT_IDENTITY.bind(column.id));
						break;
					case "select":
						// formats.push(FMT_IDENTITY.bind(column.id));
						break;
					case "date":
						// formats.push(FMT_DATE.bind(column.id));
						break;
					case "layout":
						formats.push(FMT_ITEM_INTERN_REPLACE_VALUE.bind(this, column.id));
						break;
					default:
						// formats.push(FMT_IDENTITY.bind(column.id));
					}
				}
				
				// commands and extra fields for commands
				for(c of layout.rowCommands){
					= formatXmlElement("command", c);
				}
				
			%></columns><%
			
			if(formats.length){
				for(r = 0; r < rowCount; ++r){
					item = Object.create(rows[r]);
					for(cn of formats){
						cn(item);
					}
					
					/**
					row = rows[r];
					for(c = 0; c < columnCount; ++c){
						column = columns[c];
						cn = column.id;
						item[cn] = formats[c](row[cn], column, row);
					}
					*/
					= formatXmlElement("item", item);
				}
			}else{
				for(r = 0; r < rowCount; ++r){
					= formatXmlElement("item", rows[r]);
				}
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
				if(!formatFull || query.verb !== "POST"){
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
			
			if(formatFull){
				
				if(layout.help){
					= formatXmlElement("help", { src : layout.help });
				}

				if(layout.suffix){
					= this.internOutputValue("suffix", layout.suffix);
				}
				
			}
			
			if(layout.next?.uri){
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

module.exports = makeDataTableReply;
