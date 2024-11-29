// TODO: not finished, not used


const title = "AE3::developer/tests/XmlSimpleRequest (Xml Simple Request [self-]Test)";

function runXmlSimpleRequest(context){
	const query = context.query;
	const parameters = query.parameters;
	if(parameters.test){
		return {
			layout	: "xml",
			xsl		: "/!/skin/skin-standard-xml/show.xsl",
			content : Format.xmlElement('message', {
				title : title,
				layout : 'message',
				icon : 'comment',
			}, "Test Message Content")
		};
	}
	
	const share = context.share;
	const client = share.authRequireAccount(context);
	
	const CollectConsole = require("ae3.util/CollectConsole");
	const console = new CollectConsole();
	console.log("checking simple xml request");

	const url = URL.parse(query.urlBase + query.resourcePrefix + query.resourceIdentifier);
	const host = url.host;
	const path = url.path + "?test=true";
	console.log("requesting: https://" + host + path);

	do{
		
		const reply = require('http').request({
			protocol : url.protocol,
			host : host,
			path : path,
			method : 'GET',
			headers : {
				"Test-Header" : "true"
			},
			body : null
		});

		if(parameters.preview){
			if(!reply){
				throw new Error("No reply!");
			}
			return reply.setFinal();
		}

		if(!reply){
			console.error("no response!");
			break;
		}
		
		const code = reply.code;
		console.log("HTTP code: " + code);
		if(code != 200){
			console.error("bad response code: expected=" + test.code + ", result=" + code);
			console.error("message: " + reply.toCharacter().text);
			break;
		}
		
		const contentType = reply.attributes['Content-Type'];
		console.log("contentType: " + contentType);
		
		const replyBody = reply.toCharacter().text;
		console.log("REPLY-BODY: " + replyBody);
		
	}while(false);
	
	
	console.log("Time took: %s millis", Date.now() - timeStarted);
	/**
	 * not yet, can't convert to layout yet
	 */
	// return console;
	
	var collected = console.getCollected();
	var xml;
	$output(xml){
		%><output layout="view"<%= Format.xmlAttribute('title', title) %>><%
			= Format.xmlElement('client', share.clientElementProperties(context));
			%><fields><%
				%><field name="output" title="Output" variant="sequence" elementName="div" /><%
				= Format.xmlElement('field', {
					name : 'preview',
					title : 'Preview',
					variant : 'document-url',
				})
			%></fields><%
			%><output layout="sequence"><%
				for(var row of collected){
					%><div class="hl-bn-<%= row.state != 'NORMAL' %> code"><%
						= Format.xmlNodeValue( row.text );
					%></div><%
				}
			%></output><%
			= Format.xmlElement('preview', { 
				src : String(url) + "?preview=true"
			});
		%></output><%
	}
	
	return {
		layout	:	"xml",
		xsl		:	"/!/skin/skin-standard-xml/show.xsl",
		content	:	xml
	};
}

module.exports = runXmlSimpleRequest;
