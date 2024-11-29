/**
 * URL object, part of CommonJS standard de-facto.
 * see: http://nodejs.org/api/url.html
 */

function urlToString(){
	return this.href;
}


function urlParse(urlStr){
	import java.net.URL;
	var javaUrl;
	try{
		javaUrl = new URL(urlStr);
	}catch(e){
		throw new Error("Invalid URL: " + e.message);
	}
	
	var h = javaUrl.host;
	var p = javaUrl.port;
	var q = javaUrl.query;
	var r = javaUrl.ref;
	
	return {
		href : urlStr,
		protocol : javaUrl.protocol + ':',
		host : p <= 0 ? h : h + ':' + p,
		auth : javaUrl.userInfo,
		hostname : h,
		port : p <= 0 ? null : p,
		pathname : javaUrl.path,
		search : q ? '?' + q : null,
		path : javaUrl.file,
		query : q,
		hash : r ? '#' + r : null,
		toString : urlToString
	};
}


module.exports = {
	parse : urlParse,
	format : urlFormat,
};