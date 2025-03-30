function XmlMultipleRequest(){
	this.items = {};
	return this;
}

function xmrMakeRequestXmlBody(xmlParameters){
	var xml = '';
	$output(xml){
		%><request><%
			for(var parameter in xmlParameters){
				= Format.xmlElement(parameter, { "class" : "string" }, String(xmlParameters[parameter]));
			}
			for(var request of this.items){
				var get = request.get || {};
				%><command<%= Format.xmlAttributes({
					name : request.name,
					path : request.path + "?" + Format.queryStringParameters(get),
				}) %>><%
				if(request.body){
					%><body><%
						= Format.xmlNodeValue(request.body);
					%></body><%
				}
				%></command><%
			}
		%></request><%
	}
	return xml;
}

Object.defineProperties(XmlMultipleRequest.prototype, {
	items : {
		value : null
	},
	/**
	 * <code>
	{
		name : "check2",
		path : "/checkValid",
		get : {
			license : license,
			format : 'xml'
		},
		expect : 401,
		onSuccess : function onSuccess(object),
		onError : function onError(code, body),
		
	}
	 * </code>
	 */
	append : {
		value : function append(x){
			this.items[x.name] = x;
		}
	},
	makeRequestXmlBody : {
		value : xmrMakeRequestXmlBody
	},
	makeRequestObject : {
		value : function makeRequestObject(host, port, extraParameters, extraHeaders, callback){
			//
		}
	},
});

const ae3 = require("ae3");
const Request = ae3.Request;
const Reply = ae3.Reply;
const Xml = ae3.Util.Xml;

/**
 * Puts all own enumerable (as per Object.keys(x)) properties into 'this'.
 * 
 * Use .call(target, source);
 * 
 * @param o source object
 * @param t used internally
 * @returns
 */
function internPutAll(o, temp){
	for(t of Object.keys(o)){ 
		this[t] = o[t]; 
	}
}

function handle(context, shareHandler){
	const query = context.query;
	const map = Xml.toBase("xml-request", query.toCharacter().text, null, null, null) || {};

	const requests = Array(map['command']);
	
	var path, requestItem, get, i, QueryString, request, response;
	
	var xml = '';
	$output(xml){
		%><multiple layout="list" elementName="result" title="Xml Multiple Reply"><%
			%><columns><%
				%><column id="." title="Result" variant="view"/><%
			%></columns><%
			/**
			 * for every command
			 */
			for(requestItem of requests){
				path = requestItem.path;
				if(!path){
					// likely it is not the command, but a query parameter with the same name
					continue;
				}
				{
					/**
					 * exactly 'query.parameters' (not 'map') - we are interested in all parameters.
					 * 
					 * currently we need it for transparent auth, but it could conflict with some parameters later.
					 */
					get = Object.create(query.parameters || {});
					i = path.indexOf('?');
					if(i !== -1){
						internPutAll.call(get, (QueryString ||= require('querystring')).parse(path.substring(i + 1)));
						path = path.substring(0, i);
					}
				}
				request = Request.character("XML-REQUEST-MULTIPLE", "GET", {
					"Host" : query.target,
					"Secure" : query.attributes["Secure"],
					"Geo-Mean" : query.attributes["Geo-Mean"],
					"Geo-Peer" : query.attributes["Geo-Peer"],
					"User-Agent" : "XML Multiple Local, " + (query.attributes["User-Agent"] || 'none'),
				}, requestItem.body || '')//
					.setTarget(query.target) //
					.setTargetExact(query.targetExact) //
					.setUrlBase(query.urlBase) //
					.setResourcePrefix(query.resourcePrefix) //
					.setResourceIdentifier(path) //
					.setParameters(get) //
					.setSettings(query.settings) //
					.setSourceAddress(query.sourceAddress) //
					.setSourceAddressExact(query.sourceAddressExact) //
				;
				
				var requestContext = Object.create(context, {
					query : {
						value : request
					}
				});
				
				try{
					response = Request.queryHandler(shareHandler, requestContext);
					// response = shareHandler.handle(request);
				}catch(e){
					response = Reply.string( "QUERY:SKIN", //
							query,
							Format.throwableAsPlainText( e ) )//
							.setCode( Reply.CD_EXCEPTION )//
					;
				}
				
				%><result layout="view"><%
					%><fields><%
						%><field name="name" title="Name" variant="string"/><%
						%><field name="code" title="Code" variant="string"/><%
						%><field name="type" title="Type" variant="string"/><%
						%><field name="body" title="Body" variant="string" cssClass="code"/><%
					%></fields><%
					= Format.xmlElement('name', null, requestItem.name);
					if(!response){
						= Format.xmlElement('type', null, 'none');
						= Format.xmlElement('code', null, 404);
					}else //
					if(!response.toCharacter){
						response = context.transformLayout(response);
						if(!response){
							= Format.xmlElement('type', null, 'layout-none');
							= Format.xmlElement('code', null, 404);
						}else//
						if(response.layout === 'xml'){
							= Format.xmlElement('type', null, 'layout-xml');
							= Format.xmlElement('code', null, response.code || 200);
							%><body cssClass="code"><%
								if(response.xsl){
									%><!-- XSL: <%
									= Format.xmlNodeValue(response.xsl); 
									%> --><%
								}
								= response.content;
							%></body><%
						}else//
						if(response.layout === 'final' && response.type === 'text/xml'){
							= Format.xmlElement('type', null, 'final-xml');
							= Format.xmlElement('code', null, response.code || 200);
							response = response.content;
							%><body><%
								= response.startsWith('<?xml') ? response.substring(response.indexOf('?>') + 2) : response;
							%></body><%
						}else//
						if(response.layout === 'final' && response.type === 'text/plain'){
							= Format.xmlElement('type', null, 'final-plain');
							= Format.xmlElement('code', null, response.code || 200);
							response = response.content;
							%><body><%
								= Format.xmlNodeValue(response);
							%></body><%
						}else{
							= Format.xmlElement('type', null, response.layout);
							response = Reply.fromObject("XML-MULTIPLE", context, response);
							= Format.xmlElement('code', null, response.code || 200);
							%><body><%
								= Format.xmlNodeValue(response.toCharacter().text);
							%></body><%
						}
					}else{
						= Format.xmlElement('type', null, response.layout || 'reply');
						response = Reply.fromObject("XML-MULTIPLE", context, response);
						= Format.xmlElement('code', null, response.code || 200);
						%><body><%
							= Format.xmlNodeValue(response.toCharacter().text);
						%></body><%
					}
				%></result><%
			}
		
		%></multiple><%
	}
	return {
		layout	: 'xml',
		xsl		: "/!/skin/skin-standard-xml/show.xsl",
		content	: xml,
		cache	: false
	};
}

XmlMultipleRequest.handle = handle;

module.exports = XmlMultipleRequest;