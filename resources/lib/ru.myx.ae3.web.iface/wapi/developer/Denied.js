const title = "AE3::developer/denied (Access Denied)";

function runDenied(context){
	const share = context.share;
	share.authRequireAccount(context);
	
	return share.makeAccessDeniedLayout(title);
}

module.exports = runDenied;
