/**
 * TODO: ready-support for '/resources/'
 */

const AbstractWebPage = module.exports = require('ae3').Class.create(
	/* name */
	"AbstractWebPage",
	/* inherit */
	require('./UiBasic'),
	/* constructor */
	function(){
		return this;
	},
	/* instance */
	{
		/**
		 * page title
		 */
		title : {
			value : "unitlted"
		},
		/**
		 * auth provider, no auth is not specified
		 */
		auth : {
			value : null
		},
		authRequired : {
			value : false
		},
		/**
		 * lib reference
		 */
		lib : {
			value : 'ae3.l2.xml/helper'
		},
		/**
		 * actual index commands
		 */
		commands : {
			value : null
		},
		handle : {
			value : function(context){
				const query = context.query;
				const identifier = query.resourceIdentifier;
				const parameters = query.parameters;

				const share = context.share;
				context.title = this.title;
				
				/**
				 * TODO: add index itself is not within 'commands'
				 */
				if(identifier && identifier !== '/' && identifier !== '/index'){
					if(identifier === '/xml-request.xml'){
						return require('ae3.web/XmlMultipleRequest').handle(context, this);
					}
					var key = identifier.substring(1, ((identifier.indexOf('/', 1) + 1) || identifier.length + 1) - 1);
					var command = this.getCommand(key);
					if(!command){
						return undefined;
					}
					
					query.shiftRequested(key.length + 1, false);
					
					var handler = this.getCommandHandler(command, key);
					

					return (handler.handle || handler).call(handler, context);
				}

				var client;
				if(this.auth){
					switch(query.parameterString){
					case 'logout':{
						client = require("ae3.util/AuthMap").create(AbstractWebPage.AUTH_LOGOUT_MAP).authRequireQuery(query);
						context.client = null;
						return share.makeAuthenticationLogoutReply(context);
					}
					case 'secure-login':{
						var redirection = query.toSecureChannel();
						if(redirection){
							return redirection;
						}
					}
					/**
					 * pass-through
					 */
					// break;
					case 'login':{
						share.authRequireDefault(context);
						return share.makeAuthenticationSuccessReply(context);
					}
					}
					
					client = this.authRequired || parameters.__auth === 'force'
							? share.authRequireDefault(context)
							: share.authCheckDefault(context);
				}
				
				/**
				 * TODO: optional auth
				 */
				if(!client && this.auth){
					if( parameters.login ){
						return share.makeAuthenticationFailedReply(context);
					}
					if( this.authRequired ){
						return share.makeAuthenticateReply(context);
					}
				}
				

				return require('ae3.web/IndexPage').prototype.buildIndexMenuReply.call(
					this, 
					context, 
					client, 
					share.authCheckAccountMembership(context, this.accountMembership || 'admin')
				);
			}
		},
		commandKeys : {
			value : function(){ 
				return Object.keys(this.commands); 
			}
		},
		getCommand : {
			value : function(key){ 
				return this.commands[key]; 
			}
		},
		getCommandHandler : {
			value : function(command, key){
				if(!key){
					throw new Error("No 'key'!");
				}
				if(!command){
					return undefined;
				}
				
				var run = command.run;
				if(!run){
					return undefined;
				}
				('string' === typeof run) && (run = require(run));
				
				/**
				 * if is an array
				 */
				var factory = run[0];
				if(!factory){
					return run;
				}

				('string' === typeof factory) && (factory = require(factory));
				return factory.apply(command, run.slice(1));
			}
		},
		menu : {
			value : null
		}
	},
	/* static */
	{
		AUTH_LOGOUT_MAP : {
			value : {
				"accounts" : {
					"guest" : {
						"logins" : {
							"no-login" : 1
						},
					},
				},
				"groups" : {
				},
				"passwd" : {
					"no-login" : {
						"hash" : require('ae3.util/Auth').makeHashForLoginAndPassword("no-login", "no-password"),
						"user" : "guest"
					}
				},
			}
		}
	}
);
