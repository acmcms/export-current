var title = "ACM::developer/error (Error)";

function runError(context){
	const share = context.share;
	const client = share.authRequireAccount(context);

	var xml;

	var error;
	
	try{
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
	}catch(e){
		error = e;
	}
	
	$output(xml){
		%><?xml-stylesheet type="text/xsl" href="/!/skin/skin-standard-xml/show.xsl"?><%
		%><error layout="rows" title="Error in-a-box"><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			%><rows><%
				%><code cssClass="code"><%= Format.xmlNodeValue(Format.throwableAsPlainText(error)) %></code><%
			%></rows><%
		%></error><%
	}
	
	return {
		layout	: "final",
		type	: "text/xml",
		content	: xml
	};
}

module.exports = runError;
