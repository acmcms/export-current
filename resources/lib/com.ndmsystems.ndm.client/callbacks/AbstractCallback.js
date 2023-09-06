const ae3 = require("ae3");

/**
 * https://ndss.ndmsystems.com/documentation#cloud-callbacks
 */

const AbstractCallback = module.exports = ae3.Class.create(
	"AbstractCallback",
	undefined,
	function(args){
		return this;
	},
	{
		"prepareCallback" : {
			/** extra validation check, should be quick */
			value : function(component){
				return true;
			}
		},
		"executeCallback" : {
			/** executed async after arguments are accepted */
			value : function(component){
				throw new Error("Should be overriden!");
			}
		}
	}
);
