const ae3 = require("ae3");




const LastWebException = module.exports = ae3.Class.create(
	"LastWebException",
	undefined,
	function(index, systemName, pathPrefix){
		this.index = index;
		this.title = systemName + "::" + pathPrefix + "lastWebException (Last Web Share Exception)";
		return this;
	},
	{
		authRequired : {
			value : true
		},
		handle : {
			value : function(context){
				const share = context.share;
				const client = share.authRequireAccount(context, 'admin');
				const query = context.query;

				context.title = this.title;
				
				return require("ae3.web/Share").getLastExceptionLayout() || share.makeUpdateSuccessLayout("No exception recorded since boot.");
			}
		}
	}
);
