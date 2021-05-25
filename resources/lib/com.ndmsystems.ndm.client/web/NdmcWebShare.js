const ae3 = require('ae3');

const NdmcWebShare = module.exports = ae3.Class.create(
	"NdmcWebShare",
	require('ae3.web/Share'),
	function(){
		this.Share();
		return this;
	},
	{
		systemName : {
			value : 'NDMC (Network Device Management Client)'
		},
		authenticationProvider : {
			value : null
		},
		index : {
			get : function(){
				return this.index = require('./Index')
			}
		},
		onDrill : {
			value : function(context){
				Object.defineProperty(context, 'ndmc', this.ndssPropertyDescriptor);
				return this.index;
			}
		},
		onHandle : {
			value : function(context){
				Object.defineProperty(context, 'ndmc', this.ndssPropertyDescriptor);
				return this.index.handle(context);
			}
		}
	}
);