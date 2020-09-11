
const UiBasic = module.exports = require('ae3').Class.create(
	/* name */
	"UiBasic",
	/* inherit */
	undefined,
	/* constructor */
	function(){
		return this;
	},
	/* instance */
	{
		createAuthPersonal : {
			value : function createAuthPersonal(props){
				const auth = this.authenticationProvider;
				if(!auth){
					throw new Error("No 'auth' is defined for given interface, cannot create 'AuthPersonal' module!");
				}
				return require('ae3.web/AuthPersonalPage').create(props, auth);
			}
		},
		createIndex : {
			/**
			 * 
			 * @param props { title, auth, menu, commands }
			 * @returns
			 */
			value : function createIndex(props){
				return require('ae3.web/IndexPage').create(props);
			}
		},
		clientElement : {
			/**
			 * <code>
			 * {
			 * 	query : context.query,
			 * 	admin : false,
			 * 	id : 'ndm-myx',
			 * 	date : new Date(),
			 * 	menu : {
			 * 	},
			 * 	help : {
			 * 	
			 * 	}
			 * }
			 * </code>
			 * 
			 * @param client
			 * @param admin
			 * @param query
			 * @returns
			 */
			value : function clientElement(client, admin, query){
				if(!client){
					return Format.xmlElement('client', {
						geo : query.attributes['Geo-Mean'],
						ip : query.sourceAddress,
					});
				}
				query || (query = client.query);
				admin === undefined && (admin = client.admin);
				var command, icon;
				if(client.userId){
					import ru.myx.ae3.help.QueryString;
					var params = QueryString.parseQueryString(query.parameterString, 'utf-8');
					delete params.authUserId;
					command = '?' + Format.queryStringParameters(params);
					icon = "cross";
				}
				return Format.xmlElement('client', {
					id : String(client.id || ("string" === typeof client ? client : '')),
					admin : admin || client.admin,
					geo : query.attributes['Geo-Mean'],
					ip : query.sourceAddress,
					userId : client.userId,
					icon : icon,
					command : command,
					ae3 : query.parameters.ae3 === 'true' || undefined,
					date : (client.date || (new Date())).toISOString(),
					time : client.time,
					menu : client.menu,
					help : client.help,
					standalone : !!client.standalone,
					format : client.uiFormat || query.parameters.___output
				});
			}
		},
		layoutUnmaskable : {
			value : function(query, layout){
				const Reply = require('ae3').Reply;
				return Reply.exception(
					Reply.object( "unmaskable", query, layout)
				);
			}
		},
		layoutAccessDeniedUnmaskable : {
			value : function(query, message, detail){
				const Reply = require('ae3').Reply;
				return Reply.exception(
					Reply.object( "unmaskable", query, this.makeAccessDeniedLayout(message, detail) )
				);
			}
		},
		makeAccessDeniedLayout : {
			value : function(message, detail){
				return {
					layout : 'message',
					rootName : (message || '').rootName || 'denied',
					code : detail && detail.code || 403,
					message : message,
					detail : detail
				};
			}
		},
		makeUpdateSuccessLayout : {
			value : function(message, detail){
				return {
					layout : 'message',
					rootName : (message || '').rootName || 'success',
					code : (message || detail || '').code || 200,
					message : message,
					detail : detail
				};
			}
		},
		makeClientFailureLayout : {
			value : function(message, detail){
				return {
					layout : 'message',
					rootName : (message || '').rootName || 'failed',
					code : (message || detail || '').code || 400,
					message : message,
					detail : detail
				};
			}
		},
		makeNotFoundLayout : {
			value : function(message, detail){
				return {
					layout : 'message',
					rootName : (message || '').rootName || 'unknown',
					code : (message || detail || '').code || 404,
					message : message,
					detail : detail
				};
			}
		},
		makeServerFailureLayout : {
			value : function(message, detail){
				return {
					layout : 'message',
					rootName : (message || '').rootName || 'error',
					code : (message || detail || '').code || 500,
					message : message,
					detail : detail
				};
			}
		}
	}
);
