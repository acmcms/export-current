/**
 * 
 */

const title = "ACM::developer/error (Error Example)";

module.exports = function(context){
	const share = context.share;
	const client = share.authRequireAccount(context);
	const query = context.query;
	
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
		
		null("This is an expected text error! 8-)");

		var a = aa1 ? aa : aa1 + aa2 + ee1 + ';' + ee2 + '11';
		var b = a(aa1 ? aa : aa1 + aa2 + ee1 + ';' + ee2 + '11');
	}
};
