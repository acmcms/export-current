/**
 *
 */


const WebInterface = require("ae3").web.WebInterface;


/**
 * 'this'- must be bint to an instance of Client
 */
const ClientOnUpdateLinkingXnsFn = module.exports = function(xnsId, xnsData){
	const links = [].concat(xnsData.link);
	
	// todo: compare cleanup Client.ndmpLinkings
};
