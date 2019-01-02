import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.TwitterApi;
import org.scribe.model.Verifier;
import org.scribe.model.Token;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;



var network_id = 'twitter';
var key = Application.twitterKey;
var secret = Application.twitterSecret;
var profileUrl = "https://api.twitter.com/1/account/verify_credentials.xml";

var oauth = require("ru.acmcms.internal/access.auth/common-oauth");

function parseResponse(response){
	var dataRaw = xmlToMap(response);
	var data = {};
	var uid = network_id + '-' + dataRaw.id;
	data.network_id = network_id;
	data.network_uid = dataRaw.id;
	data.uid = uid;
	data.firstname = dataRaw.name;
	data.avatarUrl = dataRaw.profile_image_url;
	return data;
}

exports.startAuth = function startAuth(startContext, returnLocation) {
	var callbackUrl = oauth.buildAcmAuthCallbackUrl(network_id, returnLocation);

	/**
	 * Start session & tracking
	 */
	User.ensureAutomaticAuthorization();
	var user = User.getUser();
	var profile = user.getProfile();
	profile.callbackUrl = callbackUrl;
	user.setProfile(profile);
	/**
	 * no need for user.commit, setProfile is irrelevant to this method.
	 */
	// user.commit();

	var service = new ServiceBuilder().provider(TwitterApi.Authenticate).apiKey(key).apiSecret(secret).callback(callbackUrl).build();
	var requestToken = service.getRequestToken();
	startContext.url = service.getAuthorizationUrl(requestToken);
	return true;
};

exports.loginLocation = oauth.getLoginLocation;

exports.checkAuth = function checkAuth(checkContext, parameters){
	if(!key || !secret){
		return false;
	}
	if(parameters.denied) {
		return false;
	}
	if(!parameters.oauth_verifier || !parameters.oauth_token){
		return false;
	}

	var currentUserProfile = User.getUser().getProfile();
	var callbackUrl = currentUserProfile.callbackUrl;
	if(!callbackUrl){
		return false;
	}
	delete currentUserProfile.callbackUrl;
	User.getUser().setProfile(currentUserProfile);

	var service = new ServiceBuilder().provider(TwitterApi.Authenticate).apiKey(key).apiSecret(secret).callback(callbackUrl).build();
	var verifier = new Verifier(parameters.oauth_verifier);
	var accessToken = service.getAccessToken(new Token(parameters.oauth_token, secret), verifier);
	var request = new OAuthRequest(Verb.GET, profileUrl);
	service.signRequest(accessToken, request);
	var response = request.send();
	
	var data = parseResponse(response.getBody());
	
	var user = oauth.getCurrentUser(data.network_id, data.network_uid);
	user.setProfile(data.uid, data);
	
	checkContext.userId = user.getKey();
	return true;
};
