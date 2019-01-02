exports.getUrl = function(email, size, dimg) {
	if (!size) {
		size = 60;
	}
	if (!dimg) {
		dimg = "mm";
	}
	var digest = binaryDigest(email.toLowerCase().trim());
	var url = 'http://gravatar.com/avatar/' + digest + '.jpg';
	url = Request.modifyQueryStringParameter(url, 'd', UrlToString(dimg));
	url = Request.modifyQueryStringParameter(url, 's', size);
	return url;
};