/**
 * 
 */

const title = "AE3::developer/denied (Access Denied)";

module.exports = function runDenied(context){
	
	context.title = title;
	
	const share = context.share;
	share.authRequireAccount(context);
	
	return share.makeAccessDeniedLayout(title);
	
};
