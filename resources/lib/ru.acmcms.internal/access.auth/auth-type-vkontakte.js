import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.VkontakteApi;
import org.scribe.model.Verifier;
import org.scribe.model.Token;
import org.scribe.model.OAuthRequest;
import org.scribe.model.OAuthConstants;
import org.scribe.model.Response;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;

var network_id = 'vkontakte';
var key = Application.vkontakteKey;
var secret = Application.vkontakteSecret;
var profileUrl = function profileUrl(network_uid){
	return "https://api.vkontakte.ru/method/getProfiles?uids="+network_uid+"&fields=sex,bdate,city,photo";
};
var scope = 'email';

var oauth = require("ru.acmcms.internal/access.auth/common-oauth");

function parseResponse(response, network_uid){
	var dataRaw = (new Function("return " + response))().response[0];
	var uid = network_id + '-' + network_uid;
	var data = {};
	data.network_id = network_id;
	data.network_uid = network_uid;
	data.uid = uid;
	data.firstname = dataRaw.first_name;
	data.lastname = dataRaw.last_name;
	data.gender = dataRaw.sex == 2 ? 'male' : 'female';
	data.avatarUrl = dataRaw.photo;
	var bdate = dataRaw.bdate;
	if(bdate){
		var splited = split(bdate, '.');
		data.bday = splited[0];
		data.bmonth = splited[1];
		if(splited.length == 3){
			data.byear = splited[2];
		}
	}
	return data;
};

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

	var service = new ServiceBuilder().provider(VkontakteApi).apiKey(key).apiSecret(secret).callback(callbackUrl).scope(scope).build();
	startContext.url = service.getAuthorizationUrl(null);
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
	if(!parameters.code){
		return false;
	}

	var currentUserProfile = User.getUser().getProfile();
	var callbackUrl = currentUserProfile.callbackUrl;
	if(!callbackUrl){
		return false;
	}
	delete currentUserProfile.callbackUrl;
	User.getUser().setProfile(currentUserProfile);

	var service = new ServiceBuilder().provider(VkontakteApi).apiKey(key).apiSecret(secret).callback(callbackUrl).scope(scope).build();
	var verifier = new Verifier(parameters.code);
	var api = new VkontakteApi();
	var accessTokenRequest = new OAuthRequest(api.getAccessTokenVerb(), api.getAccessTokenEndpoint());
	accessTokenRequest.addQuerystringParameter(OAuthConstants.CLIENT_ID, key);
	accessTokenRequest.addQuerystringParameter(OAuthConstants.CLIENT_SECRET, secret);
	accessTokenRequest.addQuerystringParameter(OAuthConstants.CODE, verifier.getValue());
	accessTokenRequest.addQuerystringParameter(OAuthConstants.REDIRECT_URI, callbackUrl);
	accessTokenRequest.addQuerystringParameter(OAuthConstants.SCOPE, scope);
	var accessTokenRaw = accessTokenRequest.send();
	var accessToken = api.getAccessTokenExtractor().extract(accessTokenRaw.getBody());
	var network_uid = (new Function("return " + accessTokenRaw.getBody()))().user_id;
	var request = new OAuthRequest(Verb.GET, profileUrl(network_uid));
	service.signRequest(accessToken, request);
	var response = request.send();

	var data = parseResponse(response.getBody(), network_uid);

	var user = oauth.getCurrentUser(data.network_id, data.network_uid);
	user.setProfile(data.uid, data);

	checkContext.userId = user.getKey();
	return true;
};
