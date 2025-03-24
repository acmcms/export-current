import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.FacebookApi;
import org.scribe.model.Verifier;
import org.scribe.model.Token;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;

var network_id = 'facebook';
var profileUrl = "https://graph.facebook.com/me";

var key = Application.facebookKey;
var secret = Application.facebookSecret;

var scope = 'email,user_birthday';

function parseResponse(response){
	var dataRaw = (new Function("return " + response))();
	var uid = network_id + '-' + dataRaw.id;
	var data = {};
	data.network_id = network_id;
	data.network_uid = dataRaw.id;
	data.uid = uid;
	data.firstname = dataRaw.first_name;
	data.lastname = dataRaw.last_name;
	data.gender = dataRaw.gender;
	data.email = dataRaw.email;
	data.city = (dataRaw.hometown?.name) || (dataRaw.location?.name);
	var bdate = dataRaw.birthday;
	if(bdate){
		var splited = bdate.split('/');
		data.bday = splited[1];
		data.bmonth = splited[0];
		data.byear = splited[2];
	}
	return data;
}

var supertype = require('ru.acmcms.internal/access.auth/AbstractOAuthAuthType');
var prototype = {
	startAuthentication : function startAuthentication(startContext, returnLocation) {
		var callbackUrl = this.buildAcmAuthCallbackUrl(network_id, returnLocation);

		User.ensureAutomaticAuthorization();
		var user = User.getUser();
		var profile = user.getProfile();
		profile.callbackUrl = callbackUrl;
		user.setProfile(profile);
		/**
		 * no need for user.commit, setProfile is irrelevant to this method.
		 */
		// user.commit();

		var service = new ServiceBuilder().provider(FacebookApi).apiKey(key).apiSecret(secret).callback(callbackUrl).scope(scope).build();
		startContext.url = service.getAuthorizationUrl(null)
		return true;
	},
	checkAuthentication : function checkAuthentication(checkContext, parameters){
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

		var service = new ServiceBuilder().provider(FacebookApi).apiKey(key).apiSecret(secret).callback(callbackUrl).scope(scope).build();
		var verifier = new Verifier(parameters.code);
		var accessToken = service.getAccessToken(null, verifier);
		var request = new OAuthRequest(Verb.GET, profileUrl);
		service.signRequest(accessToken, request);
		var response = request.send();
		var data = parseResponse(response.getBody());

		var user = this.getCurrentUser(data.network_id, data.network_uid);
		user.setProfile(data.uid, data);

		checkContext.userId = user.getKey();
		return true;
	}
};

var AuthTypeFacebook = function AuthFacebook(){
	// does nothing
};
AuthTypeFacebook.prototype = Layouts.extend(prototype, supertype);

module.exports = AuthTypeFacebook;