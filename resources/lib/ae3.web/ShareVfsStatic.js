/**
 * 
 */

const ae3 = require("ae3");

const ShareVfsStatic = module.exports = ae3.Class.create(
	"ShareVfsStatic",
	require('./Share'),
	function ShareVfsStatic(settings){
		this.index = settings.index || 'index.htm';
		
		this.path = settings.path;
		this.root = require("ae3").vfs.ROOT.relativeFolder(this.path);
		
		this.Share();
		return this;
	},
	{
		onHandle : {
			value : function(context){
				return this.root
					? this.root.relative(context.query.resourceIdentifier.substr(1) || this.index, null)
					: {
						layout : 'message',
						code : 404,
						content : 'No path or invalid path: ' + this.path
					}
				;
			}
		},
		toString : {
			value : function(){
				return '[ShareVfsStatic]';
			}
		}
	}
);
