// TODO: not finished, not used


const title = "AE3::developer/tests/XmlMultipleRequest (Xml Multiple Request [self-]Test)";

function runXmlMultipleRequest(context){
	const query = context.query;
	const parameters = query.parameters;
	switch(parameters.test){
	case 1:
		return {
			layout	: "xml",
			xsl		: "/!/skin/skin-standard-xml/show.xsl",
			
			content : Format.xmlElement('message', {
				title : title,
				layout : 'message',
				icon : 'comments',
			}, "Test Multilple XML Message Content")
		};
	case 2:
		return "String text reply";
	case 3:
		return {
			layout	: "final",
			type : 'text/plain',
			title : title,
			content : "String text final reply"
		};
	case 4:
		return {
			layout	: "string",
			title : title,
			content : "String text layout reply"
		};
	case 5:
		return {
			layout	: "message",
			title : title,
			icon : 'comments',
			message : "Test Multilple Message Content"
		};
	case 6:
		return {
			layout	: "data-view",
			title : title,
			prefix : {
				layout	: "message",
				title : title,
				icon : 'comments',
				message : "Test Multilple View Content"
			}
		};
	}
	
	const share = context.share;
	const client = share.authRequireAccount(context);
	
	const CollectConsole = require("ae3.util/CollectConsole");
	const console = new CollectConsole();
	console.log("checking simple xml request");

	const url = URL.parse(query.urlBase + query.resourcePrefix + query.resourceIdentifier);
	
	const path = url.path.substring(0, url.path.lastIndexOf('/')) + "/xml-request.xml";
	const host = url.host;
	
	console.log("requesting: https://" + host + path);

	do{
		var XmlMultipleRequestClass = require('ae3.web/XmlMultipleRequest')
		var xmlMultipleRequest = new XmlMultipleRequestClass();

		console.log("Client: " + Format.jsDescribe(xmlMultipleRequest.client));
		
		xmlMultipleRequest.append({
			name : 'test0',
			path : '/xmlSimpleRequest',
			get : {
				test : true
			}
		});

		for(var i = 1; i <= 6; ++i){
			xmlMultipleRequest.append({
				name : 'test' + i,
				path : '/xmlMultipleRequest',
				get : {
					test : i
				}
			});
		}

		console.log("Requests: " + Format.jsDescribe(xmlMultipleRequest.items));

		var xml = xmlMultipleRequest.makeRequestXmlBody(post);

		console.log("XML Request: " + xml);
		
		const reply = require('http').request({
			protocol : url.protocol,
			host : host,
			path : path,
			method : 'POST',
			headers : {
				"Content-Type" : "text/xml; charset=utf-8",
				"Test-Header" : "true"
			},
			body : xml
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
			console.error("bad response code: expected=200, result=" + code);
			console.error("message: " + reply.toCharacter().text);
			break;
		}
		
		const contentType = reply.attributes['Content-Type'];
		console.log("contentType: " + contentType);
		
		const replyBody = reply.toCharacter().text;
		console.log("REPLY-BODY: " + replyBody);
		
	}while(false);
	
	
	console.log("Time took: " + (Date.now() - timeStarted) + " millis");
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
				%><field name="output" title="Output" variant="sequence" elementName="code" /><%
				= Format.xmlElement('field', {
					name : 'preview',
					title : 'Preview',
					variant : 'document-url',
				})
			%></fields><%
			%><output layout="sequence"><%
				for(var row of collected){
					%><code class="hl-bn-<%= row.state != 'NORMAL' %> code"><%
						= Format.xmlNodeValue( row.text );
					%></code><%
				}
			%></output><%
			= Format.xmlElement('preview', { 
				src : String(url) + "?preview=true&format=clean"
			});
		%></output><%
	}
	
	return {
		layout	:	"xml",
		xsl		:	"/!/skin/skin-standard-xml/show.xsl",
		content	:	xml
	};
}

module.exports = runXmlMultipleRequest;
