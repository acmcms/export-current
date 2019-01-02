var supertype = require('ru.acmcms.internal/access.auth/AbstractAuthType');
var prototype = {
		
};

var AbstractOAuthAuthType = function AbstractOAuthAuthType(){
	// does nothing
};
AbstractOAuthAuthType.prototype = Layouts.extend(prototype, supertype);

module.exports = AbstractOAuthAuthType;