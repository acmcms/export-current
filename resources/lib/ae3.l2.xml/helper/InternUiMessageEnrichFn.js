/**
 * this must be bint to XmlSkinHelper instance
 */


function internUiMessageEnrich(value, /* optional */ layout){
	if(value === null || value === undefined || "object" !== typeof value || Array.isArray(value)){
		return value;
	}
	
	/** populate message from content unless content is same as detail **/
	if(value.content && !value.message && (value.content != value.detail)){
		layout ??= Object.create(value);
		layout.message = value.content;
	}

	if(!(layout ?? value).reason){
		layout ??= Object.create(value);
		layout.reason = layout.message?.reason || layout.message?.title || ("string" === typeof layout.message && layout.message) || layout.title
	}
	
	if(value.code && !(value.hl || value.icon) && (value.code^0 === value.code)){
		
		layout ??= Object.create(value);
		
		switch(value.code){
		case 200:
			layout.hl ??= "true";
			layout.icon ??= "tick";
			layout.rootName ??= "success";
			layout.reason ??= "Operation Successful";
			layout.message ??= "The request seems to be satisfied with no further detail provided.";
			break;

		case 400:
			layout.hl ??= "error";
			layout.icon ??= "stop";
			layout.rootName ??= "invalid";
			layout.reason ??= "Invalid Request";
			layout.message ??= "Some of request arguments or format are unacceptable, out of range or malformed.";
			break;

		case 403:
			layout.hl ??= "error";
			layout.icon ??= "delete";
			layout.rootName ??= "denied";
			layout.reason ??= "Access Denied";
			layout.message ??= "The account is not granted with permission to execute the operation requested.";
			break;

		case 404:
			layout.hl ??= "error";
			layout.icon ??= "error_delete";
			layout.rootName ??= "unknown";
			layout.reason ??= "Resource Not Found";
			layout.message ??= "The client request references to resource that cannot be found or identified. Please, check the URL and other parameters of your request or contact an administrator if you believe that request is correct.";
			break;

		case 500:
			layout.hl ??= "error";
			layout.icon ??= "exclamation";
			layout.rootName ??= "error";
			layout.reason ??= "Internal Server Failure";
			layout.message ??= "The server encountered an internal problem while trying to satisfy the client request. Please, contact the administrator if you are concerned or if problem persists.";
			break;

		default:
			
			switch((value.code / 100)^0){
			case 2:
				layout.hl ??= "true";
				layout.icon ??= "tick";
				layout.rootName ??= "updated";
				layout.reason ??= "Operation Successful";
				layout.message ??= "The request seems to be satisfied with no further detail provided.";
				break;

			case 4:
				layout.hl ??= "error";
				layout.icon ??= "error_delete";
				layout.rootName ??= "failed";
				layout.reason ??= "Unclassified Client Failure";
				layout.message ??= "The client request is not considered valid and will not be served.";
				break;

			case 5:
				layout.hl ??= "error";
				layout.icon ??= "exclamation";
				layout.rootName ??= "failed";
				layout.reason ??= "Unclassified Server Failure";
				layout.message ??= "The server encountered an unsolvable problem while trying to satisfy the client request.";
				break;
			}
		}
		
		/**
		 * set default message icon
		 */
		layout.icon ??= "email_open";
		
	}
	
	var key, vale, repl;
	for(key of ["message", "detail"]){
		// assignment in condition //
		if( (vale = (layout ?? value)[key]) ){
			
			if("string" === typeof vale){
				
				if("detail" === key || vale.includes("\n")){
					layout ??= Object.create(value);
					layout[key] = {
						layout : "formatted",
						variant : "code",
						cssClass : "style--block",
						value : [ vale ]
					};
				}
				
			}else //
			
			// assignment in condition //
			if( (repl = this.internReplaceValue(vale)) !== vale){
				
				layout ??= Object.create(value);
				layout[key] = repl;
				
			}
			
		}
	}
	
	return layout ?? value;
}

module.exports = internUiMessageEnrich;
