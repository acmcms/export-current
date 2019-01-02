const title = "AE3::developer/authenticationSuccess (Successful Authentication)";

function runAuth(context){
	const share = context.share;
	const client = share.authRequireAccount(context);
	
	context.title = title;
	
	return share.makeAuthenticationSuccessReply(context);
}

module.exports = runAuth;
