const ae3 = require("ae3");

const XmlMultipleRequest = require("ae3.web/XmlMultipleRequest");
const FutureSimpleObject = require('java.class/ru.myx.ae3.common.FutureSimpleUnknown');
const Xml = require("ae3.util/Xml");

const http = require("http");

const ClientRequest = module.exports = ae3.Class.create(
	"ClientRequest",
	XmlMultipleRequest,
	function ClientRequest(client){
		XmlMultipleRequest.call(this);
		this.client = client;
		return this;
	},
	{
		launch : {
			value : function launch(){
				const future = new FutureSimpleObject();
				internClientDoRequest.call(this, future, this.items, null);
				return future;
			},
		},
		ndssUrl : {
			execute : "once", get : function(){
				return this.client.ndssUrl;
			}
		},
		toString : {
			value : function(){
				return "[ClientRequest: ndm.client '"+(this.client || {}).clientId+"']";
			}
		}
	},
	{
		
	}
);


/**
 * .call(this.client
 * 
 * @returns
 */
function internClientUpgradeSuccess(map){
	if(map.license != this.licenseNumber){
		throw "Invalid upgrade response: " + Format.jsDescribe(result);
	}
	if(!map.serviceKey){
		throw "Doesn't contain 'serviceKey': " + Format.jsDescribe(result);
	}
	this.vfs.setContentPublicTreePrimitive("serviceKey", this.serviceKey = String(map.serviceKey));
}


/**
 * Use .call(client, ...)
 * 
 * @param items
 * @returns
 */
function internClientDoRequest(future, items, then){
	const client = this.client;
	const auth = client.auth;

	if(!items.upgradeEpoch){
		if(client.licenseNumber && !client.serviceKey && !auth.get.__auth_type){
			/**
			 * Need to upgradeEpoch
			 */
			internClientDoRequest.call(this, future, {
				upgradeEpoch : {
					name : "upgradeEpoch",
					path : "/upgradeEpoch",
					get : {
						upgrade		: "2..3,serviceKey",
						fw			: ___ECMA_IMPL_VERSION_STRING___,
						sn			: ___ECMA_IMPL_HOST_NAME___,
					},
					onSuccess : internClientUpgradeSuccess.bind(client)
				}
			}, items);
			return;
		}
	}
	
	const keys = Object.keys(items);
	if(keys.length == 0){
		/**
		 * Nothing pending
		 */
		then 
			? internClientDoRequest.call(this, future, then)
			: future.setResult(null);
		return;
	}
	
	const urlNdss = this.ndssUrl;

	if(keys.length == 1){
		/**
		 * Will do simple request, only for one item
		 */
		for(var request of items){
			const get = Object.create(request.get);
			for(var key in auth.get){
				get[key] = auth.get[key];
			}
			const post = auth.post;
			for(var key in auth.post){
				post ||= {};
				post[key] = auth.post[key];
			}
			const url = {
				host : client.ndssHost,
				port : 443,
				path : request.path + "?" + Format.queryStringParameters(get),
				headers : auth.headers,
			};
			
			const callback = internCallbackHttpSimple.bind(this, future, request, then);

			console.log("ndm.client::ClientRequest: %s: single request: //%s:%s%s", this, url.host, url.port, url.path);
			
			Object.keys(post).length 
				? http.post(url, post, callback)
				: http.get(url, callback);
		}
		return;
	}
	/**
	 * Make xml-request, with multiple commands
	 */
	{
		const callback = internCallbackXmlMultiple.bind(this, future, items, then);
		
		const path = "/xml-request.xml?___output=text/html&" + Format.queryStringParameters(auth.get);
		
		console.log("ndm.client::ClientRequest: %s: multiple request: %s", this, urlNdss + path);

		for(var item of items){
			console.log("ndm.client::ClientRequest:items %s: multiple request item['%s']: %s", this, item.name, item.path + (item.get ? '?' + Format.queryStringParameters(item.get) : ''));
		}

		const xml = this.makeRequestXmlBody.call({ items : items }, auth.post);
		const headers = Object.create(auth.headers || Object.prototype);
		headers["Content-Type"] = "text/xml; charset=utf-8";
		
		http.request({
			host : client.ndssHost,
			port : 443,
			method : 'POST',
			path : path,
			headers : headers,
			body : xml
		}, callback);
		return;
	}
}


function internCallbackHttpSimple(future, request, then, message){
	if(!message){
		future.setError(new Error("No reply!"));
		return;
	}
	
	const code = message.code;
	const body = message.toCharacter().text;

	console.log("ndm.client::ClientRequest:CallbackHttpSimple: %s: single response: code=%s", this, code);
	if(code != 200){
		request.onError 
			? future.setResult(request.onError.call(request, code, body) || true)
			: future.setError(new Error("Error executing client request: code=" + code + ", " + body));
		return;
	}
	
	/**
	 * body property of XML-multiple is actually a map/string/etc from XML
	 */
	const map = Xml.toBase("xml-response", body, null, null, null) || {};
	request.onSuccess?.call(request, map);
	
	then 
		? internClientDoRequest.call(this, future, then)
		: future.setResult(true);
}

function internCallbackXmlMultiple(future, items, then, message){
	if(!message){
		future.setError(new Error("No reply!"));
		return;
	}

	var results;
	{
		const code = message.code;
		const body = message.toCharacter().text;
		
		console.log("ndm.client::ClientRequest:CallbackHttpMultiple: %s: response: code=%s", this, code);
		if(code != 200){
			future.setError(new Error("Error executing client request: code=" + code + ", " + body));
			return;
		}
		
		const map = Xml.toBase("xml-response", body, null, null, null) || {};
		// console.log("ndm.client::ClientRequest:CallbackHttpMultiple:item: %: response map: %", this, Format.jsDescribe(map));

		results = Array(map['result']);
	}
	
	for(var result of results){
		const name = result.name;
		const request = items[name];
		if(!request){
			throw new Error("Unknown result, name=" + name);
		}
		const code = result.code;
		console.log("ndm.client::ClientRequest:CallbackHttpMultiple:item: %s: item['%s']: code=%s", this, name, code);
		
		const body = result.body;
		if(code == 200){
			request.onSuccess?.call(request, body);
		}else{
			request.onError?.call(request, code, body);
		}
	}
	
	then 
		? internClientDoRequest.call(this, future, then)
		: future.setResult(true);
}
