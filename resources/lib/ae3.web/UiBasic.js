/**
 * 
 */

const ae3 = require("ae3");
const ReplyObject = ae3.Reply.object;
const ReplyException = ae3.Reply.exception;
const FormatXmlElement = Format.xmlElement;
const FormatQueryStringParameters = Format.queryStringParameters;

/**
 * bind first three arguments to constants to create different kinds of messages
 */
const PREPARE_MESSAGE = function(codeDefault, messageDefault, message, detail /* locals: */, result){
	message ??= messageDefault;
	
	if("string" === typeof message){
		return {
			layout : "message",
			code : (detail || "").code ?? codeDefault,
			reason : (detail || "").reason ?? (messageDefault != message && messageDefault) ?? undefined,
			message : message,
			detail : detail,
			"x-ui-debug" : "UiBasic-string"
		};
	}
	
	if(message.layout === "message"){
		return Object.assign(Object.create(message), {
			layout : "message",
			code : message.code ?? (detail || "").code ?? codeDefault,
			/** prevent self-recursion **/
			reason : message.reason ?? (detail || "").reason ?? messageDefault,
			message : message.message ?? message.content ?? message.value ?? message.title ?? (message.reason && messageDefault) ?? undefined,
			detail : detail,
			"x-ui-debug" : "UiBasic-message"
		});
	}
	
	if(message.layout){
		return Object.assign(Object.create(message.attributes ?? null), {
			layout : "message",
			code : message.code ?? (detail || "").code ?? codeDefault,
			/** prevent self-recursion **/
			reason : message.reason ?? (detail || "").reason ?? message.title ?? messageDefault,
			message : "string" === message.layout ? message : message.layout,
			detail : detail,
			cache : message.cache ?? message.attributes?.cache ?? undefined,
			delay : message.delay ?? message.attributes?.delay ?? undefined,
			"x-ui-debug" : "UiBasic-layout"
		});
	}
	
	return Object.assign(Object.create(message.attributes ?? message ?? null), {
		layout : "message",
		code : message.code ?? (detail || "").code ?? codeDefault,
		/** prevent self-recursion **/
		reason : message.reason ?? (detail || "").reason ?? messageDefault,
		message : message.message ?? message.content ?? message.value ?? message.title ?? (message.reason && messageDefault) ?? undefined,
		detail : detail,
		cache : message.cache ?? message.attributes?.cache ?? undefined,
		delay : message.delay ?? message.attributes?.delay ?? undefined,
		"x-ui-debug" : "UiBasic-object"
	});
};

/**
 * 
 */
const UiBasic = module.exports = ae3.Class.create(
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
				return require("ae3.web/AuthPersonalPage").create(props, auth);
			}
		},
		createIndex : {
			/**
			 * 
			 * @param props { title, auth, menu, commands }
			 * @returns
			 */
			value : function createIndex(props){
				return require("ae3.web/IndexPage").create(props);
			}
		},
		clientElement : {
			/**
			 * <code>
			 * {
			 * 	query : context.query,
			 * 	admin : false,
			 * 	id : "ndm-myx",
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
					return FormatXmlElement("client", {
						geo : query.attributes["Geo-Mean"],
						ip : query.sourceAddress,
					});
				}
				query ||= client.query;
				admin === undefined && (admin = client.admin);
				var command, icon;
				if(client.userId){
					import ru.myx.ae3.help.QueryString;
					var params = QueryString.parseQueryString(query.parameterString, "utf-8");
					delete params.authUserId;
					command = "?" + FormatQueryStringParameters(params);
					icon = "cross";
				}
				return FormatXmlElement("client", {
					id : String(client.id || ("string" === typeof client ? client : "")),
					admin : admin || client.admin,
					geo : query.attributes["Geo-Mean"],
					ip : query.sourceAddress,
					userId : client.userId,
					icon : icon,
					command : command,
					ae3 : query.parameters.ae3 === "true" || undefined,
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
				return ReplyException(
					ReplyObject( "unmaskable", query, layout)
				);
			}
		},
		layoutAccessDeniedUnmaskable : {
			value : function(query, message, detail){
				return ReplyException(
					ReplyObject( "unmaskable", query, this.makeAccessDeniedLayout(message, detail) )
				);
			}
		},
		makeAccessDeniedLayout : {
			execute : "once",
			get : function(){
				return PREPARE_MESSAGE.bind(this, 403, "Access Denied");
			}
		},
		makeUpdateSuccessLayout : {
			execute : "once",
			get : function(){
				return PREPARE_MESSAGE.bind(this, 200, "Success");
			}
		},
		makeClientFailureLayout : {
			execute : "once",
			get : function(){
				return PREPARE_MESSAGE.bind(this, 400, "Client Error");
			}
		},
		makeNotFoundLayout : {
			execute : "once",
			get : function(){
				return PREPARE_MESSAGE.bind(this, 404, "Unavailable");
			}
		},
		makeServerFailureLayout : {
			execute : "once",
			get : function(){
				return PREPARE_MESSAGE.bind(this, 500, "Server Error");
			}
		}
	}
);
