const title = "AE3::developer/authenticate (Ask Credentials)";

function runAuth(context){
	const share = context.share;
	const client = share.authRequireAccount(context);
	
	context.title = title;
	
	return share.makeAuthenticateReply(context);
}

module.exports = runAuth;
