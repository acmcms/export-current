var Geography = require('java.class/ru.myx.geo.GeographyAPI');

function handle(context){
	const query = context.query;
	const rid = query.resourceIdentifier;
	if(rid === '/'){
		return {
			layout	: "final",
			type	: "text/plain",
			content	: Geography.getCountryCodeForAddressSafe(query.sourceAddress, "**")
		};
	}
	return {
		layout	: "final",
		type	: "text/xml",
		content	: "<xml/>"
	};
}



exports.handle = handle;
