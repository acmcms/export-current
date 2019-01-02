
import ru.myx.util.xls.ExcelSAPI;

var object = Object.create(ExcelSAPI);

var ae3 = require('ae3');


function createBinaryFromLayout(layout){
	var query = new SimpleServeRequest();
	query.setResourceIdentifier("/document.xls");
	new XlsReplyTargetContext(query, null, null).transform(layout);
	return query.getResult();
}


function formatterDate(sheet, x, y, v, column, row){
	sheet.setCellDate(x, y, 'string' === typeof v ? Date.parse(v) : v, null /* "yyyy-MM-dd HH:mm:ss" */, this );
}

function formatterText(sheet, x, y, v, column, row){
	sheet.setCellLabel(x, y, v, this );
}

function formatterInteger(sheet, x, y, v, column, row){
	sheet.setCellInteger(x, y, v, this );
}

function formatterFloating(sheet, x, y, v, column, row){
	sheet.setCellFloating(x, y, v, this );
}

function formatterPrice(sheet, x, y, v, column, row){
	sheet.setCellPrice(x, y, v, this );
}

function formatterHref(sheet, x, y, v, column, row){
	var href = (column.prefix || '') + (row[column.field] || v) + (column.suffix || '');
	if(href.lastIndexOf("://", 10) === -1){
		var base = column.base;
		base
			? sheet.setCellHyperlink(x, y, base, href, v, this )
			: sheet.setCellLabel(x, y, v, this );
		return;
	}
	sheet.setCellHyperlink(x, y, href, v, this );
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
function makeDataTableBinary(layout){
	const name = layout.name || 'data';

	const workbook = ExcelSAPI.createWorkbook();
	const sheet = workbook.createSheet( name );
	
	const columns = layout.columns;
	if(!columns){
		throw new Error("Column definition is required!");
	}
	const columnCount = columns.length;
	if(!columnCount){
		throw new Error("Column definition is empty!");
	}
	
	const linked = layout.online;

	var rowIndex = 0;

	if(layout.title){
		const formatTitle = workbook.createCellFormatText();
		formatTitle.setFont("Arial", 22, true, true, 0);
		formatTitle.setAlignmentLeft();

		sheet.mergeCells(0, rowIndex, columnCount, rowIndex);
		layout.href
			? sheet.setCellHyperlink(0, rowIndex, layout.href, layout.title, formatTitle )
			: sheet.setCellLabel(0, rowIndex, layout.title, formatTitle );
		++ rowIndex;
	}

	const formats = [];
	
	const formatHeaderLeft = workbook.createCellFormat();
	formatHeaderLeft.setFont("Arial", 10, true, false, 0);
	formatHeaderLeft.setAlignmentLeft();
	formatHeaderLeft.setAlignmentTop();
	// formatHeaderLeft.setBorderRightDotted();
	// formatHeaderLeft.setBorderBottomDotted();

	const formatHeaderRight = workbook.createCellFormat();
	formatHeaderRight.setFont("Arial", 10, true, false, 0);
	formatHeaderRight.setAlignmentRight();
	formatHeaderRight.setAlignmentTop();
	// formatHeaderRight.setBorderRightDotted();
	// formatHeaderRight.setBorderBottomDotted();

	var c, column, format, formatIndex, title;
	{
		formatIndex = workbook.createCellFormatInteger();
		formatIndex.setFont("Arial", 10, false, false, 0);
		formatIndex.setWrap( false );
		formatIndex.setAlignmentCenter();
		formatIndex.setAlignmentTop();
		// formatIndex.setBorderRightDotted();
		// formatIndex.setBorderTopDotted();
		
		format = workbook.createCellFormat();
		format.setFont("Arial", 10, true, false, 0);
		format.setAlignmentCenter();
		format.setAlignmentTop();
		// formatHeaderRight.setBorderRightDotted();
		// format.setBorderBottomDotted();

		sheet.setCellLabel(0, rowIndex, "#", format );
	}
	for(c = 0; c < columnCount; ++c){
		column = columns[c];
		title = column.title || column.name || column.id;
		switch(column.variant){
		case 'date':
			// "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
			format = workbook.createCellFormatDate( "yyyy-MM-dd HH:mm:ss" );
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( true );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterDate.bind(format);
			format = formatHeaderLeft;
			break;
		case 'floating':
			format = workbook.createCellFormatFloating();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( false );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterFloating.bind(format);
			format = formatHeaderLeft;
			break;
		case 'integer':
		case 'int':
		case 'long':
			format = workbook.createCellFormatInteger();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( false );
			format.setAlignmentRight();
			format.setAlignmentTop();
			formats[c] = formatterInteger.bind(format);
			format = formatHeaderRight;
			break;
		case 'price':
			format = workbook.createCellFormatPrice();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( false );
			format.setAlignmentRight();
			format.setAlignmentTop();
			formats[c] = formatterPrice.bind(format);
			format = formatHeaderRight;
			break;
		case 'link':
			if(linked){
				format = workbook.createCellFormatText();
				format.setFont("Arial", 10, false, false, 1);
				format.setWrap( true );
				format.setAlignmentLeft();
				format.setAlignmentTop();
				column.base !== undefined || ((columns[c] = Object.create(column)).base = layout.base || null);
				formats[c] = formatterHref.bind(format);
				format = formatHeaderLeft;
				break;
			}
			// $FALL-THROUGH
		case 'text':
		case 'string':
			format = workbook.createCellFormatText();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( true );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterText.bind(format);
			format = formatHeaderLeft;
			break;
		default:
			format = workbook.createCellFormatText();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( true );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterText.bind(format);
			format = formatHeaderLeft;
			break;
		}
		// format.setBorderRightDotted();
		// format.setBorderTopDotted();
		sheet.setCellLabel(c + 1, rowIndex, title, format );
		format = null;
	}
	++ rowIndex;
	

	const rows = layout.rows || [];
	const rowCount = rows.length;
	
	var r, row;
	for(r = 0; r < rowCount; ++r){
		row = rows[r];
		sheet.setCellInteger(0, rowIndex, r + 1, formatIndex );
		for(c = 0; c < columnCount; ++c){
			column = columns[c];
			formats[c].call(null, sheet, c + 1, rowIndex, row[column.id], column, row);
		}
		++ rowIndex;
	}

	return workbook.buildWorkbook();
}


/**
 * <code>
 * layout = {
 * 	name: 'users' // || 'data'
 * 	fields: [
 * 		{ }
 * 	],
 * 	...values,
 * }
 * </code>
 * @param layout
 * @returns
 */
function makeFormBinary(layout){
	const name = layout.name || 'data';

	const workbook = ExcelSAPI.createWorkbook();
	const sheet = workbook.createSheet( name );
	
	const fields = layout.fields;
	if(!fields){
		throw new Error("Field definition is required!");
	}
	const fieldCount = fields.length;
	if(!fieldCount){
		throw new Error("Field definition is empty!");
	}
	
	const linked = layout.online;
	
	var rowIndex = 0;
	
	if(layout.title){
		const formatTitle = workbook.createCellFormatText();
		formatTitle.setFont("Arial", 22, true, true, 0);
		formatTitle.setAlignmentLeft();
		
		sheet.mergeCells(0, rowIndex, columnCount, rowIndex);
		layout.href
			? sheet.setCellHyperlink(0, rowIndex, layout.href, layout.title, formatTitle )
			: sheet.setCellLabel(0, rowIndex, layout.title, formatTitle );
		++ rowIndex;
	}

	const formats = [];
	
	const formatHeaderLeft = workbook.createCellFormat();
	formatHeaderLeft.setFont("Arial", 10, true, false, 0);
	formatHeaderLeft.setAlignmentLeft();
	formatHeaderLeft.setAlignmentTop();
	// formatHeaderLeft.setBorderRightDotted();
	// formatHeaderLeft.setBorderBottomDotted();

	const formatHeaderRight = workbook.createCellFormat();
	formatHeaderRight.setFont("Arial", 10, true, false, 0);
	formatHeaderRight.setAlignmentRight();
	formatHeaderRight.setAlignmentTop();
	// formatHeaderRight.setBorderRightDotted();
	// formatHeaderRight.setBorderBottomDotted();

	var c, column, format, formatIndex, title;
	{
		formatIndex = workbook.createCellFormatInteger();
		formatIndex.setFont("Arial", 10, false, false, 0);
		formatIndex.setWrap( false );
		formatIndex.setAlignmentCenter();
		formatIndex.setAlignmentTop();
		// formatIndex.setBorderRightDotted();
		// formatIndex.setBorderTopDotted();
		
		format = workbook.createCellFormat();
		format.setFont("Arial", 10, true, false, 0);
		format.setAlignmentCenter();
		format.setAlignmentTop();
		// formatHeaderRight.setBorderRightDotted();
		// format.setBorderBottomDotted();

		sheet.setCellLabel(0, rowIndex, "#", format );
	}
	for(c = 0; c < columnCount; ++c){
		column = columns[c];
		title = column.title || column.name || column.id;
		switch(column.variant){
		case 'date':
			// "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
			format = workbook.createCellFormatDate( "yyyy-MM-dd HH:mm:ss" );
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( true );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterDate.bind(format);
			format = formatHeaderLeft;
			break;
		case 'floating':
			format = workbook.createCellFormatFloating();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( false );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterFloating.bind(format);
			format = formatHeaderLeft;
			break;
		case 'integer':
		case 'int':
		case 'long':
			format = workbook.createCellFormatInteger();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( false );
			format.setAlignmentRight();
			format.setAlignmentTop();
			formats[c] = formatterInteger.bind(format);
			format = formatHeaderRight;
			break;
		case 'price':
			format = workbook.createCellFormatPrice();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( false );
			format.setAlignmentRight();
			format.setAlignmentTop();
			formats[c] = formatterPrice.bind(format);
			format = formatHeaderRight;
			break;
		case 'link':
			if(linked){
				format = workbook.createCellFormatText();
				format.setFont("Arial", 10, false, false, 1);
				format.setWrap( true );
				format.setAlignmentLeft();
				format.setAlignmentTop();
				column.base !== undefined || ((columns[c] = Object.create(column)).base = layout.base || null);
				formats[c] = formatterHref.bind(format);
				format = formatHeaderLeft;
				break;
			}
			// $FALL-THROUGH
		case 'text':
		case 'string':
			format = workbook.createCellFormatText();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( true );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterText.bind(format);
			format = formatHeaderLeft;
			break;
		default:
			format = workbook.createCellFormatText();
			format.setFont("Arial", 10, false, false, 0);
			format.setWrap( true );
			format.setAlignmentLeft();
			format.setAlignmentTop();
			formats[c] = formatterText.bind(format);
			format = formatHeaderLeft;
			break;
		}
		// format.setBorderRightDotted();
		// format.setBorderTopDotted();
		sheet.setCellLabel(c + 1, rowIndex, title, format );
		format = null;
	}
	++ rowIndex;
	

	const rows = layout.rows || [];
	const rowCount = rows.length;
	
	var r, row;
	for(r = 0; r < rowCount; ++r){
		row = rows[r];
		sheet.setCellInteger(0, rowIndex, r + 1, formatIndex );
		for(c = 0; c < columnCount; ++c){
			column = columns[c];
			formats[c].call(null, sheet, c + 1, rowIndex, row[column.id], column, row);
		}
		++ rowIndex;
	}

	return workbook.buildWorkbook();
}

function makeDataTableMessage(layout){
	return ae3.Flow.binary('XLS', 'Excel File', {
		"Content-Type"			: File.getContentTypeForName(name + ".xls"),
		"Content-Disposition"	: "attachment; filename=" + name + ".xls"
	}, makeDataTableBinary(layout));
}

function makeFormMessage(layout){
	return ae3.Flow.binary('XLS', 'Excel File', {
		"Content-Type"			: File.getContentTypeForName(name + ".xls"),
		"Content-Disposition"	: "attachment; filename=" + name + ".xls"
	}, makeFormBinary(layout));
}

function makeDataTableReply(query, layout){
	return ae3.Reply.binary('XLS', query, makeDataTableBinary(layout), name + ".xls");
}


function makeFormReply(query, layout){
	return ae3.Reply.binary('XLS', query, makeFormBinary(layout), name + ".xls");
}

Object.defineProperties(object, {
	createBinaryFromLayout : { value : createBinaryFromLayout },
	makeDataTableBinary : { value : makeDataTableBinary },
	makeDataTableMessage : { value : makeDataTableMessage },
	makeDataTableReply : { value : makeDataTableReply },
	makeFormBinary : { value : makeFormBinary },
	makeFormMessage : { value : makeFormMessage },
	makeFormReply : { value : makeFormReply },
});

module.exports = object;
