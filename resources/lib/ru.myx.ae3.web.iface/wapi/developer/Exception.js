var lib = require('ru.myx.ae3.web.iface/Ae3WebService');
var title = "AE3::developer/exception (Exception)";

function runError(context){
	const query = context.query;
	const client = context.share.authCheckQuery(query);
	
	context.title = title;

	{
		var aa = { key1 : 'aaa'.substring(1), key2 : 'bbb'.substring(1) };
		var aa1 = aa.key1;
		var aa2 = Array( aa.key1 );
		var aa3 = aa.key2;
		var aa4 = Array( aa.key2 );
		
		var i = aa.entrySet().iterator();
		var ee;
		
		ee = i.next();
		var ee1 = ee.key;
		var ee2 = Array( ee.key );
		
		ee = i.next();
		var ee3 = ee.key;
		var ee4 = Array( ee.key );
		
		null();

		var a = aa1 ? aa : aa1 + aa2 + ee1 + ';' + ee2 + '11';
		var b = a(aa1 ? aa : aa1 + aa2 + ee1 + ';' + ee2 + '11');
	}

	/**
	 * shouldn't get here, error is above ^^^
	 */
	
	return {
		layout	: "final",
		type	: "text/xml",
		content	: ""
	};
}

module.exports = runError;
