exports.onEnter = function(context, query){
	return {
		layout	: "message-share-unknown",
		comment	: "Produced by /lib/ru.acmcms.handlers/UndefinedHandler",
		share	: context.query.target
	};
};

exports.onHandle = function(context, query){
	return this.onEnter(context, context.query);
};

exports.onLeave = function(context, query, response){
	return response;
};