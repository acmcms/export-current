function ListingType(){
	return this;
}

Object.defineProperties(ListingType.prototype, {
	"onCreateInitialFormLayout" : {
		/**
		 * function onCreateInitialFormLayout()
		 * returns formLayoutMap
		 */
		value : null
	},
	"onCreateDynamicFormLayout" : {
		/**
		 * function onCreateDynamicFormLayout(formDataMap)
		 * returns null or formLayoutMap
		 */
		value : null
	},
	"onCreateAfterSubmit" : {
		/**
		 * function onCreateAfterSubmit(formDataMap)
		 * returns dataMap
		 */
		value : null
	},
	"onCreate" : {
		/**
		 * function onCreate(dataMap)
		 * returns undefined
		 */
		value : null
	},
	
	"onModifyInitialFormLayout" : {
		
	},
	"onModifyDynamicFormLayout" : {
		
	},
	"onModifyAfterSubmit" : {
		
	},
	"onModify" : {
		
	},
	
	
	"onDelete" : {
		
	},
	
	"toString" : {
		value : function(){
			return "ListingType";
		}
	}
});


module.exports = ListingType;