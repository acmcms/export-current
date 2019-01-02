/**
 * Mapping as the most basic functionality provided is a Map object functionality 
 * with default key/value listing.
 */

/**
 * constructor
 */
function AbstractMappingPage(){
	this.AbstractWebPage();
	return this;
}

function fnHandle(context){
	const query = context.query;
	const identifier = query.resourceIdentifier;
	const parameters = query.parameters;
}

AbstractMappingPage.prototype = Object.create( require('./AbstractWebPage').prototype, {
	AbstractMappingPage : {
		value : AbstractMappingPage
	},
	handle : {
		value : fnHandle
	},
});


module.exports = AbstractMappingPage;