exports.mainUrlPrefix = function(){
	var request = Request.currentRequest;
	/**
	 * TODO: need more precise check here actually. need to be sure that is is 
	 * actually imported into a ctrl-temp-ie6 skin. It is not possible to implement
	 * yet.
	 */
	var absolute = request.resourceIdentifier.indexOf("/linkchooser-modal/") == -1;
	
	return absolute
		? "/!/skin/ctrl-temp-ie6/"
		: "../";
};