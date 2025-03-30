/**
 * this must be bint to XmlSkinHelper instance
 */


function internReplaceValue(value){
	if(value === null || value === undefined || "object" !== typeof value || Array.isArray(value)){
		return value;
	}
	
	var layout, values;
	switch(value.layout){
	case "data-view":
		
		layout = Object.create(value);
		layout.layout = "view";
		values = "object" === typeof value.values ? Object.create(value.values) : {};
		value.fields && (layout.fields = {
			field : value.fields.map(this.internReplaceField.bind(this, values, false))
		});
		value.values && (layout.values = null);
		for(var valueKey in values){
			layout[valueKey] = this.internReplaceValue(values[valueKey]);
		}
		value.commands && (layout.fields.command = value.commands, layout.commands = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
		
	case "data-form":
		
		layout = Object.create(value);
		layout.layout = "form";
		layout.values = "object" === typeof value.values ? Object.create(value.values) : {};
		value.fields && (layout.fields = {
			field : value.fields.map(this.internReplaceField.bind(this, layout.values, true))
		});
		/**
		if("object" === typeof value.values){
			for(var valueKey in value.values){
				layout.values[valueKey] = this.internReplaceValue(layout.values[valueKey]);
			}
		}
		*/
		value.commands && (layout.fields.command = value.commands, layout.commands = null);
		value.submit && (layout.fields.submit = value.submit, layout.submit = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
		
	case "data-list":
	case "data-table":
		
		layout = Object.create(value);
		layout.layout = "list";
		value.columns && (layout.columns = {
			column : value.columns.map(this.internReplaceField.bind(this, null, false))
		});
		if(value.elementName || (value.rows && !value.rows.row && Array.isArray(value.rows))){
			layout.rows = null;
			layout.item = value.rows.map(this.internReplaceValue, this);
		}
		value.commands && (layout.columns.command = value.commands, layout.commands = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
		
	case "message": 
	
		if(value.code && !(value.hl || value.icon) && (value.code^0 === value.code)){
			layout = Object.create(value);
			// layout.layout = "message";
			switch(value.code){
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
				layout.rootName ??= "failed";
				layout.reason ??= "Resource Not Found";
				layout.message ??= "The client request references to resource that cannot be found or identified. Please, check the URL and other parameters of your request or contact an administrator if you believe that request is correct.";
				break;

			case 500:
				layout.hl ??= "error";
				layout.icon ??= "exclamation";
				layout.rootName ??= "failed";
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
		}
		break;
		
	case "documentation":
		
		layout = Object.create(value);
		// layout.layout = "documentation";
		value.commands && (layout.fields.command = value.commands, layout.commands = null);
		value.help && (layout.fields.help = value.help, layout.help = null);
		return layout;
	}
	
	var key, vale, repl;
	for(key in value){
		vale = value[key];
		/** assignment in condition **/
		if( (repl = this.internReplaceValue(vale)) !== vale){
			layout ??= Object.create(value);
			layout[key] = repl;
		}
	}
	return layout ?? value;
}

module.exports = internReplaceValue;
