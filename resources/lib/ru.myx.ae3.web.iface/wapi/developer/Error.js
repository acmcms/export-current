var lib = require('ru.myx.ae3.web.iface/Ae3WebService');
var title = "AE3::developer/error (Error)";

function runError(context){
	const query = context.query;
	const client = context.share.authCheckQuery(query);
	
	throw "This is an expected text error! 8-)";
}

module.exports = runError;
