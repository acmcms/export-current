const ae3 = require('ae3');

/**
 * TODO: robots.txt
 * 
 * TODO: favicon.ico
 * 
 * TODO: session manager
 * 
 */


const Share = module.exports = ae3.Class.create(
	/* name */
	"Share",
	/* inherit */
	require('./AbstractWebPage'),
	/* constructor */
	function(settings){
		this.AbstractWebPage();
		Object.defineProperty(this, "dateStarted", {
			value : new Date()
		});
		if(settings){
			Object.defineProperty(this, "settings", {
				value : settings
			});
		}
		return this;
	},
	/* inherit */
	{
		authenticationProvider : {
			value : undefined
		},
		helper : {
			value : require('ae3.l2.xml/helper')
		},
		/**
		 * actual index commands
		 */
		commands : {
			value : {
				"contacts":{
					group : true,
					ui : true,
					run : {
						commands : {
							"http://myx.co.nz" : {
								title : "-= MyX =- (English)",
								ui : true
							},
							"http://myx.ru" : {
								title : "-= MyX =- (Russian)",
								ui : true
							},
						},
						commandKeys : function(){ return Object.keys(this.commands); },
						getCommand : function(key){ return this.commands[key]; },
					}
				}
			}
		},
		onDrill : {
			value : null
		},
		onHandle : {
			value : function onHandle(context){
				const query = context.query;
				const identifier = query.resourceIdentifier;
	
				context.title = this.title; 
				
				/**
				 * TODO: add index itself is not within 'commands'
				 */
				if(identifier && identifier !== '/' && identifier !== '/index'){
					const parameters = query.parameters;
					const pos = identifier.indexOf('/', 1);
					const key = pos === -1 ? identifier.substring(1) : identifier.substring(1, pos);
					const command = this.getCommand(key);
					if(!command){
						return undefined;
					}
					
					query.shiftRequested(key.length + 1, true);
					
					const handler = this.getCommandHandler(command, key);
					
					context.title = command.title;
					return (handler.handle || handler).call(handler, context);
				}
	
	
				const parameters = query.parameters;
				const auth = this.authenticationProvider;
				var client;
				switch(query.parameterString){
				case 'logout':{
					if(!auth){
						return this.makeNotFoundLayout("No auth set up!");
					}
					client = require("ae3.util/AuthMap").create(AUTH_LOGOUT_MAP).authRequireQuery(query);
					context.client = null;
					return this.makeAuthenticationLogoutReply(context);
				}
				case 'secure-login':{
					if(!auth){
						return this.makeNotFoundLayout("No auth set up!");
					}
					const redirection = query.toSecureChannel();
					if(redirection){
						return redirection;
					}
				}
				/**
				 * pass-through
				 */
				// break;
				case 'login':{
					if(!auth){
						return this.makeNotFoundLayout("No auth set up!");
					}
					this.authRequireDefault(context);
					// auth.authRequireQuery(query);
					return this.makeAuthenticationSuccessReply(context);
				}
				case 'bbm-77k':{
					return ae3.Reply.binary(
							"BBM-77k", 
							query, 
							{
								"Content-Type" : "application/octet-stream",
								"Content-Disposition" : 'attachment; filename=bbm-77k.bin',
							},
							ae3.Transfer.wrapCopier(new ArrayBuffer(77 * 1024)), 
							"bbm-77k.bin"
						)
						.setFinal()
					;
				}
				}
				if(auth){
					client = parameters.format
						? auth.authRequireQuery(query)
						: auth.authCheckQuery(query);
						
					
					
					/**
					 * TODO: optional auth
					 */
					if(!client){
						if( parameters.login ){
							return this.makeAuthenticationFailedReply(context);
						}
						return this.makeAuthenticateReply(context);
					}
				}
				
				
				const admin = client && auth && auth.authCheckMembership(client, 'admin');
				return require('ae3.web/IndexPage').prototype.buildIndexMenuReply.call(this, context, client, admin);
			}
		},
		onUnknown : {
			value : function onUnknown(context){
				this.authRequired || context.query.parameters.__auth === 'force'
					? this.authRequireDefault(context)
					: this.authCheckDefault(context)
				return {
					layout : "message",
					code : 404,
					title : context.title || this.systemName,
					content : "The requested resource cannot be found.",
					detail : Format.jsDescribe(context.query)
				};
			}
		},
		onException : {
			value : function onException(context, e){
				const share = context.share;
				const value = e.thrownValue;
				if(value && value.layout){
					return value;
				}
				if(value || e.thrownDetail){
					return {
						layout : 'message',
						code : Number((e.thrownValue && e.thrownValue.code) || 409),
						reason : (e.thrownValue && e.message) || 'Request Error',
						message : e.thrownValue || e.message || e,
						detail : e.thrownDetail || undefined
					};
				}
				return share.makeServerFailureLayout(e.message || e, Format.throwableAsPlainText(e));
			}
		},
		authCheckAccountMembership : {
			value : function(context, membership){
				return !!this.authCheckAccount(context, membership);
			}
		},
		authCheckDefault : {
			value : function(context, membership){
				return this.authCheckAccount(context, membership);
			}
		},
		authRequireDefault : {
			value : function(context, membership){
				return this.authRequireAccount(context, membership);
			}
		},
		authCheckAccount : {
			value : function(context, membership){
				var client = context.client;
				if(client !== undefined){
					if(!client){
						if(membership){
							return null;
						}
						return client;
					}
					if(!membership){
						return client;
					}
				}
				const auth = this.authenticationProvider;
				if(client === undefined){
					if(!auth){
						context.client = null;
						return null;
					}
					const query = context.query;
					if(query.toSecureChannel()){
						context.client = null;
						return null;
					}
					client = auth.authCheckQuery(context.query);
					if(!client){
						/*
						if(!this.authRequired){
							client = new String('guest');
							client.id = "guest";
							client.guest = true;
							return context.client = client;
						}
						*/
						context.client = null;
						return null;
					}
					context.client = client;
				}
				
				if(!membership){
					return client;
				}
				if('string' === typeof membership){
					if(auth.authCheckMembership(client, membership)){
						return client;
					}
					return null;
				}
				if(Array.isArray(membership)){
					if(membership.some(auth.authCheckMembership.bind(auth, client))){
						return client;
					}
					return null;
				}
				throw new Error("Unsupported membership descriptor: " + Format.jsDescribe(membership));
			}
		},
		authRequireAccount : {
			value : function(context, membership){
				var client = context.client;
				if(client){
					if(client.guest){
						client = undefined;
					}else//
					if(!membership){
						return client;
					}
				}
				const auth = this.authenticationProvider;
				if(client === undefined || client === null){
					const query = context.query;
					if(!auth){
						throw this.layoutAccessDeniedUnmaskable(query, "No Authentication System Defined");
					}
					if(query.toSecureChannel()){
						throw this.layoutAccessDeniedUnmaskable(query, "Secure Connection Required");
					}
					client = auth.authRequireQuery(query);
					if(!client){
						// should not be here
						throw "authRequireQuery should not ever succeed without result that evaluates as true!";
					}
					if(client.guest){
						// should not be here
						throw "authRequireQuery should not ever return guest clients!";
					}
					context.client = client;
				}
				
				if(!membership){
					return client;
				}
				if('string' === typeof membership){
					if(auth.authCheckMembership(client, membership)){
						return client;
					}
					throw this.layoutAccessDeniedUnmaskable(context.query, "Group Membership Required");
				}
				if(Array.isArray(membership)){
					if(membership.some(auth.authCheckMembership.bind(auth, client))){
						return client;
					}
					throw this.layoutAccessDeniedUnmaskable(context.query, "Group Membership Required");
				}
				throw "Unsupported membership descriptor: " + Format.jsDescribe(membership);
			}
		},
		makeDocumentationReply : {
			value : function(context, layout){
				return (context.helper || this.helper).makeDocumentationReply(context, layout);
			}
		},
		makeDoneRefreshReply : {
			value : function(context, title, forward){
				return (context.helper || this.helper).makeDoneRefreshReply(title, forward);
			}
		},
		makeAuthenticationFailedReply : {
			value : function(context){
				return (context.helper || this.helper).buildAuthenticationFailedReply(context);
			}
		},
		makeAuthenticationSuccessReply : {
			value : function(context){
				return (context.helper || this.helper).buildAuthenticationSuccessReply(context);
			}
		},
		makeAuthenticationLogoutReply : {
			value : function(context){
				return (context.helper || this.helper).buildAuthenticationLogoutReply(context);
			}
		},
		makeAuthenticateReply : {
			value : function(context){
				return (context.helper || this.helper).buildAuthenticateReply(context);
			}
		},
		clientElementMenuProperty : {
			value : function(context){
				return {
					src : "/index?" + Format.queryStringParameters({
						"__auth" : context.client && context.client.id !== 'guest' ? 'force' : undefined,
						"__role" : "context-menu",
						ref : context.query.resourcePrefix
					})
				};
			}
		},
		clientElementProperties : {
			value : function(context, admin){
				const query = context.query;
				const client = context.client;
				const format = client && client.uiFormat || query.parameters.format || 'xml';
				const result = {
					geo : query.attributes['Geo-Mean'],
					ip : query.sourceAddress,
					format : format
				};
				if(!client || client.id === 'guest'){
					result.date = (new Date()).toISOString();
					if(format !== 'clean'){
						result.menu = !this.authRequired && this.clientElementMenuProperty(context) || undefined;
					}
					return result;
				}
				
				result.id = String(client.id || ("string" === typeof client ? client : ''));
				result.date = (client.date || (new Date())).toISOString();
				result.time = client.time;
				result.help = client.help;
				result.standalone = !!client.standalone;
	
				if(format === 'clean'){
					return result;
				}
				
				admin === undefined && (admin = client.admin);
				if(client.userId){
					import ru.myx.ae3.help.QueryString;
					var command = QueryString.parseQueryString(query.parameterString, 'utf-8');
					delete command.authUserId;
					command = '?' + Format.queryStringParameters(command);
					icon = "cross";
	
					result.userId = client.userId;
					result.icon = "cross";
					result.command = command;
				}
				
				result.admin = admin || undefined;
				result.menu = client.menu || this.clientElementMenuProperty(context) || undefined;
				result.ae3 = query.parameters.ae3 || undefined;
				
				return result;
			}
		},
	}
);
