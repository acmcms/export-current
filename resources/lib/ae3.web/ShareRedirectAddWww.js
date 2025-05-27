/**
 * 
 */

const ae3 = require("ae3");

const ShareRedirectAddWww = module.exports = ae3.Class.create(
	"ShareRedirectAddWww",
	require('./Share'),
	function ShareRedirectAddWww(){
		this.Share();
		return this;
	},
	{
		onHandle : {
			value : function(context){
				const query = context.query;
				const target = query.target;

				if(target.startsWith('www.')){
					return {
						layout : 'message',
						code : 404,
						content : 'No share, www (' + target + ') is unknown!'
					};
				}

				const Reply = require("ae3").Reply;
				return Reply.redirect('skin-land-prepend-www', query, true, 'http://www.' + target);
			}
		},
		toString : {
			value : function(){
				return '[ShareRedirectAddWww]';
			}
		}
	}
);
