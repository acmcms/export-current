const ae3 = require("ae3");

const Cluster = module.exports = ae3.Class.create(
	/* name */
	"Cluster",
	/* inherit */
	undefined,
	/* constructor */
	function(name){
		this.name = name;
		return this;
	},
	/* instance */
	{
		"name" : {
			/**
			 * The unique friendly name
			 */
			value : undefined
		},
		"httpGet" : {
			value : function(uri, options){
				
			}
		},
		"toString" : {
			value : function(){
				return "[Cluster "+Format.jsObject({name:this.name})+"]";
			}
		}
	}
);
