const ae3 = require('ae3');

const CallbackSucceed = module.exports = ae3.Class.create(
	"CallbackSucceed",
	require("./../AbstractCallback"),
	function CallbackSucceed(){
		return this;
	},
	{
		"executeCallback" : {
			value : function(client){
				console.log(">>>>>> ndm.client:callback:cloud/succeed");
			}
		},
	}
);
