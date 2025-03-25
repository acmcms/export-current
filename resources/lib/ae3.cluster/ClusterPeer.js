const ae3 = require("ae3");

const ClusterPeer = module.exports = ae3.Class.create(
	/* name */
	"ClusterPeer",
	/* inherit */
	undefined,
	/* constructor */
	function(name){
		this.name = name;
		Object.defineProperties(this, {
			"auth" : {
				value : null,
				configurable : true,
				writable : true
			},
			"origin" : {
				value : "CLUSTER-PEER",
				configurable : true,
				writable : true
			}
		});
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
		"httpRequest" : {
			/**
			 * uri - path and get parameters
			 * parameters - optional, more parameters
			 * options - optional, {
			 * 		method : "get",
			 * 		aggregate : "first"
			 * 		...
			 * }
			 * callback - optional, for async requests
			 */
			value : function(uri, parameters, options, callback){
				
			}
		},
		"toString" : {
			value : function(){
				return "[ClusterPeer "+Format.jsObject({name:this.name})+"]";
			}
		}
	}
);
