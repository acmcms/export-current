/**
 * 
 * Command with form(s) to enter command parameters.
 * 
 * @returns
 */

function CommandType(){
	return this;
}

Object.defineProperties(CommandType.prototype, {
	"onExecuteInitialFormLayout" : {
		/**
		 * function()
		 * returns formLayoutMap
		 */
		value : null
	},
	"onExecuteDynamicFormLayout" : {
		/**
		 * function(formDataMap)
		 * returns null or formLayoutMap
		 */
		value : null
	},
	"onExecuteAfterSubmit" : {
		/**
		 * function(formDataMap)
		 * returns dataMap
		 */
		value : null
	},
	"onExecute" : {
		/**
		 * function(dataMap)
		 * returns undefined
		 */
		value : null
	},
	
	"toString" : {
		value : function(){
			return "CommandType";
		}
	}
});


module.exports = CommandType;