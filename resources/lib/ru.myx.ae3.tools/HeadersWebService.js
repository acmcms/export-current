
module.exports = function(context){
	const query = context.query;
	const rid = query.resourceIdentifier;
	if(rid === '/'){
		return {
			layout	: "final",
			type	: "text/plain",
			content	: Format.jsObjectReadable(query.attributes)
		};
	}
	return {
		layout	: "final",
		type	: "text/plain",
		content	: Format.jsObjectReadable(query.attributes)
	};
};
