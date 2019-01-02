exports.onHandle = function(context){
	const query = context.query;
	const rid = query.resourceIdentifier;
	if(rid === '/'){
		return {
			layout	: "final",
			type	: "text/plain",
			content	: query.sourceAddress + '\n'
		};
	}
	return {
		layout	: "final",
		type	: "text/xml",
		content	: "<xml/>"
	};
};
