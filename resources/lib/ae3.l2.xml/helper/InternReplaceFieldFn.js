/**
 * this must be bint to XmlSkinHelper instance
 */


function internReplaceField(values, edit, field){
	const key = field.id || field.name;
	const val = values 
		? key === "." ? values : values[key] 
		: null
	;
	if(val !== undefined && val !== null && val !== values && "object" !== typeof val){
		values[key] = [ val ];
	}
	if(field.type === "set" || field.type === "select"){
		if(edit && field.list?.columns?.map){
			const list = field.list
			const input = field.type === "set" ? "checkbox" : "radio";
			const required = input === "checkbox" ? false : undefined;
			return Object.create(field, {
				list : { 
					value : {
						attributes : list.attributes,
						columns : { 
							column : [{
								id : "value",
								name : "value",
								title : input === "radio" ? " ๏ " : " ☑ ", // ☒
								type : "input",
								extraClass : "ui-align-center",
								variant : input,
								required : required,
								selected : field.selected,
								name : field.id || field.name
							}].concat(list.columns)
						},
						rows : list.rows
					}
				},
			});
		}
		if(field.variant === "edit" && field.options){
			return Object.create(field, {
				options : { value : null },
				option : { 
					enumerable : true, 
					value : Array(field.options).map(function(option){
						if(option.fields?.map){
							return Object.create(option, {
								fields : {
									enumerable : true, 
									value : {
										field : option.fields.map(this.internReplaceField.bind(this, values, edit))
									}
								}
							});
						}
						return option;
					}, this) 
				},
			});
		}
	}
	switch(field.variant){
	case "sequence":{
		var enm = field.elementName || "item";
		var arr = val?.[enm];
		if(!arr){
			return field;
		}
		key === "." || (val = values[key] = Object.create(val));
		val[enm] = Array(arr).map(this.internReplaceValue, this);
		return field;
	}
	case "select":
		if(field.options){
			return Object.create(field, {
				options : { value : null },
				option : { 
					enumerable : true, 
					value : Array(field.options).map(function(option){
						if(option.fields?.map){
							return Object.create(option, {
								fields : {
									enumerable : true,
									value : {
										field : option.fields.map(this.internReplaceField.bind(this, values, edit))
									}
								}
							});
						}
						return option;
					}, this) 
				},
			});
		}
		return field;
	case "view":
	case "form":{
		if(!key){
			if(field.value){
				var rep = this.internReplaceValue(field.value);
				if(rep !== undefined && rep !== null && "object" !== typeof rep){
					rep = [ rep ];
				}
				(field = Object.create(field)).value = rep;
			}
		}else//
		if(values){
			var idx, ext, rep, nxt;
			if(val?.layout){
				rep = this.internReplaceValue(val);
				if(rep !== undefined && rep !== null && "object" !== typeof rep){
					rep = [ rep ];
				}
				values[key] = rep;
				return field;
			}
			for(idx in val){
				ext = val[idx];
				rep = this.internReplaceValue(ext);
				if(rep !== undefined && rep !== null && "object" !== typeof rep){
					rep = [ rep ];
				}
				if(rep !== ext){
					if(!nxt){
						nxt = Object.create(val);
						values[key] = nxt;
					}
					nxt[idx] = rep;
				}
			}
		}
		if(field.fields && Array.isArray(field.fields)){
			return Object.create(field, {
				fields : { enumerable : true, value : { field : field.fields } },
			});
		}
		return field;
	}
	case "list":
		if(field.columns && Array.isArray(field.columns)){
			return Object.create(field, {
				columns : { enumerable : true, value : { column : field.columns } },
			});
		}
		return field;
	default:
		return field;
	}
}

module.exports = internReplaceField;
