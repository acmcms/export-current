const title = "ACM::developer/exampleResponse (Example Responses)";

const vfs = require("ae3/vfs");

const VFS_RESOURCE_PATH = "resources/lib/ae3.example/wapi/developer/example";

const vfsResource = vfs.UNION.relativeFolder(VFS_RESOURCE_PATH);

if(!vfsResource?.isExist()){
	throw "does not exist: union/" + VFS_RESOURCE_PATH;
}

function runExample(context){
	const share = context.share;
	const client = share.authRequireAccount(context);
	const query = context.query;

	const path = query.resourceIdentifier;
	
	/**
	 * index, form
	 */
	if(path == '/'){
		throw "Hello!";
	}
	
	if(path){
		return vfsResource.relative(path, null);
	}
	
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

module.exports = runExample;
