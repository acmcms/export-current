function FiltersFormLayout(filters){
	this.fields	= { 
		field	: filters.fields, 
		submit	: this.submit
	};
	var key, value;
	for keys(key in filters.values){
		value = filters.values[key];
		if(value && !this[key]){
			this[key] = [ value ];
		}
	}
	return this;
}

Object.defineProperties(FiltersFormLayout.prototype, {
	layout	: {
		value : 'form',
		enumerable : true
	},
	title	: {
		value : 'Query Parameters',
		enumerable : true
	},
	zoom	: {
		value : 'row',
		enumerable : true
	},
	cssClass: {
		value : 'ui-secondary',
		enumerable : true
	},
	submit	: {
		value : {
			icon : 'application_put',
			title : 'Apply Query Parameters'
		}
	}
});

module.exports = FiltersFormLayout;