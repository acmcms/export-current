/**
 * QueryString object, part of CommonJS standard de-facto.
 * see: http://nodejs.org/api/querystring.html
 */

import ru.myx.ae3.help.QueryString;
import ru.myx.ae3.help.Text;

function stringify(obj, sep, eq) {
	if(!sep && !eq){
		return QueryString.stringify(obj);
	}
	throw new Error("Only one parameter version is supported (stringify)!");
}

function parse(string, sep, eq) {
	if(!sep && !eq){
		return QueryString.parse(string);
	}
	throw new Error("Only one parameter version is supported (parse)!");
}

function escape(x) {
	return Text.encodeUriComponent( x, "utf-8" );
}

function unescape(x) {
	return Text.decodeUri( x, "utf-8" )
}


module.exports = {
	stringify : stringify,
	parse : parse,
	escape : escape,
	unescape : unescape
};