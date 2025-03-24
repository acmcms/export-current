/**
 * TODO: ready-support for "/resources/"
 */

const UrlParseFn = URL.parse;

function buildIndexMenuReply(context, client, admin){
	const query = context.query;
	const parameters = query.parameters;
	switch(parameters.___output || "xml"){
	case "html-js":{
		var index = [];
		var extra = parameters.ref && 
					parameters.ref.startsWith(query.resourcePrefix) && 
					parameters.ref.substring(query.resourcePrefix.length) || undefined;
		var extras = extra && [];
		indexPushAllHtmlJs(index, this, "/", extra, extras, client, admin);
		if(extras?.length){
			extras.push({
				"icon" : this.icon || "house",
				"title" : "Root Menu",
				"group" : true,
				"submenu" : index,
			});
			index = extras;
		}
		if(client){
			index.push({
				"title" : "Log out", 
				"href" : "//no-login:no-password@" + query.targetExact + "/?logout", 
				"icon" : "door_out",
				// "access" : "public",
				// "ui" : true,
			});
		} else //
		if(this.auth || context.share.authenticationProvider){
			if(query.url.startsWith("http://") && query.toSecureChannel()){
				index.unshift({
					"title" : "Switch to secure connection", 
					"href" : "/?secure-login", 
					"icon" : "lock_go",
					// "access" : "public",
					// "ui" : true,
				});
			}else{
				index.unshift({
					"title" : "Log in", 
					"href" : "/?login", 
					"icon" : "key",
					// "access" : "public",
					// "ui" : true,
				});
			}
		}
		var html = "";
		$output(html){
			%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><%
			%><html><%
				%><head><%
					%><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><%
					%><script><%
						// menu structure
						// v 2.0 %)
						/**
						 * That's how submenu works!
						 */
						%>submenu = window.submenu = <%= Format.jsObject( index ) %>;<%
					%></script><%
				%></head><%
				%><body/><%
			%></html><%
		}
		return {
			"layout"	: "html",
			"content"	: html
		};
	}
	case "json":{
	}
	case "xml":{
		const share = context.share;
		const admin = share.authCheckAccountMembership(context, this.accountMembership || "admin");
		const auth = this.auth || share.authenticationProvider;
		var xml;
		$output(xml){
			%><index<%= Format.xmlAttribute("title", context.title || this.title) %> layout="menu" zoom="document"><%
				= Format.xmlElement("client", share.clientElementProperties(context));
				if(!client && auth && !this.authRequired){
					= internMakeLoginOptions(query, share, this);
				}
				= indexOutAllXml(this, "", client, admin, 1);
				if(client){
					var url = "//no-login:no-password@" + query.targetExact + "/?logout";
					%><command key="<%= url %>" icon="door_out" title="Log out" ui="true" access="public"/><%
				}
			%></index><%
		}
		return {
			layout	: "xml",
			xsl	: "/!/skin/skin-standard-xml/show.xsl",
			content	: xml,
			cache : false
		};
	}
	default:
		throw "Invalid output format requested: " + parameters.___output;
	}
}


const IndexPage = module.exports = require("ae3").Class.create(
	/* name */
	"IndexPage",
	/* inherit */
	require("./AbstractWebPage"),
	/* constructor */
	function(){
		this.AbstractWebPage();
		return this;
	},
	/* instance */
	{
		/**
		 * actual index commands
		 */
		"commands" : {
			value : {
				"contacts":{
					"group" : true,
					"ui" : true,
					"run" : {
						"commands" : {
							"http://myx.co.nz" : {
								title : "-= MyX =- (English)",
								ui : true
							},
							"http://myx.ru" : {
								title : "-= MyX =- (Russian)",
								ui : true
							},
						},
						"commandKeys" : function(){ return Object.keys(this.commands); },
						"getCommand" : function(key){ return this.commands[key]; },
					}
				}
			}
		},
		"onDrill" : {
			value : function onDrill(context){
				const query = context.query;
				const identifier = query.resourceIdentifier;
				if(identifier && identifier !== "/" && identifier !== "/index"){
					if(identifier === "/xml-request.xml"){
						return undefined;
					}
					const key = identifier.substring(1, ((identifier.indexOf("/", 1) + 1) || identifier.length + 1) - 1);
					const command = this.getCommand(key);
					if(!command){
						return undefined;
					}
					
					query.shiftRequested(key.length + 1, false);
					
					const handler = this.getCommandHandler(command, key);

					context.title = command.title;
					return handler;
				}
			}
		},
		"handle" : {
			value : function fnHandle(context){
				const query = context.query;
				const identifier = query.resourceIdentifier;
				const parameters = query.parameters;

				/**
				 * TODO: add index itself is not within "commands"
				 */
				if(identifier && identifier !== "/" && identifier !== "/index"){
					context.title = this.title;

					if(identifier === "/xml-request.xml"){
						return require("ae3.web/XmlMultipleRequest").handle(context, this);
					}
					var key = identifier.substring(1, ((identifier.indexOf("/", 1) + 1) || identifier.length + 1) - 1);
					var command = this.getCommand(key);
					if(!command){
						return undefined;
					}
					
					query.shiftRequested(key.length + 1, false);
					
					var handler = this.getCommandHandler(command, key);

					return (handler.handle || handler).call(handler, context);
				}

				const share = context.share;
				
				const auth = this.auth || share.authenticationProvider;

				var client;
				
				switch(query.parameterString){
				case "logout":{
					if(!auth){
						return this.makeNotFoundLayout("No auth set up!");
					}
					client = require("ae3.util/AuthMap").create(this.AbstractWebPage.AUTH_LOGOUT_MAP).authRequireQuery(query);
					context.client = null;
					return share.makeAuthenticationLogoutReply(context);
				}
				case "secure-login":{
					if(!auth){
						return this.makeNotFoundLayout("No auth set up!");
					}
					var redirection = query.toSecureChannel();
					if(redirection){
						return redirection;
					}
				}
				/**
				 * pass-through
				 */
				// break;
				case "login":{
					if(!auth){
						return this.makeNotFoundLayout("No auth set up!");
					}
					context.title = this.titleUnauthenticated || context.title;
					share.authRequireDefault(context);
					return share.makeAuthenticationSuccessReply(context);
				}
				case "bbm-77k":{
					const ae3 = require("ae3");
					return ae3.Reply.binary(
							"BBM-77k", 
							query, 
							{
								"Content-Type" : "application/octet-stream",
								"Content-Disposition" : "attachment; filename=bbm-77k.bin",
							},
							ae3.Transfer.wrapCopier(new ArrayBuffer(77 * 1024)), 
							"bbm-77k.bin"
						)
						.setFinal()
					;
				}
				}
					
				if(auth){
					context.title = this.titleUnauthenticated || context.title;
					client = this.authRequired || identifier === "/index" || parameters.__auth === "force"
							? share.authRequireDefault(context)
							: share.authCheckDefault(context);
							
					/**
					 * TODO: optional auth
					 */
					if(!client){
						if(auth){
							if( parameters.login ){
								return share.makeAuthenticationFailedReply(context);
							}
							if( this.authRequired ){
								return share.makeAuthenticateReply(context);
							}
						}
						return this.buildIndexMenuReply(
							context, 
							undefined, 
							false
						);
					}
				}
				
				context.title = this.title;

				return this.buildIndexMenuReply(
					context, 
					client, 
					share.authCheckAccountMembership(context, this.accountMembership || "admin")
				);

			}
		},
		"buildIndexMenuReply" : {
			/**
			 * returns array
			 * 
			 * this = { "commandKeys" : [], "getCommand" : function(key) }
			 */
			value : buildIndexMenuReply
		}
	},
	/* static */
	{
		"create" : {
			/**
			 * 
			 * @param props { title, auth, menu, commands }
			 * @returns
			 */
			value : function createIndex(props){
				const page = new this();

				page.title = props.title || undefined;
				page.titleUnauthenticated = props.titleUnauthenticated || page.title || undefined;
				
				const auth = props.auth || this.authenticationProvider;
				auth && (page.auth = auth);
				props.authRequired && (page.authRequired = true);
				
				const menu = props.menu || DEFAULT_MENU;
				menu && (page.menu = menu);
				
				const commands = props.commands;
				if(commands){
					page.commands = commands;
					// commands.index && (commands.index.run ||= page);
				}
				
				return page;
			}
		}
	}
);

const HIDE_COMMAND_JS_BY_UI = {
	"false" : true,
	"jump" : true,
	"hidden" : true,
	"undefined" : true,
};

function indexPushAllHtmlJs(targetArray, index, prefix, extra, extras, client, admin){
	var key, command, item, link, x;
	for(key of (("function" === typeof index.commandKeys) ? index.commandKeys() : index.commandKeys)){
		if(prefix !== "/" && (key === "../" || key === "../index" || key.endsWith("/resource/documentation.xml") || key.endsWith("/documentation"))){
			continue;
		}
		command = index.getCommand(key);
		if(key != "index" && (command.hidden || HIDE_COMMAND_JS_BY_UI[command.ui])){
			continue;
		}
		if(command.access == "public" || client && (!command.access || command.access == "user") || admin){
			// new prefix
			item = {
				"title" : command.title || key,
				"access" : command.access || "user",
			};
			targetArray.push(item);
			
			/**
			 * will become new prefix
			 */
			link = command.link;
			if(link !== ""){
				link ||= key;
				/**
				 * no prefix for rooted links
				 */
				link[0] == "/" || link.lastIndexOf("://", 10) != -1 || (link = (prefix + link));
				item.href = link;
			}
			
			(x = command.icon) && (item.icon = x);
			(x = command.preview) && (item.preview = x);
			
			if(command.group){
				extra?.startsWith(link) && extras.unshift(item);
				indexPushAllHtmlJs(
					item.submenu = [], 
					index.getCommandHandler(command, key) ?? (key === "index" && index), 
					link, 
					extra, 
					extras, 
					client, 
					admin
				);
			}
		}
	}
}


function internMakeLoginOptions(query, share, Index){
	var url = query.url;
	var xml = "";
	$output(xml){
		if(url.startsWith("http://") && query.toSecureChannel()){
			const parsed = UrlParseFn(url);
			false && console.log(
				"Web::IndexPage:internMakeLoginOptions: insecure (with secure service available), %s, %s", 
				Format.jsObject(query.settings),
				Format.jsObject(share.settings)
			);
			= Format.xmlElement("command", {
				icon : "lock_go",
				title : "Switch to secure connection",
				key : parsed.port 
					? "/?secure-login" 
					: "https" + url.substring(4)
			});
			if(share.settings?.["custom-root-ca-pki-location"]){
				= Format.xmlElement("command", {
					icon : "accept",
					title : "The certificate to be trusted for secure connection with this server",
					key : share.settings["custom-root-ca-pki-location"]
				});
			}else{
				= Format.xmlElement("command", {
					key : "?login",
					icon : "error_delete",
					ui : false,
					hidden : true,
					access : "public",
					title : "(Non-Secure) Login using basic http authentication"
				});
			}
		}else{
			false && console.log(
				"Web::IndexPage:internMakeLoginOptions: secure (or no secure service available), %s, %s", 
				Format.jsObject(query.settings),
				Format.jsObject(share.settings)
			);
			= Format.xmlElement("command", {
				key : "?login",
				icon : "key_go",
				ui : true,
				access : "public",
				title : "Login using basic http authentication"
			});
			if(Index && Index.loginSession){
				= Format.xmlElement("command", {
					key : "?login",
					icon : "folder_key",
					ui : true,
					access : "public",
					title : "Login using session cookie and html form",
					preview : {
						depthLimit : 1,
						zoom : "row",
						layout : "form",
						variant : "form",
						action : "?login",
						fields : { 
							field : [ 
								{ name : "login", type : "string", title : "Login" }, 
								{ name : "password", type : "password", title : "Password" } 
							], 
							submit : [ { icon : "key_go", title : "Sign In" } ]
						},
					}
				});
			}
			if(Index && Index.signUp){
				= Format.xmlElement("command", {
					key : "?register",
					icon : "key_add",
					ui : true,
					access : "public",
					title : "Sign-Up (Register An Account)"
				});
			}
		}
	}
	return xml;
}


function indexOutAllXml(index, prefix, client, admin, depth){
	var key, command, item, link;
	for(key of (("function" === typeof index.commandKeys) ? index.commandKeys() : index.commandKeys)){
		if(prefix !== "" && (key === "../" || key.endsWith("/resource/documentation.xml") || key.endsWith("/documentation"))){
			continue;
		}
		command = index.getCommand(key);
		if(!command || command.ui === "hidden" || (command.depthLimit || 10) < depth){
			continue;
		}
		if(command.access === "public" || client && (command.access === "user" || !command.access) || admin){
			item = {
				icon : command.icon || undefined,
				title : command.title || key,
				depthLimit : command.depthLimit || undefined,
				ui : command.ui ?? undefined,
				hidden : !command.ui || undefined,
				access : command.access || "user",
				preview : command.preview || undefined,
			};
			
			/**
			 * will become new prefix
			 */
			link = command.link;
			if(link !== ""){
				link ||= key;
				/**
				 * no prefix for rooted links
				 */
				link[0] === "/" || link.lastIndexOf("://", 10) !== -1 || (link = (prefix + link));
				item.key = link;
			}
			
			if(command.group){
				%><index layout="menu" <%= Format.xmlAttributes(item) %>><%
					= indexOutAllXml(
						index.getCommandHandler(command, key) ?? (key === "index" && index), 
						link, 
						client, 
						admin, 
						depth + 1
					);
				%></index><%
			}else{
				= Format.xmlElement("command", item);
			}
		}
	}
	return "";
}
