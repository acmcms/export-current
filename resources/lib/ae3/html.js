const ae3 = require('ae3');

function wrapBody(layout, body){
	var html = '', title = layout.title || layout.attributes && layout.attributes.title || undefined;
	$output(html){
		%><html><%
			%><head><%
				if(title){
					%><title><%= Format.xmlNodeValue( title ); %></title><%
				}
			%></head><%
			%><body><%
				if(title){
					%><h1><%= Format.xmlNodeValue( title ); %></h1><%
				}
				= body;
			%></body><%
		%></html><%
	}
	return html;
}


function formatterExact(v, column, row){
	return v;
}

function formatterText(v, column, row){
	return Format.xmlNodeValue(v);
}

function formatterDate(v, column, row){
	// "yyyy-MM-dd HH:mm:ss" ? 
	return Format.dateISO('string' === typeof v ? Date.parse(v) : v);
}

function formatterHref(v, column, row){
	return Format.xmlElement('a', { 
		href : (column.prefix || '') + (row[column.field] || v) + (column.suffix || '') 
	}, v);
}

function formatterPeriod(v, column, row){
	return (+ v) * Number(column.scale || 1) / 1000;
}

function formatterFloating(v, column, row){
	return (+ v) * Number(column.scale || 1);
}



function makeDataTableText(layout){
	const columns = layout.columns;
	if(!columns){
		throw new Error("Column definition is required!");
	}
	const columnCount = columns.length;
	if(!columnCount){
		throw new Error("Column definition is empty!");
	}
	
	var rowIndex = 0;

	const formats = [];

	var html = '', title = layout.title || layout.attributes && layout.attributes.title || undefined;
	$output(html){
		%><html><%
			%><head><%
				if(title){
					%><title><%= Format.xmlNodeValue( title ) %></title><%
				}
			%></head><%
			%><body class="body"><%
				if(title){
					%><h1><%= Format.xmlNodeValue( title ) %></h1><%
				}
				if(layout.filters){
					
				}
				
				%><table border="1"><%
				
					%><tr><%
						var c, column, format;

						%><th>#</th><%

						for(c = 0; c < columnCount; ++c){
							column = columns[c];
							title = column.titleShort || column.title || column.name || column.id;
							switch(column.variant){
							case 'date':
								// "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
								formats[c] = formatterDate.bind(column);
								break;
							case 'link':
								column.base !== undefined || ((columns[c] = Object.create(column)).base = layout.base || null);
								formats[c] = formatterHref.bind(format);
								break;
							case 'floating':
								formats[c] = formatterFloating.bind(format);
								break;
							case 'integer':
							case 'int':
							case 'long':
								formats[c] = formatterExact.bind(format);
								break;
							case 'period':
								formats[c] = formatterPeriod.bind(format);
								break;
							case 'text':
							case 'string':
								formats[c] = formatterText.bind(format);
								break;
							default:
								switch(column.type){
								case 'number':
								case 'boolean':
									formats[c] = formatterExact.bind(format);
									break;
								default:
									formats[c] = formatterText.bind(format);
									break;
								}
							}
							%><th<% 
								= column.title && column.title !== title ? Format.xmlAttribute('title', column.title) : ''; 
							%>><% 
								= Format.xmlNodeValue(title); 
							%></th><%
						}
					
					%></tr><%
					++ rowIndex;
					
	
					const rows = layout.rows || [];
					const rowCount = rows.length;
					
					var r, row;
					for(r = 0; r < rowCount; ++r){
						row = rows[r];
						%><tr><%
							%><td><% = r + 1 ; %></td><%
							for(c = 0; c < columnCount; ++c){
								column = columns[c];
								%><td><% = formats[c](row[column.id], column, row); %></td><%
							}
							++ rowIndex;
						%></tr><%
					}

				%></table><%
				
				
			%></body><%
		%></html><%
	}
	return html;
}

function makeDataTableBinary(layout){
	return ae3.Transfer.createCopierUtf8(makeDataTableText(layout));
}

function makeDataTableReply(query, layout){
	return ae3.Reply.binary('HTML', query, makeDataTableBinary(layout), name + ".html");
}

const HTML = Object.create(Object.prototype, {
	makeDataTableBinary : {
		value : makeDataTableBinary
	},
	makeDataTableText : {
		value : makeDataTableText
	},
	makeDataTableReply : {
		value : makeDataTableReply
	}
});

module.exports = HTML;