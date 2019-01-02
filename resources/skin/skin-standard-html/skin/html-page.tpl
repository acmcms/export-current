<%
%><%FINAL: "text/html" %><%
		//
			<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
			^^^ IE6 classic engine which is not fucked so much
			http://www.netmechanic.com/news/vol4/html_no22.htm
			
			BUT NOT COMPATIBLE WITH LAYOUTS AND DEBUG
			
			
			Layout:
				template		: exactly "html-page"
				
				title			: page title
				
				body			: whole body (including <body> [or <frameset> tag])
				
				keywords		: comma-separated keyword list
				
				requireCss		: collection of CSS names
				
				requireJs		: collection of JS names, supports order, every script will be requested only once
				
				require			: collection of JSO names, supports order, every object will be requested only once
									those are for preload only, should happen async and actual require() call still
									expected.
				
				pathPrefix		: prefix path to add to CSS and JS urls, default: Request.urlBase + '/client/'
				
				defaultCss		: default: undefined, use boolean false to exclude it
				
				useRequire		: default: undefined, force use require.js for javascript and styles, or default
				
				useDebug		: default: undefined, force use debug.js, or default
				
				useJQuery		: default: undefined, force use jQuery library, or default. Specify 'true' for current version.
				
				useYUI			: default: undefined, force use YUI-core library, or default
				
				head			: part of head (excluding <head> tag)
				
				doctype			: 'html', 'standard', 'ieQuirks', 'ie6', 'strict', 'frameset', 'loose', 'GWT'
				
				uaCompatible	: 'standard', 'chromeFrame', 'IE9', 'IE8', 'IE7', undefined
				
			URL parameters:
				__override_doctype		: overrides content.doctype
				
				__override_uaCompatible	: overrides content.uaCompatible
				
				__use_debug				: request to use debug

				__no_debug				: disable debug
				
				__use_require			: request to use require

				__no_require			: disable require
				
	%><%CODE: 'ACM.ECMA' %>
		/**
		 * General
		 */
		var request = context.query,
			parameters = request.parameters || {},
			settings = request.settings || {}; 
		/**
		 * Choose DOCTYPE
		 */
		var docTypes = {
		
			standard:	'<!doctype html>\r\n' +
						'<html>',
			
			html	:	'<!doctype html>\r\n' +
						'<!--   _/_/_/_/      _/_/_/_/    _/      _/  \r\n' +
						'    _/      _/    _/            _/_/  _/_/   \r\n' +
						'   _/      _/    _/            _/  _/  _/    \r\n' +
						'    _/_/_/  _/    _/_/_/_/    _/      _/  -->\r\n' +
						'<html>',
						
			ieQuirks:	'<!--   _/_/_/_/      _/_/_/_/    _/      _/   msie\r\n' +
						'    _/      _/    _/            _/_/  _/_/    quirks mode\r\n' +
						'   _/      _/    _/            _/  _/  _/     activation\r\n' +
						'    _/_/_/  _/    _/_/_/_/    _/      _/      -->\r\n' +
						'<!doctype html>\r\n' +
						'<html>',
			
			ie6		:	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">' +
						'<html>',
			
			GWT		:	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' +
						'<html>',
			
			strict	:	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' +
						'<html>',
			
			frameset:	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">' +
						'<html>',
			
			loose	:	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">' +
						'<html>',
			
			xhtml	:	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11-transitional.dtd">' +
						'<html xmlns="http://www.w3.org/1999/xhtml">'
			
		};
		
		var docType = docTypes[ parameters.__override_doctype || content.doctype ];
		if(!docType){
			var ua = (request.attributes["User-Agent"] || ''),
				ii = ua.indexOf("MSIE "),
				idx,
				msie;
			{ // check IE6
				idx = ua.indexOf("MSIE 6.0;");
				msie = idx != -1 && idx === ii;
				msie && (docType = docTypes.ie6);
			}
			if(!docType){ // check IE7
				idx = ua.indexOf("MSIE 7.0;"),
				msie = idx != -1 && idx === ii;
				msie && (docType = docTypes.loose);
			}
		}
		if(!docType){
			var body = (content.body || '').trim();
			docType = body.startsWith("<frameset") || body.startsWith("<FRAMESET")
				? docTypes.frameset
				: docTypes.html;
		}
		= docType;
		/**
		 * done
		 */
		 
		/**
		 *	This thing should be here: 
		 *	%><html><% 
		 *	but it is already included in 'docType' stuff 
		 */
			%><head><%
				// we generate UTF-8 content by default
				%><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><%
				if( docType === docTypes.html ) {
					%><meta charset="utf-8"><%
				}
				
				// no cache? probably this should be triggered by some response properties
				%><meta http-equiv="Cache-Control" content="no-cache, max-age=0"><%
				%><meta http-equiv="Pragma" content="no-cache"><%
			
				var uaCompatible = parameters.__override_uaCompatible || content.uaCompatible;
				switch( uaCompatible ){
				case 'standard':
					%><meta http-equiv="X-UA-Compatible" content="IE=9;IE=Edge,chrome=1"><%
				break;
				case 'chromeFrame':
					%><meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"><%
				break;
				case 'ie9':
					%><meta http-equiv="X-UA-Compatible" content="IE=9"><%
				break;
				case 'ie8'
					%><meta http-equiv="X-UA-Compatible" content="IE=8"><%
				break;
				case 'ie7'
					%><meta http-equiv="X-UA-Compatible" content="IE=7"><%
				break;
				default:
					if( uaCompatible ){
						%><!-- WARNING: uaCompatible, invalid value: <%= Format.xmlNodeValue( uaCompatible ) %> --><%
					}
				}

				%><title> <%= content.title || content.defaultTitle || "ACM.CMS" %> </title><%

				// keywords feature
				if(content.keywords || settings.keywords){
					var keywords = Format.uniqueWords( 
						(content.keywords || '') + ' ' + (settings.keywords || ''), 
						' ' 
					);
					if(keywords){
						%><meta name="keywords" content="<%= keywords %>"><%
					}
				}
			
				var pathPrefix = content.pathPrefix || (request.urlBase + '/client/');
			
				%><base href="<%= Format.xmlAttributeFragment(
					/**
					 * as opposed to 'request.url' this one doesn't have queryString in it.
					 */ 
					request.urlBase + request.resourcePrefix + request.resourceIdentifier 
				) %>" /><%
			
				var requireCssSeen = {}; 
				if( content.defaultCss !== false ){
					requireCssSeen['default'] = true;
					%><link href="<%= pathPrefix %>css/default.css" type="text/css" rel="stylesheet"><%
				}
				for( var cssCurrent in content.requireCss ){
					if( cssCurrent && !requireCssSeen[cssCurrent] ){
						requireCssSeen[ cssCurrent ] = true;
						var href = cssCurrent.startsWith("http:") || cssCurrent.startsWith("https:")
							? cssCurrent
							: (cssCurrent.startsWith("/") 
								? request.urlBase 
								: pathPrefix + "css/")
									+ cssCurrent + ".css";
						%><link href="<%= Format.xmlAttributeFragment( href ) %>" type="text/css" rel="stylesheet"><%
					}
				}
			
				var useJQuery =
					// IS explicitly requested in page content OR
					content.useJQuery === true || 
					
					// NOT explicitly disabled in page content AND NOT disabled in query AND
					content.useJQuery !== false && ((
					
						!parameters.__no_jquery && (
						
							// requested in query OR
							parameters.__use_jquery ||
							
							// requested in skin settings OR
							settings.useJQuery
							
						)) || 
						// assiming that string contains jQuery version
						(typeof content.useJQuery === "string" && content.useJQuery) || 
						// assiming that string contains jQuery version
						(typeof settings.useJQuery === "string" && settings.useJQuery) ||
						// use default version if evaluates to true as boolean
						(content.useJQuery || settings.useJQuery) && true
					);
				if( useJQuery ) { 
					useJQuery = { "1.4.4" : 1, "1.3.2" : 1, "1.5" : 1 }[useJQuery] 
						? useJQuery 
						: "1.8.3";
					%><script type="text/javascript" src="<%= Format.xmlAttributeFragment(
						request.protocolVariant.toLowerCase() === 'https'
							? "/!/skin/skin-standard-html/$files/jquery-"+useJQuery+".min.js"
							: "http://code.jquery.com/jquery-"+useJQuery+".min.js"
					) %>"></script><%
				}
			
				var useYUI =
					// IS explicitly requested in page content OR
					content.useYUI === true || (
					// NOT explicitly disabled in page content AND NOT disabled in query AND
					content.useYUI !== false && !parameters.__no_yui && (
					
						// requested in query OR
						parameters.__use_yui ||
						
						// requested in skin settings OR
						settings.useYUI
					));
				if( useYUI ) { 
					%><script type="text/javascript" src="<%= Format.xmlAttributeFragment(
						request.protocolVariant.toLowerCase() === 'https'
							? "http://yui.yahooapis.com/3.18.1/build/yui/yui-min.js" // not local yet
							: "http://yui.yahooapis.com/3.18.1/build/yui/yui-min.js"
					) %>"></script><%
				}
			
				var useDebug =
					// IS explicitly requested in page content OR
					content.useDebug === true || (
					// NOT explicitly disabled in page content AND NOT disabled in query AND
					content.useDebug !== false && !parameters.__no_debug && (
					
						// requested in query OR
						parameters.__use_debug ||
						
						// requested in skin settings OR
						settings.useDebug ||
						
						// testing share point OR
						attributes.testing ||
						 
						// testing host name
						('.'+request.target).indexOf('.test.') != -1
					));
				if( useDebug ) { 
					%><script type="text/javascript" src="<%= pathPrefix %>js/debug.js"></script><%
				}
	
				var useRequireJS =
					// IS explicitly requested in page content OR
					content.useRequire === true || (
					// NOT explicitly disabled in page content AND NOT disabled in query AND
					content.useRequire !== false && !parameters.__no_require && (
					
						// requested in query OR
						parameters.__use_require ||
						
						// requested in skin settings 
						settings.useRequire
					));
				var requireJsSeen = {};
				if( useRequireJS ){ 
					// with require.js
					var require = null;
					requireJsSeen['require'] = true;
					if( request.protocolVariant.toLowerCase() === 'https' ){
						// HTTPS - scripts are not cacheable! We gonna embed them in page.
						var response = Request.querySkin({
							timeout		: 60,
							verb		: "GET",
							skinner		: "skin-jsclient",
							resource	: "/js/require.js",
							parameters	: null,
							attributes	: {
								"User-Agent" : "Local"
							}
						});
						require = response ? response.toCharacter().getText() : "Not found";
						(!response || response.getCode() != 200) && 
							(require = "alert('FATAL: require.js error: " + Format.jsStringFragment( require ) + "')");

						/*
						// could be something like this
						var response = Request.queryLocal({
							timeout		: 0,
							verb		: "GET",
							resource	: "/!/skin/skin-jsclient/js/require.js",
							parameters	: null,
							arguments	: null,
							attributes	: null
						});
						*/
						%><script type="text/javascript"><%
							// lets hope it doesn't contain '<'+'/script>'
							= require;
						%></script><%
					}else{
						%><script type="text/javascript" src="<%= pathPrefix %>js/require.js"></script><%
					}
					%><script type="text/javascript"><%
						for( var jsCurrent in content.requireJs ){
							if( !requireJsSeen[jsCurrent] ){
								requireJsSeen[ jsCurrent ] = true;
								%>requireScript(<%= Format.jsString( jsCurrent + '.js' ) %>);<%
							}
						}
						for( var jsobCurrent in content.require ){
							var jsCurrent = jsobCurrent.replaceAll('.', '/');
							if( !requireJsSeen[jsCurrent] ){
								requireJsSeen[ jsCurrent ] = true;
								%>setTimeout(function(){<%
									%>require(<%= Format.jsString( jsobCurrent ) %>);<%
								%>},10);<%
							}
						}
					%></script><%
				} else { 
					// without require.js
					var jsCurrent, href;
					for( jsCurrent in content.requireJs ){
						if( !requireJsSeen[jsCurrent] ){
							requireJsSeen[ jsCurrent ] = true;
							href = jsCurrent.startsWith("http:") || jsCurrent.startsWith("https:") 
								? jsCurrent 
								: ((jsCurrent.startsWith("/") 
									? "" 
									: pathPrefix + "js/")
										+ jsCurrent + ".js");
							%><script type="text/javascript" src="<%= Format.xmlAttributeFragment( href ) %>"></script><%
						}
					}
				}
				
				%><link rel="shortcut icon" href="<%= request.urlBase %>/$files/favicon.ico" /><%
				%><link rel="icon" href="<%= request.urlBase %>/$files/favicon.ico" /><%
				= content.insertInHead || content.head || '';
			%></head><%
			= content.body || '<body><!-- no content! -->?</body>';
		%></html><%
		// TODO: add conditional so there is a way to remove the following debug comment
		%><!-- Generated at <% = ___ECMA_IMPL_HOST_NAME___ %> by <% = ___ECMA_IMPL_VERSION_STRING___ %> --><%
		// end of ecma code
	<%/CODE%><%
	
%><%/FINAL%><%
%>