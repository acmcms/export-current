/**
 * Auth type: email.
 */



exports.startAuth = function startAuth(startContext, returnLocation) {
	return false;
};

exports.showForm = function showForm(startContext) {
	return {
		code : 472,
		layout	: 'data-form',
		title	: 'E-mail authentication',
		fields	: [
			{
				id		: 'email',
				name	: 'email',
				layout	: 'field',
				"class"	: 'string',
				variant	: 'email',
				title	: 'Enter Your e-mail address',
				hint	: 'activation code will be sent to this address',
				example	: 'someone@somewhere.net',
				min		: 1
			}
		],
		hidden	: {
			step	: ''
		},
		submit	: '/login.user?tp=atmail&__auth_type=email'
	};
};

exports.checkAuth = function checkAuth(checkContext, parameters) {
	return false;
};