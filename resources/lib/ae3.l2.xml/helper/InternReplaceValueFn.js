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
	
		layout = Object.create(value);
		// layout.layout = "message";
		
		this.internUiMessageEnrich(value, layout);
		
		/**
		 * not an attribue to be
		 */
		"string" === typeof layout.message && (layout.message = [layout.message]);
		"string" === typeof layout.detail && (layout.detail = [layout.detail]);
		
		return layout;
		
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
