var ae3 = require('ae3');


function formatterDate(v, column, row){
	// "yyyy-MM-dd HH:mm:ss" ? 
	return Format.dateISO('string' === typeof v ? Date.parse(v) : v);
}

function formatterText(v, column, row){
	if(v === undefined){
		return "";
	}
	return Format.csvString(String(v));
}

function formatterInteger(v, column, row){
	return ((+ v) * Number(column.scale || 1)) | 0;
}

function formatterPeriod(v, column, row){
	return (+ v) * Number(column.scale || 1) / 1000;
}

function formatterFloating(v, column, row){
	return (+ v) * Number(column.scale || 1);
}

function formatterPrice(v, column, row){
	return v;
}

function formatterHref(v, column, row){
	if(v === undefined){
		return "";
	}
	if(true){
		return Format.jsString(String(v));
	}
	var href = (column.prefix || '') + (row[column.field] || v) + (column.suffix || '');
	return Format.csvString(href + ' (' + v + ')' );
}

/**
 * <code>
 * layout = {
 * 	name: 'users' // || 'data'
 * 	columns: [
 * 		{ }
 * 	],
 * 	rows: [
 * 	],
 * }
 * </code>
 * @param layout
 * @returns
 */
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

	var csv = '';
	$output(csv){
		var c, column, format, name, title;
		{
			= '"#"';
		}
		for(c = 0; c < columnCount; ++c){
			column = columns[c];
			name = column.name || column.id;
			title = column.title || name;
			switch(column.variant){
			case 'date':
				// "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
				formats[c] = formatterDate.bind(column);
				break;
			case 'floating':
				formats[c] = formatterFloating.bind(format);
				break;
			case 'integer':
			case 'int':
			case 'long':
				formats[c] = formatterInteger.bind(format);
				break;
			case 'period':
				formats[c] = formatterPeriod.bind(format);
				break;
			case 'bytes':
				formats[c] = formatterInteger.bind(format);
				break;
			case 'price':
				formats[c] = formatterPrice.bind(format);
				break;
			case 'link':
				column.base !== undefined || ((columns[c] = Object.create(column)).base = layout.base || null);
				formats[c] = formatterHref.bind(format);
				break;
			case 'text':
			case 'string':
				formats[c] = formatterText.bind(format);
				break;
			default:
				switch(column.type){
				case 'number':
					formats[c] = formatterFloating.bind(format);
					break;
				case 'boolean':
					formats[c] = formatterInteger.bind(format);
					break;
				default:
					formats[c] = formatterText.bind(format);
					break;
				}
			}
			
			= ','; = Format.jsString(title === name 
					? title 
					: name + " (" + title + ")" 
				);
		}
		
		= '\r\n';
		++ rowIndex;
		

		const rows = layout.rows || [];
		const rowCount = rows.length;
		
		var r, row;
		for(r = 0; r < rowCount; ++r){
			row = rows[r];
			= r + 1 ;
			for(c = 0; c < columnCount; ++c){
				column = columns[c];
				= ','; = formats[c](row[column.id], column, row);
			}
			= '\r\n';
			++ rowIndex;
		}
	}

	return csv;
}

function makeDataTableBinary(layout){
	return ae3.Transfer.createCopierUtf8(makeDataTableText(layout));
}

function makeDataTableMessage(layout){
	return ae3.Flow.binary('CSV', 'CSV File', {
		"Content-Type"			: File.getContentTypeForName(name + ".csv"),
		"Content-Disposition"	: "attachment; filename=" + name + ".csv"
	}, ae3.Transfer.createCopierUtf8(makeDataTableText(layout)));
}

function makeDataTableReply(query, layout){
	return ae3.Reply.binary(
		'CSV', 
		query, 
		ae3.Transfer.createCopierUtf8(makeDataTableText(layout)), 
		name + ".csv"
	).setFinal();
}


module.exports = Object.create(Object.prototype, {
	makeDataTableText : { value : makeDataTableText },
	makeDataTableBinary : { value : makeDataTableBinary },
	makeDataTableMessage : { value : makeDataTableMessage },
	makeDataTableReply : { value : makeDataTableReply },
});
