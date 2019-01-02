const title = "AE3::developer/authenticationFailed (Failed Authentication)";

function runAuth(context){
	const share = context.share;
	const client = share.authRequireAccount(context);
	
	context.title = title;
	
	return share.makeAuthenticationFailedReply(context);
}

module.exports = runAuth;
