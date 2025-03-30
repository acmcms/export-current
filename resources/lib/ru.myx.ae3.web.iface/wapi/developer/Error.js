/**
 * 
 */

const lib = require('ru.myx.ae3.web.iface/Ae3WebService');
const title = "AE3::developer/error (Error)";

module.exports = function(context){
	const query = context.query;
	const client = context.share.authCheckQuery(query);
	
	context.title = title;
	
	throw "This is an expected text error! 8-)";
};
