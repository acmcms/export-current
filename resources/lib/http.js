const ae3 = require('ae3');

const Transfer = ae3.Transfer;
const Concurrent = ae3.Concurrent;

const FutureSimpleObject = Concurrent.FutureSimpleUnknown;
const FutureSimpleString = Concurrent.FutureSimpleString;
const FutureSimpleBinary = Concurrent.FutureSimpleBinary;

const ReplyParser = require('java.class/ru.myx.ae3.i3.web.http.client.ReplyParser');

/**
 * to increment connection counters
 */
const Stats = require('java.class/ru.myx.ae3.i3.web.http.client.HttpClientStatusProvider');

const URL = require('url');

/**
 * Future is sent as 'this' value
 * 
 * 
 * 
 * @param parameters fixed at 'bind'
 * @param message
 * @param error
 */
function internCallbackSetFuture(parameters, message, code, error){
	if(message !== null) {
		// console.log(">>> >>> $$$$$$ callbackSetFuture, start, message=" + Format.jsDescribe(message));
		this.setResult(message);
		// console.log(">>> >>> $$$$$$ callbackSetFuture, done");
		return;
	}
	// console.log(">>> >>> $$$$$$ callbackSetFuture, error");
	this.setError(
		error || 
		("Unspecified HTTP Error (callbackSetFuture), while querying: " + Format.jsDescribe(parameters))
	);
	// console.log(">>> >>> $$$$$$ callbackSetFuture, fail %s", error);
}

/**
 * callback sent as 'this' value
 * 
 * @param parameters fixed at 'bind'
 */
function internRequestCallbackMessageToString(parameters, message, code, error){
	if(!message){
		// console.log(">>> >>> $$$$$$ callbackMessageToString, error");
		this(null, code || -1, error || ("Unspecified HTTP Error (callbackMessageToString), while querying: " + Format.jsDescribe(parameters)));
		return;
	}
	// console.log(">>> >>> $$$$$$ callbackMessageToString, start");
	code || (code = message.code);
	if(code === 301 || code === 302){
		this(null, -1, "Too many redirects, location: " + location);
		return;
	}
	var body = message.toCharacter().text;
	if(code === 200 || code === 204){
		// console.log(">>> >>>> CHECKPOINT1: " + Format.jsDescribe({code:code, body:body, message:message, error:error}));
		this(body, code, null);
		return;
	}
	// try{throw new Error("CHECKPOINT2: " + Format.jsDescribe({code:code, body:body, message:message, error:error}));}catch(e){body = e;}
	// console.log(">>> >>>> " + Format.jsDescribe((body = new Error("CHECKPOINT2!"))));
	this(null, code, body || (code + ' ' + message.title));
}

/**
 * callback sent as 'this' value
 * 
 * @param parameters fixed at 'bind'
 */
function internRequestCallbackMessageToBinary(parameters, message, code, error){
	if(!message){
		// console.log(">>> >>> $$$$$$ callbackMessageToBinary, error");
		this(null, code || -1, error || "Unspecified HTTP Error (callbackMessageToBinary), while querying: " + Format.jsDescribe(parameters));
		return;
	}
	// console.log(">>> >>> $$$$$$ callbackMessageToBinary, start");
	code || (code = message.code);
	if(code === 301 || code === 302){
		this(null, -1, "Too many redirects, location: " + location);
		return;
	}
	var body;
	if(code === 200 || code === 204){
		body = message.toBinary().binary;
		this(body, code, null);
		return;
	}
	body = message.toCharacter().text;
	this(null, code, body || (code + ' ' + message.title));
}




/**
 * stacked callback passed as 'this' value
 * 
 * @param parameters
 */
function internRequestCallbackMessageWithRedirects(parameters, message, code, error){
	if(!message){
		// console.log(">>> >>> $$$$$$ callbackWithRedirects: error");
		this(null, -1, error || "Unspecified HTTP Error (callbackMessageWithRedirects), while querying: " + Format.jsDescribe(parameters));
		return;
	}

	code || (code = message.code);

	if(code !== 301 && code !== 302){
		// console.log(">>> >>> $$$$$$ callbackWithRedirects, done, code=" + code);
		this(message, code, error);
		return;
	}
	
	// console.log(">>> >>> $$$$$$ callbackWithRedirects: code=" + code + ", params=" + Format.jsDescribe(parameters));
	var left = parameters.left;
	if(left === undefined){
		left = parameters.maxRedirects;
		left === undefined && (left = 5);
		if(!left){
			this(message, code, null);
			return;
		}
	}
	if(left <= 0){
		this(null, -1, "Too many redirects, location: " + location);
		return;
	}
	var location = message.attributes["Location"];
	if(!location){
		this(null, -1, "Redirect with no 'Location' header!");
		return;
	}
	/**
	 * make async GET
	 */
	// console.log(">>> >>> $$$$$$ callbackWithRedirects: check, location=" + location + ", params=" + Format.jsDescribe(parameters));
	if(location.includes('://')){
		parameters = internParametersForGet(location);
	}else{
		parameters = Object.create(parameters);
		parameters.path = location;
	}
	parameters.left = left - 1;
	setTimeout(
		internConnectThenRequestCallbackMessage.bind(
			internRequestCallbackMessageWithRedirects.bind(this, parameters), 
			parameters
		),
		0
	);
	// console.log(">>> >>> $$$$$$ callbackWithRedirects: follow, location=" + location + ", params=" + Format.jsDescribe(parameters));
}


/**
 * callback sent as 'this' value
 * 
 * @param parameters
 */
function internConnectThenRequestCallbackMessage(parameters){
	var protocol = parameters.protocol;
	var hostname = parameters.hostname;
	var host = parameters.host;
	var port = parameters.port && Number(parameters.port) || undefined;
	var ssl;
	
	// console.log(">>> >>> callbackConnect: start: " + protocol + ", " + hostname + ", " + port + ", " + host);
	
	var dividerPos = host ? host.indexOf(':') : -1;
	
	if(hostname){
		//
	}else//
	if(dividerPos != -1){
		hostname = host.substring(0, dividerPos);
	}else{
		hostname = host;
	}
	
	if(port){
		ssl = 'https:' === (protocol || (port === 443 || String(port).endsWith('443') ? 'https:' : 'http:'));
	}else//
	if(dividerPos !== -1){
		port = Number(host.substring(dividerPos + 1)) || ('http:' === protocol ? 80 : 443);
		ssl = 'https:' === (protocol || (port === 443 || String(port).endsWith('443') ? 'https:' : 'http:'));
	}else{
		ssl = 'http:' !== protocol;
		port = ssl ? 443 : 80;
	}

	ae3.net.tcp.connect(hostname, port, internRequestCallbackMessage.bind(this, parameters, hostname, port, ssl), {
		connectTimeout : parameters.connectTimeout || 5000,
		reuseTimeout : 5000,
		reuseBuffer : 32,
		optionFastRead : parameters.optionFastRead || false,
		optionClient : true
	});
}

/**
 * callback sent as 'this' value
 * 
 * @param parameters
 */
function internRequestCallbackMessage(parameters, hostname, port, https, socket){
	if(!socket){
		// console.log(">>> >>> $$$$$$ callbackMessage, no connect");
		this(null, -1, "Connection failure: " + hostname + ":" + port );
		return;
	}

	// console.log(">>> >>> $$$$$$ callbackMessage, start");

	var method = parameters.method || 'GET';
	var path = parameters.path || parameters.file || '';
	var headers = parameters.headers ? Object.create(parameters.headers) : {};
	var body = parameters.body;

	for(;;){
		switch(typeof body){
		case 'undefined':
		case 'null':
			/**
			 * makes NULL copier
			 */
			body = Transfer.createCopierUtf8(null);
			break;
		case 'string':
		case 'number':
		case 'boolean':
			body = Transfer.createCopierUtf8(String(body));
			var cType = headers['Content-Type'];
			if(!cType){
				headers['Content-Type'] = 'text/plain; charset=utf-8';
			}else //
			if(cType.startsWith("text/")){
				var pos = cType.indexOf(';');
				headers['Content-Type'] = (pos == -1 ? cType : cType.substr(0, pos)) + '; charset=utf-8';
			}
			break;
		case 'function':
			body = body.call(parameters);
			continue;
		// case 'object':
		default:
			body = Transfer.createCopierFromBinary(body);
			break;
		}
		break;
	}

	headers['User-Agent'] || (headers['User-Agent'] = (https ? "ae3.http secure client" : "ae3.http client"));
	headers['Content-Length'] = body.length();
	headers['Host'] = parameters.host || (hostname + ':' + port);
	headers['Connection'] = "close";

	// TODO: get TransferSocket. Send bytes; Or make $output work with TransferSocket as an argument
	var output = '', key;
	$output(output){
		= method;
		= path[0] === '/' ? ' ' : ' /';
		= path || '';
		if(parameters.protocolVariant){
			= " "; 
			= parameters.protocolVariant;
			= "\r\n"; 
		}else{
			= " HTTP/1.1\r\n";
		}
		
		for keys(key in headers){
			= key;
			= ": ";
			= headers[key];
			= "\r\n";
			// wr.write(Format.sprintf("%s: %s\r\n", key, headers[key]));
		}
		
		= "\r\n";
	}
	
	if(https){
		socket = ae3.net.ssl.wrapClient(socket, null, hostname || parameters.host, port, parameters.trustCA || null);
		Stats.incrementConnectionsHttps();
	}else{
		Stats.incrementConnectionsHttp();
	}

	if(parameters.callbackOnSent){
		// console.log(">>> >>> $$$$$ callbackOnSent 1, socket=" + socket);
		socket.target.absorbBuffer(Transfer.createBufferUtf8(output));
		body.length() && socket.target.absorbBuffer(body.nextCopy());
		socket.target.force();
		// console.log(">>> >>> $$$$$ callbackOnSent 2, socket=" + socket);
		 /**
		if(!socket.target.enqueueAction(this.bind(null, socket))){
			console.log(">>>>>> $$$$$ callbackOnSent 3, socket=" + socket);
			this(socket);
		}
		 */
		 this(socket);
		// console.log(">>> >>> $$$$$ callbackOnSent 4, socket=" + socket);
		return;
	}
	
	const parser = new ReplyParser(socket);
	parser.callback = this;
	parameters.callbackOnHead && (parser.callbackOnHead = true);

	socket.source.connectTarget(parser);
	
	socket.target.absorbBuffer(Transfer.createBufferUtf8(output));
	body.length() && socket.target.absorbBuffer(body.nextCopy());
	socket.target.force();
	// console.log(">>> >>> $$$$$ socket=" + socket + ", query=" + Format.jsString(output) + ", body.length=" + body.nextCopy().remaining());
}

function internParametersForGet(urlStrOrMap){
	if(!urlStrOrMap){
		throw new Error('string or object parameter is expected!');
	}
	if('string' === typeof urlStrOrMap){
		return URL.parse(urlStrOrMap);
	}
	if(!urlStrOrMap.path || !(urlStrOrMap.host || urlStrOrMap.hostname)){
		throw new Error("Invalid 'url' object contents!");
	}
	return urlStrOrMap;
}

function internParametersForPost(urlStrOrMap, postParameters){
	var original = internParametersForGet(urlStrOrMap);
	if(!postParameters){
		throw new Error("No postParameters argument value!");
	}
	var parameters = Object.create(original);
	parameters.method = "POST";
	parameters.headers = original.headers ? Object.create(original.headers) : {};
	parameters.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
	parameters.body = Format.queryStringParameters(postParameters);
	return parameters;
}

function internCallback(urlStrOrMap, callback){
	callback || (callback === undefined && 'string' !== typeof urlStrOrMap && (callback = urlStrOrMap.callback));
	if(callback && ('function' !== typeof callback)){
		throw new TypeError("callback present, but not a function, typeof: " + typeof callback);
	}
	return callback;
}





/**
 * HTTP object, part of CommonJS standard de-facto. But we go the other way.
 * see: http://nodejs.org/api/http.html
 * 
 * @param urlStrOrMap
 * @param callback when no explicit callback specified 'map.callback' will be checked.
 * @returns
 */
function httpGet(urlStrOrMap, callback){
	return httpRequest(
		internParametersForGet(urlStrOrMap), 
		internCallback(urlStrOrMap, callback)
	);
}

httpGet.asString = function httpGetReturnString(urlStrOrMap, callback){
	return httpRequest.asString(
		internParametersForGet(urlStrOrMap), 
		internCallback(urlStrOrMap, callback)
	);
};

httpGet.asBinary = function httpGetReturnBinary(urlStrOrMap, callback){
	return httpRequest.asBinary(
		internParametersForGet(urlStrOrMap), 
		internCallback(urlStrOrMap, callback)
	);
};

/**
 * 
 * @param urlStrOrMap
 * @param postParameters
 * @param callback
 */
function httpPost(urlStrOrMap, postParameters, callback){
	return postParameters
		? httpRequest(
			internParametersForPost(urlStrOrMap, postParameters), 
			internCallback(urlStrOrMap, callback)
		)
		: httpGet(urlStrOrMap, callback);
}

httpPost.asString = function httpPostReturnString(urlStrOrMap, postParameters, callback){
	return postParameters
	? httpRequest.asString(
		internParametersForPost(urlStrOrMap, postParameters), 
		internCallback(urlStrOrMap, callback)
	)
	: httpGet.asString(urlStrOrMap, callback);
};

httpPost.asBinary = function httpPostReturnBinary(urlStrOrMap, postParameters, callback){
	return postParameters
	? httpRequest.asBinary(
		internParametersForPost(urlStrOrMap, postParameters), 
		internCallback(urlStrOrMap, callback)
	)
	: httpGet.asBinary(urlStrOrMap, callback);
};

/**
 * 
 * @param parameters {
 * 		hostname : defaults to 'localhost',
 * 		port : port, defaults to '80',
 * 		method : method name, defaults to "GET",
 * 		path : request path, defaults to '/',
 * 		headers : an object containing request headers,
 * 		body : an object (string or binary) representing the request body,
 * 		trustCA : optional, Root CA certificate (x509 string) to check trust against (TLS/SSL only)
 * }
 * @param callback - query is (pseudo-)synchronous when no callback passed
 */
function httpRequest(parameters, callback){
	if(!callback){
		var future = new FutureSimpleObject();
		/*future.cancellable = */httpRequest(parameters, internCallbackSetFuture.bind(future, parameters));
		return future;
	}
	if('function' !== typeof callback){
		throw new TypeError("callback present, but not a function, typeof: " + typeof callback);
	}
	/**
	 * TODO: replace with new http.ClientRequest object
	 */
	if(parameters.maxRedirects !== undefined){
		callback = internRequestCallbackMessageWithRedirects.bind(callback, parameters);
	}
	callback = internConnectThenRequestCallbackMessage.bind(callback, parameters);
	return setTimeout(callback, 0);
}

/*
 * calc "require('http').request({hostname:'voh.russianpost.ru',port:8080,method:'POST',path:'/niips-operationhistory-web/OperationHistory',headers:{'Content-Type': 'text/xml', SOAPAction: '\"\"'}, body : '<xml/>'})"
 *
 * calc "require('http').request({hostname:'myx.ru',port:80,method:'GET',path:'/', body : ''})"
 *
 * calc "require('http').request({hostname:'myx.ru',port:80,method:'GET',path:'/info/', headers : { a : 5 }, body : ''})"
 * 
 * calc "require('http').request.asString({hostname:'myx.ru',port:80,method:'GET',path:'/info/', headers : { a : 5 }, body : ''})"
 */

/**
 * 
 * @param parameters {
 * 	method : method name, such as "GET", "POST", "PUT",
 * }
 * @param callback - query is synchronous when no callback passed
 */
httpRequest.asString = function(parameters, callback){
	if(!callback){
		var future = new FutureSimpleString();
		/*future.cancellable = */httpRequest.asString(parameters, internCallbackSetFuture.bind(future, parameters));
		return future;
	}
	if('function' !== typeof callback){
		throw new TypeError("callback present, but not a function, typeof: " + typeof callback);
	}
	callback = internRequestCallbackMessageToString.bind(callback, parameters);
	callback = internRequestCallbackMessageWithRedirects.bind(callback, parameters);
	callback = internConnectThenRequestCallbackMessage.bind(callback, parameters);
	return setTimeout(callback, 0);
};

/**
 * 
 * @param parameters {
 * 	method : method name, such as "GET", "POST", "PUT",
 * }
 * @param callback - query is synchronous when no callback passed
 */
httpRequest.asBinary = function(parameters, callback){
	if(!callback){
		const future = new FutureSimpleBinary();
		/*future.cancellable = */httpRequest.asBinary(parameters, internCallbackSetFuture.bind(future, parameters));
		return future;
	}
	if('function' !== typeof callback){
		throw new TypeError("callback present, but not a function, typeof: " + typeof callback);
	}
	callback = internRequestCallbackMessageToBinary.bind(callback, parameters);
	callback = internRequestCallbackMessageWithRedirects.bind(callback, parameters);
	callback = internConnectThenRequestCallbackMessage.bind(callback, parameters);
	return setTimeout(callback, 0);
};


module.exports = {
	ClientRequest : ClientRequest,
	/**
	 * get.
	 * 
	 * <code>
	 * require('http').get('http://myx.ru/info')
	 * require('http').get('http://myx.ru/info/')
	 * </code>
	 * 
	 * <code>
	 * require('http').get.asString('http://myx.ru/info')
	 * require('http').get.asString('http://myx.ru/info/')
	 * </code>
	 * 
	 * <code>
	 * require('http').get.asString('https://myx.ru/info/')
	 * require('http').get.asBinary('https://myx.ru/info/')
	 * require('http').get.asString('https://ndls.ndm.myx.ru/administration/listAccounts')
	 * require('http').get('https://ndls.ndm.myx.ru/administration/listAccounts')
	 * </code>
	 * 
	 * <ul>callback is:
	 * <li>for 'get': function(message)</li>
	 * <li>for 'get.asString': function(textBody[, resultCode, textError])</li>
	 * <li>for 'get.asBinary': function(binaryBody[, resultCode, textError])</li>
	 * </ul>
	 */
	get : httpGet,
	/**
	 * post.
	 * 
	 * <code>
	 * require('http').post('http://myx.ru/info/', { var1 : 1, var2 : '22222' })
	 * </code>
	 * 
	 * <code>
	 * require('http').post.asString('http://myx.ru/info/', { var1 : 1, var2 : '22222' })
	 * </code>
	 * 
	 * <code>
	 * require('http').post.asBinary('http://myx.ru/info/', { var1 : 1, var2 : '22222' })
	 * </code>
	 * 
	 * <ul>callback is:
	 * <li>for 'post': function(message)</li>
	 * <li>for 'post.asString': function(textBody[, resultCode, textError])</li>
	 * <li>for 'post.asBinary': function(binaryBody[, resultCode, textError])</li>
	 * </ul>
	 */
	post : httpPost,
	put : httpPut,
	/**
	 * request.
	 * 
	 * <code>
	 * require('http').request({hostname:'myx.ru', port:80, method:'GET',path:'/info/', headers : { a : 5 }, body : ''})
	 * </code>
	 * 
	 * <code>
	 * require('http').request.asString({hostname:'myx.ru', port:80, method:'GET', path:'/info/', headers : { a : 5 }, body : ''})
	 * </code>
	 * 
	 * <code>
	 * require('http').request.asBinary({hostname:'myx.ru', port:80, method:'GET', path:'/info/', headers : { a : 5 }, body : ''})
	 * </code>
	 * 
	 * <ul>callback is:
	 * <li>for 'request': function(message)</li>
	 * <li>for 'request.asString': function(textBody[, resultCode, textError])</li>
	 * <li>for 'request.asBinary': function(binaryBody[, resultCode, textError])</li>
	 * </ul>
	 */
	request : httpRequest,
};