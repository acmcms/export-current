const ae3 = require('ae3');

import ru.myx.ae3.serve.SimpleServeRequest;
import ru.myx.ae3.l2.pdf.PdfTargetReplyContext;

import ru.myx.util.pdf.PdfAPI;

function createBinaryFromLayout(layout){
	const query = new SimpleServeRequest();
	query.setResourceIdentifier("/document.pdf");
	new PdfTargetReplyContext(query, null, null).transform(layout);
	return query.getResult();
}

function createBinaryFromHtml(html){
	const builder = PdfAPI.createA4('test');
	builder.appendHtml(html);
	/*
	builder.flushPage();
	builder.appendLayout({
		layout : "grid",
		width : 4,
		border : true,
		elements : [
			'Hello!',
			'World!',
			{ layout : 'link', href : 'http://capandcap.ru', title : 'Кепки...' },
			'World!',
			'Здвавствуй!',
			'Мир!',
			{
				layout : "grid",
				width : 2,
				border : false,
				elements : [
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" }
				]
			},
			{
				layout : "grid",
				width : 3,
				border : false,
				elements : [
					'Hello!',
					'World!',
					'World!',
					'Hello!',
					'World!',
					'World!'
				]
			},
			"1",
			{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
			"3",
			"4"
		]
	});
	builder.flushPage();
	builder.appendHtml(html);
	*/
	return builder.toBinary();
}

function createBinaryFromXhtml(xhtml){
	const builder = PdfAPI.createA4('test');
	builder.appendXhtml(xhtml);
	return builder.toBinary();
}

function makeDataTableBinary(layout){
	return createBinaryFromHtml(require('ae3/html').makeDataTableText(layout));
}

function makeDataTableReply(query, layout){
	return ae3.Reply.binary('PDF', query, makeDataTableBinary(layout), name + ".pdf");
}

module.exports = Object.create(PdfAPI, {
	create : {
		value : createBinaryFromLayout
	},
	createBinaryFromLayout : {
		value : createBinaryFromLayout
	},
	createBinaryFromHtml : {
		value : createBinaryFromHtml
	},
	createBinaryFromXhtml : {
		value : createBinaryFromXhtml
	},
	makeDataTableBinary : {
		value : makeDataTableBinary
	},
	makeDataTableReply : {
		value : makeDataTableReply
	}
});