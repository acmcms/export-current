const ae3 = require('ae3');
const csv = require('./csv');

function makeDataTableText(layout){
	return csv.makeDataTableText(layout);
}

function makeDataTableBinary(layout){
	return ae3.Transfer.createCopierUtf8(makeDataTableText(layout));
}

function makeDataTableMessage(layout){
	return ae3.Flow.binary('TXT', 'Plain Text File', {
		"Content-Type"			: "text/plain",
		"Content-Disposition"	: "inline; filename=" + name + ".txt"
	}, ae3.Transfer.createCopierUtf8(makeDataTableText(layout)));
}

function makeDataTableReply(query, layout){
	return ae3.Reply.binary(
		'TXT', 
		query, 
		ae3.Transfer.createCopierUtf8(makeDataTableText(layout)), 
		name + ".txt"
	).setFinal();
}

module.exports = Object.create(Object.prototype, {
	makeDataTableText : { value : makeDataTableText },
	makeDataTableBinary : { value : makeDataTableBinary },
	makeDataTableMessage : { value : makeDataTableMessage },
	makeDataTableReply : { value : makeDataTableReply },
});
